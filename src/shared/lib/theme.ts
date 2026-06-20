import { DOCUMENT, Service, effect, inject } from '@angular/core';
import { localStorageSignal } from './local-storage-signal';

export type Theme = 'dark' | 'light';

/**
 * 테마 전환.
 * 업무: 다크(기본)와 라이트를 토큰 스왑으로 오간다. 선택은 localStorage에 남고,
 * `<html data-theme>`에 반영돼 CSS 변수가 따라 바뀐다. UI 인프라일 뿐 업무 규칙은 없다.
 */
@Service()
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  readonly theme = localStorageSignal<Theme>('theme', 'dark');

  constructor() {
    // 선택을 문서 루트에 반영한다. 저장된 값이 있으면 시작 시 그대로 적용된다.
    effect(() => {
      this.doc.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
