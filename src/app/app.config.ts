import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { requestPersistentStorage } from '@/shared/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: 라우트 파라미터(:id)를 컴포넌트 input으로 바인딩한다.
    provideRouter(routes, withComponentInputBinding()),
    // 시작 시 영속 저장소를 요청한다(실패해도 앱은 계속 뜬다).
    provideAppInitializer(() => {
      void requestPersistentStorage();
    }),
  ],
};
