# Angular Responsive UX

> 모바일 웹 UI를 네이티브 앱에 가깝게 다듬는 방법을 하나씩 검증하는 데모 프로젝트입니다.
> 바텀시트, 제스처, safe-area, 네이티브 스크롤 감성 같은 패턴을 직접 구현하며,
> 그 과정에서 내린 설계 결정과 근거를 함께 기록합니다.

이 프로젝트는 완성된 UI 라이브러리를 채택하는 대신, **디자인을 직접 소유하는** 쪽을 택했습니다. 그 선택의 의미와 비용을 아래에 정리합니다.

---

## 기술 결정

| 항목 | 결정 |
|------|------|
| 프레임워크 | Angular 22 — standalone · signals · 새 control flow |
| UI 토대 | Angular CDK 단독 — 동작과 접근성만, 스타일 없음 |
| 스타일 | Tailwind CSS v4 — 자체 디자인 토큰으로 매핑 |
| 렌더링 | CSR (클라이언트 전용) — app-shell 모델 |
| 앱 형태 | PWA — service worker + manifest |

### CDK와 Tailwind를 함께 쓰는 이유

UI 라이브러리를 선택할 때의 핵심 트레이드오프는 **스타일 제어권**입니다.

Ionic이나 Material 컴포넌트는 마크업을 Shadow DOM 안에 캡슐화합니다. 캡슐화는 컴포넌트의 스타일을 외부로부터 보호한다는 이점이 있지만, 그 대가로 바깥에서 정의한 Tailwind 클래스가 컴포넌트 내부까지 닿지 못합니다. 디자인의 상당 부분을 라이브러리의 디자인 언어에 위임하게 됩니다.

Angular CDK는 다른 모델을 따릅니다. CDK는 **헤드리스 프리미티브** — 위치 계산, 포커스 트랩, 백드롭, 접근성처럼 구현이 까다로운 동작만 디렉티브와 서비스로 제공하고, 화면에 렌더링되는 마크업은 전부 애플리케이션의 light DOM에 남깁니다. 그 결과 Tailwind가 모든 요소에 적용됩니다. 디자인 자유도와 검증된 동작·접근성을 동시에 얻기 위해 이 조합을 택했습니다.

### CSR을 사용하는 이유

이 프로젝트는 클라이언트 사이드 렌더링(CSR)을 사용합니다. 그 배경을 정확히 짚으려면, 먼저 서버 사이드 렌더링(SSR)의 이점을 인정하는 데서 시작하는 것이 옳습니다.

SSR에는 분명한 이점이 있습니다. 서버가 완성된 HTML을 내려주므로 첫 화면이 빠르게 그려지고(First Contentful Paint), 검색 엔진과 소셜 미리보기가 콘텐츠를 바로 읽을 수 있습니다. 초기 렌더링 부담이 사용자 기기에서 서버로 옮겨가므로 저사양 환경에서도 유리합니다. 최신 메타프레임워크 대부분이 SSR을 기본으로 되살린 이유가 여기에 있습니다.

다만 이 이점을 **풍부한 클라이언트 상호작용과 동시에** 누리려 할 때 조율 비용이 생깁니다. 서버가 그린 HTML 위에 클라이언트 자바스크립트가 이벤트와 상태를 다시 연결하는 과정(하이드레이션)이 필요하고, 어떤 화면을 서버에서 그리고 어떤 화면을 클라이언트에 맡길지 라우트 단위로 결정해야 합니다. 이 조율 자체가 하나의 설계 영역입니다.

그런데 이 프로젝트의 화면을 구성하는 요소 대부분 — 바텀시트, 제스처, safe-area, 스크롤 감성 — 은 브라우저 런타임에 의존합니다. 서버에는 이들을 미리 렌더링할 정보가 없으므로, SSR이 가져다줄 이점이 여기서는 작습니다. 반면 SSR을 도입하면 클라이언트 전용 코드를 서버 환경에서 보호하고 하이드레이션을 조율하는 비용이 더해집니다. 이 맥락에서는 CSR의 단순함이 더 큰 이득입니다.

SSR과 CSR을 라우트별로 조율해 양쪽의 이점을 함께 취하는 방법 — 하이드레이션 전략, 부분 하이드레이션, 라우트별 렌더 모드 — 은 그 자체로 깊이 있는 주제입니다. 이 데모의 취지와는 결이 다르므로, 별도 프로젝트에서 다룹니다.

