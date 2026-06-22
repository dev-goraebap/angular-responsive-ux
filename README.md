# 반응형 웹 UX 전략 (영화 카탈로그 데모)

하나의 코드베이스로 데스크톱 웹과 모바일 웹에서 각각 그 환경에 맞는, 앱에 가까운 경험을
어떻게 제공할지를 다루는 데모입니다. 무대는 영화 카탈로그이고, 렌더링은 CSR입니다.
SSR은 다루지 않습니다(자매 프로젝트 `angular-ssr-design`의 주제).

핵심 질문은 하나입니다 — 같은 화면이라도 사용자가 기대하는 동작은 환경마다 다른데, 그 차이를
어디에 어떻게 책임지게 둘 것인가. 자세한 배경과 결정은 [docs/](docs/)에 정리되어 있습니다.

## 무엇을 보여 주나

- **적응형 표현**: 영화 상세가 데스크톱에서는 모달, 모바일에서는 풀스크린 페이지로 갈립니다.
  평점 입력은 데스크톱 모달 ↔ 모바일 바텀시트. 콘텐츠는 한 번만 작성하고 표현만 스왑합니다.
- **뒤로가기로 닫기**: 오버레이가 떠 있을 때 뒤로가기 한 번이면 닫힙니다(CloseWatcher + history fallback).
- **적응형 내비**: 하단 탭바(모바일)와 사이드/상단(데스크톱).
- **제스처**: 끌어서 닫기와 스와이프(속도까지 보는 판정), safe-area(`viewport-fit=cover`).
- **목록 UX**: 무한 스크롤 + 가상 스크롤, 스크롤 위치 복원, pull-to-refresh.
- **공유**: 모바일 네이티브 공유 시트(`navigator.share`) + 데스크톱 링크 복사.

## 외형은 소유, 동작은 차용

반응형 웹앱의 모바일 UX를 챙기는 가장 쉬운 길은 Ionic이나 Angular Material 같은 완성형
프레임워크입니다. 빠르게 출발하는 대신 제어권을 내줍니다. 컴포넌트가 마크업을 캡슐화할수록
바깥 스타일이 안쪽까지 닿지 못하고, 디자인의 상당 부분을 프레임워크의 언어에 위임하게 됩니다.

이 프로젝트는 **spartan/ui**를 택했습니다. 동작과 접근성은 **Brain**(`@spartan-ng/brain`,
Angular CDK 위의 헤드리스 프리미티브)에서 차용하고, 외형은 **Helm**(`@spartan-ng/helm`,
Tailwind로 스타일링된 컴포넌트)을 프로젝트로 복사해 소유·수정합니다. raw CDK 위에 프리미티브를
매번 손으로 짜는 수고를 덜면서도, 마크업이 light DOM에 남아 Tailwind가 모든 요소에 닿습니다.

적응형 분기·끌어서 닫기·뒤로가기 닫기는 spartan이 기본 제공하지 않으므로, 그 위에 도메인을
모르는 공용 컴포넌트(`AdaptiveDialog`/`AdaptiveSheet`)로 우리가 얹습니다. 쓰는 쪽은 분기를
알 필요가 없습니다.

## 스택

Angular 22 · spartan/ui (Brain + Helm) · Tailwind v4 · GSAP · Dexie(IndexedDB). CSR PWA.

## 빠른 시작

```bash
npm install
npm start
# http://localhost:4200
```

창 폭을 1024px 경계로 넓혔다 줄이면 상세(모달 ↔ 페이지)와 내비(사이드 ↔ 탭바)가
전환되는 것을 볼 수 있습니다.

### 같은 WiFi에서 모바일로 보기

```bash
npm start -- --host 0.0.0.0
# PC의 WiFi IPv4 주소 확인 후 폰에서 http://<그-IP>:4200
# Windows: ipconfig / macOS: ipconfig getifaddr en0 / Linux: hostname -I
```

실제 터치 환경이라 끌어서 닫기·스와이프·공유 시트를 제대로 확인하기 좋습니다.
(안 열리면 방화벽이 Node를 막는 경우가 많습니다 — 개인 네트워크 허용.)

## 명령어

```bash
npm start        # 개발 서버 (http://localhost:4200)
npm run build    # 프로덕션 빌드 (dist/)
npm test         # 단위 테스트 (Vitest)
```

## 프로젝트 구조 (Feature-Sliced Design)

```
src/
  app/        # 부트스트랩, 셸, 라우팅, 프로바이더
  pages/      # 라우트 화면 (home, movies, movie-detail, search, wishlist, my-ratings, login)
  widgets/    # 여러 페이지가 쓰는 블록 (app-nav)
  shared/
    ui/       # spartan Helm + 공용 AdaptiveDialog/AdaptiveSheet, 오버레이 닫기 디렉티브
    lib/      # breakpoint, theme, gsap, liveQuery/localStorage 브리지
    api/      # Dexie DB, movie/wishlist/rating repository
  styles.css  # Helm 프리셋 + 테마 변수
```

의존은 아래 방향으로만 흐릅니다(app → pages → widgets → features → entities → shared).

## 문서

- [docs/01.기획/](docs/01.기획/): 프로젝트 브리프 + 리서치(기술 스택, 모바일 인터랙션, 데이터 저장)
- [docs/02.설계/](docs/02.설계/): 기술·UX 결정을 담은 ADR 모음(`README.md`가 인덱스)
