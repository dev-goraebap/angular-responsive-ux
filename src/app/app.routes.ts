import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // 기능 라우트는 지연 로딩한다(번들 분할).
    loadComponent: () => import('@/pages/home/home'),
  },
  {
    // 영화 상세의 canonical 라우트. 데스크톱은 목록에서 모달로 가로채고,
    // 직접 진입·새로고침·모바일은 이 페이지로 렌더한다(ADR-0002).
    path: 'movies/:id',
    loadComponent: () => import('@/pages/movie-detail/movie-detail-page'),
  },
  {
    path: 'settings',
    loadComponent: () => import('@/pages/settings/settings'),
  },
];
