import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { GENRE_LABELS, MovieRepository, type Movie } from '@/shared/api';

/**
 * 영화 상세 콘텐츠 — 표현(모달/페이지)을 모른다.
 * 업무: 한 영화의 정보를 보여 준다. movieId는 입력(페이지)이나 다이얼로그 컨텍스트(모달)에서 받는다.
 * 같은 콘텐츠를 한 번만 작성하고, 데스크톱 모달과 모바일 페이지가 이 컴포넌트를 함께 쓴다(ADR-0002).
 */
@Component({
  selector: 'movie-detail',
  imports: [HlmButton, HlmBadge],
  host: { class: 'block' },
  template: `
    @if (movie(); as m) {
      <article class="flex flex-col gap-5">
        <div class="flex gap-5">
          <div
            class="aspect-2/3 w-28 shrink-0 rounded-xl ring-1 ring-border sm:w-36"
            [style.background-color]="m.posterColor"
          ></div>
          <div class="flex min-w-0 flex-col gap-2">
            <div>
              <h2 class="text-2xl font-bold text-foreground">{{ m.title }}</h2>
              @if (m.originalTitle) {
                <p class="text-sm text-muted-foreground">{{ m.originalTitle }}</p>
              }
            </div>
            <p class="text-sm text-muted-foreground">{{ m.year }} · {{ m.runtime }}분</p>
            <p class="text-sm">
              <span class="font-semibold text-foreground">★ {{ m.ratingAverage }}</span>
              <span class="text-muted-foreground">({{ m.ratingCount }}명)</span>
            </p>
            <div class="flex flex-wrap gap-1.5">
              @for (g of m.genres; track g) {
                <span hlmBadge variant="secondary">{{ genreLabel(g) }}</span>
              }
            </div>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-foreground">{{ m.synopsis }}</p>

        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt class="text-muted-foreground">감독</dt>
          <dd class="text-foreground">{{ m.director }}</dd>
          <dt class="text-muted-foreground">출연</dt>
          <dd class="text-foreground">{{ m.cast.join(', ') }}</dd>
        </dl>

        <div class="flex items-center gap-3">
          <button hlmBtn (click)="share(m)">공유</button>
          @if (shareMessage()) {
            <span class="text-sm text-muted-foreground" role="status" aria-live="polite">
              {{ shareMessage() }}
            </span>
          }
        </div>
      </article>
    } @else if (!loading()) {
      <p class="py-10 text-center text-muted-foreground">영화를 찾을 수 없습니다.</p>
    }
  `,
})
export class MovieDetail {
  private readonly repo = inject(MovieRepository);
  // 모달로 열렸을 때만 컨텍스트가 있다(페이지로 열리면 null).
  private readonly ctx = injectBrnDialogContext<{ movieId?: string }>({ optional: true });

  readonly movieId = input<string>();
  private readonly resolvedId = computed(() => this.movieId() ?? this.ctx?.movieId ?? '');

  readonly movie = signal<Movie | undefined>(undefined);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.resolvedId();
      if (!id) return;
      this.loading.set(true);
      void this.repo.get(id).then((m) => {
        this.movie.set(m);
        this.loading.set(false);
      });
    });
  }

  readonly shareMessage = signal('');

  protected genreLabel(key: string): string {
    return GENRE_LABELS[key] ?? key;
  }

  /**
   * 공유(ADR-0008): 네이티브 공유 시트 → 링크 복사 순으로 폴백한다.
   * 기술: Web Share·Clipboard API는 보안 컨텍스트(HTTPS/localhost)에서만 동작한다.
   * LAN HTTP 등 비보안 환경에서는 레거시 execCommand로 복사하고, 항상 피드백을 남긴다.
   */
  protected async share(m: Movie): Promise<void> {
    const url = `${location.origin}/movies/${m.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: m.title, text: m.synopsis, url });
      } catch {
        // 사용자가 공유를 취소한 경우 — 무시한다.
      }
      return;
    }

    const copied = await this.copyToClipboard(url);
    this.flash(copied ? '링크가 복사되었습니다' : '이 환경에서는 공유를 지원하지 않습니다');
  }

  private async copyToClipboard(text: string): Promise<boolean> {
    // 보안 컨텍스트면 Clipboard API.
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // 권한 거부 등 — 레거시로 폴백한다.
      }
    }
    // 레거시 폴백: 비보안 컨텍스트에서도 동작한다.
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  private flash(message: string): void {
    this.shareMessage.set(message);
    setTimeout(() => this.shareMessage.set(''), 2500);
  }
}