> 기술 스택 선택의 배경은 [docs/01.기획/리서치.md](docs/01.%EA%B8%B0%ED%9A%8D/%EB%A6%AC%EC%84%9C%EC%B9%98.md)에, 확정된 범위와 기능은 [docs/01.기획/프로젝트-브리프.md](docs/01.%EA%B8%B0%ED%9A%8D/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%B8%8C%EB%A6%AC%ED%94%84.md)에 정리되어 있습니다.

---

## 아키텍처

책임을 네 개의 층으로 나눕니다.

```
1. 디자인 시스템 (소유)   ── Tailwind 토큰 + 토큰으로 감싼 자체 컴포넌트
2. 헤드리스 프리미티브     ── Angular CDK (동작·접근성, 스타일 없음)
3. 모바일 UX 레이어        ── CDK + CSS + Pointer Events
4. PWA 셸                  ── service worker · manifest · 오프라인 캐싱
```

이 중 3층, 모바일 UX 레이어가 이 프로젝트의 작업 대부분을 차지합니다. 여기서 책임을 둘로 나눕니다.

- **CDK가 담당하는 부분** — Overlay(바텀시트·모달), DragDrop(스와이프·정렬), BreakpointObserver(적응형 분기), Scrolling(가상 스크롤), A11y(FocusTrap·LiveAnnouncer), Platform·Portal. 검증된 구현이 있는 동작은 다시 만들지 않습니다.
- **직접 구현하는 부분** — safe-area `env(safe-area-inset-*)`, 네이티브 스크롤 감성(`scroll-snap`·`overscroll-behavior`), 고수준 제스처(Pointer Events), 페이지 전환(Angular Animations, transform/opacity만). 추가 라이브러리 없이 웹 표준만으로 구현합니다.

여기에 한 가지 원칙을 적용합니다. **Tailwind 클래스는 구현 디테일이며, 공개 API가 아닙니다.** 디자인 시스템은 클래스 이름이 아니라 컴포넌트를 노출합니다. 클래스 이름을 외부에 노출하면 그것이 사실상의 API가 되어, 이후 내부 구현을 바꾸기 어려워지기 때문입니다.

---

## 시작하기

### 요구 사항

- Node.js 22.22.3+ / 24.15.0+ / 26.0.0+ (Angular 22 기준, Node 20 미지원)
- npm 11+

### 개발 서버

```bash
npm start        # = ng serve, http://localhost:4200
```

소스를 저장하면 화면이 자동으로 갱신됩니다.

> 한 가지 유의할 점이 있습니다. 서비스 워커는 `ng serve`에서 동작하지 않습니다. PWA 동작을 확인하려면 프로덕션 빌드 후 정적 서버로 띄워야 하며, 설치와 서비스 워커는 HTTPS(또는 localhost)를 요구합니다.

### 빌드

```bash
npm run build    # dist/ 에 프로덕션 빌드 산출
```

### 테스트 (Vitest)

```bash
npm test
```

---

## 로드맵

현재 Angular 22 + Tailwind v4 스캐폴딩이 완료된 상태입니다. 다음 순서로 한 층씩 구현합니다.

- [ ] **CDK 설치** — `npm install @angular/cdk`, `styles.css`에 `@import '@angular/cdk/overlay-prebuilt.css';` 추가
- [ ] **적응형 바텀시트/모달** — CDK `Overlay` + `BreakpointObserver`로 구현합니다. 모바일에서는 하단에서 올라오는 바텀시트, 데스크톱에서는 중앙 모달이 됩니다. `FocusTrap`, 백드롭 클릭 닫기, `safe-area-inset-bottom`, 열기/닫기 애니메이션을 포함합니다. 이 컴포넌트가 이후 패턴들의 참조 구현이 됩니다.
- [ ] **디자인 토큰 정의** — 색 / 간격 / 타이포 스케일을 정하고 Tailwind 설정에 매핑
- [ ] **기본 컴포넌트** — 버튼 · 인풋 등
- [ ] **PWA 셸** — `ng add @angular/pwa` (service worker + manifest + 아이콘)

> 컴포넌트에서 DOM에 접근할 때는 `afterNextRender()` 안에서 합니다. CSR 프로젝트에서도 이 규율을 지키면 렌더링 시점이 명확해지고, 이후 SSR을 도입할 여지도 함께 남습니다.

---

## 코드 스캐폴딩

```bash
ng generate component features/bottom-sheet   # 컴포넌트
ng generate --help                            # 전체 스키매틱 목록
```

## 참고 자료

- [Angular CLI 명령 레퍼런스](https://angular.dev/tools/cli)
- [Angular CDK](https://material.angular.dev/cdk/categories)
- [Tailwind CSS v4](https://tailwindcss.com/)
