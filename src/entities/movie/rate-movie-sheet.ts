import { Component, inject, signal } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { HlmButton } from '@spartan-ng/helm/button';
import { AuthService } from '@/shared/auth';
import { RatingRepository } from '@/shared/api';
import { ADAPTIVE_SHEET_DATA, AdaptiveSheetRef } from '@/shared/ui/adaptive-sheet';

/** 시트를 여는 쪽이 넘기는 데이터. */
export interface RateMovieData {
  movieId: string;
  title: string;
  score: number;
}

/**
 * 평점 입력 — 적응형 시트의 콘텐츠(ADR-0002).
 * 업무: 별점을 고르고 저장/지우기 한다. 자신이 바텀시트인지 모달인지 모른다(표현은 AdaptiveSheet가 결정).
 * 결과(점수, 지우면 0)를 닫힘으로 돌려줘 호출한 쪽이 상태를 갱신한다.
 */
@Component({
  selector: 'rate-movie-sheet',
  imports: [HlmButton, CdkTrapFocus],
  host: { class: 'block' },
  template: `
    <div
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="data.title + ' 평점'"
      class="w-full rounded-t-2xl bg-popover p-5 text-popover-foreground shadow-lg outline-none
             animate-in fade-in-0 slide-in-from-bottom-4
             sm:w-[420px] sm:max-w-[90vw] sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95"
      style="padding-bottom: max(1.25rem, env(safe-area-inset-bottom))"
    >
      <!-- 모바일 그랩 핸들 -->
      <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-muted sm:hidden" aria-hidden="true"></div>

      <h2 class="text-lg font-semibold">평점 남기기</h2>
      <p class="mt-0.5 truncate text-sm text-muted-foreground">{{ data.title }}</p>

      <div class="mt-4 flex justify-center gap-1" role="group" aria-label="별점 선택">
        @for (n of stars; track n) {
          <button
            type="button"
            class="px-1 text-4xl leading-none"
            (click)="score.set(n)"
            [attr.aria-label]="n + '점'"
            [attr.aria-pressed]="score() >= n"
          >
            <span [class]="score() >= n ? 'text-yellow-500' : 'text-muted-foreground/40'">★</span>
          </button>
        }
      </div>

      <div class="mt-6 flex items-center justify-between gap-2">
        @if (data.score > 0) {
          <button hlmBtn variant="ghost" (click)="remove()">지우기</button>
        } @else {
          <span></span>
        }
        <div class="flex gap-2">
          <button hlmBtn variant="outline" (click)="ref.close()">취소</button>
          <button hlmBtn [disabled]="score() === 0" (click)="save()">저장</button>
        </div>
      </div>
    </div>
  `,
})
export class RateMovieSheet {
  protected readonly data = inject<RateMovieData>(ADAPTIVE_SHEET_DATA);
  protected readonly ref = inject<AdaptiveSheetRef<number>>(AdaptiveSheetRef);
  private readonly auth = inject(AuthService);
  private readonly rating = inject(RatingRepository);

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly score = signal(this.data.score);

  protected async save(): Promise<void> {
    const uid = this.auth.userId();
    if (!uid || this.score() === 0) return;
    await this.rating.set(uid, this.data.movieId, this.score(), new Date().toISOString());
    this.ref.close(this.score());
  }

  protected async remove(): Promise<void> {
    const uid = this.auth.userId();
    if (!uid) return;
    await this.rating.remove(uid, this.data.movieId);
    this.ref.close(0);
  }
}
