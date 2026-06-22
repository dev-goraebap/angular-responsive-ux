import { Component, inject } from '@angular/core';
import { MovieRepository, type Movie } from '@/shared/api';

/**
 * 홈 — 추천 영화와 전체 카탈로그.
 * 업무: 영화 데이터 계층(MovieRepository)을 검증하는 첫 화면이다.
 * 적응형 상세(데스크톱 모달 / 모바일 페이지)는 다음 단계에서 얹는다(ADR-0002).
 */
@Component({
  selector: 'page-home',
  host: { class: 'block h-full overflow-y-auto' },
  template: `
    <div class="flex flex-col gap-section px-lg py-xl">
      <header>
        <h1 class="font-display text-3xl font-bold text-ink">영화 카탈로그</h1>
        <p class="mt-xxs text-ink/70">반응형 UX 전략 데모 — 데스크톱과 모바일에서 다르게 동작합니다.</p>
      </header>

      @if (movies.featured().length > 0) {
        <section>
          <h2 class="mb-md font-display text-xl font-semibold text-ink">추천</h2>
          <div class="flex gap-md overflow-x-auto pb-xs">
            @for (movie of movies.featured(); track movie.id) {
              <article class="w-40 shrink-0">
                <div
                  class="flex aspect-2/3 items-end rounded-md p-md"
                  [style.background-color]="movie.posterColor"
                >
                  <span class="font-display text-lg font-bold text-white drop-shadow">
                    {{ movie.title }}
                  </span>
                </div>
                <p class="mt-xs truncate text-sm text-ink">{{ movie.title }}</p>
                <p class="text-xs text-ink/60">{{ movie.year }} · ★ {{ movie.ratingAverage }}</p>
              </article>
            }
          </div>
        </section>
      }

      <section>
        <h2 class="mb-md font-display text-xl font-semibold text-ink">전체</h2>
        <div class="grid grid-cols-2 gap-md tablet:grid-cols-3 laptop:grid-cols-4">
          @for (movie of movies.all(); track movie.id) {
            <article>
              <div
                class="flex aspect-2/3 items-end rounded-md p-md"
                [style.background-color]="movie.posterColor"
              >
                <span class="font-display font-bold text-white drop-shadow">{{ movie.title }}</span>
              </div>
              <p class="mt-xs truncate text-sm text-ink">{{ movie.title }}</p>
              <p class="text-xs text-ink/60">{{ genreLabels(movie) }}</p>
            </article>
          }
        </div>
      </section>
    </div>
  `,
})
export default class Home {
  protected readonly movies = inject(MovieRepository);

  protected genreLabels(movie: Movie): string {
    return `${movie.year} · ${movie.genres.join(', ')}`;
  }
}
