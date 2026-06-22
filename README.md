# 반응형 웹 UX 전략 (영화 카탈로그 데모)

하나의 웹 애플리케이션을 데스크톱과 모바일에서 함께 쓸 때, 두 환경의 사용자는 같은 화면을 두고도
다른 동작을 기대합니다. 데스크톱 사용자는 모달과 드롭다운, 마우스 호버에 익숙합니다. 모바일
사용자는 한 손이 닿는 하단 탭바와 바텀시트, 뒤로가기로 오버레이를 닫는 동작, 스와이프와 당겨서
새로고침을 기대합니다. 화면 폭에 따라 레이아웃의 열 수만 바꾸는 것으로는 이 차이가 메워지지
않습니다. 기대가 갈리는 것은 레이아웃이 아니라 동작이기 때문입니다.

이 프로젝트에 그 차이를 어떻게 다룰지 데모를 확인해보실 수 있습니다.

## 두 갈래 길: 프레임워크를 쓸 것인가, 디자인을 소유할 것인가

모바일 웹의 UX를 챙기는 길은 크게 둘로 나뉩니다.

하나는 **Ionic처럼 완성도 높은 프레임워크**를 쓰는 길입니다. 동작·스타일·접근성을 한 번에
제공하므로 빠르게 출발할 수 있습니다. 대가는 통제권입니다. 컴포넌트가 마크업을 캡슐화할수록
디자인의 상당 부분을 프레임워크의 언어에 맡기게 됩니다.

다른 하나는 **디자인 시스템을 직접 소유**하는 길입니다. 이 길을 택하면 프레임워크가 대신 해 주던
것들을 스스로 챙겨야 합니다. 무엇을 챙겨야 하는지 미리 알아 두면 선택이 쉬워집니다.

- **헤드리스 동작과 접근성** — 포커스 트랩, 오버레이 배치, ARIA. 보통 검증된 헤드리스
  라이브러리(예: Angular CDK, 또는 그 위에 얹힌 컴포넌트 모음)에서 가져옵니다.
- **적응형 표현** — 같은 콘텐츠를 화면 폭에 따라 모달·바텀시트·풀스크린 페이지 중 무엇에 담을지.
- **뒤로가기와 오버레이 닫기** — 오버레이가 떠 있을 때 시스템 뒤로가기로 페이지가 아니라 오버레이가
  닫히게 하는 일(CloseWatcher, History API, 또는 URL과 묶은 라우트 기반 모달).
- **제스처와 스크롤 물성** — 끌어서 닫기, 스와이프, 당겨서 새로고침, `overscroll-behavior`, safe-area.
- **입력과 피드백** — 가상 키보드가 입력칸을 가리는 문제 보정, 맥락에 맞는 키보드 타입, 햅틱, 공유.
- **목록 경험** — 무한 스크롤, 스크롤 위치 복원, 그리고 그것을 접근성으로 보완하기.

이 데모는 두 번째 길을 택해, 위 개념들을 실제로 어디에 두고 어떻게 구현하는지 보여 줍니다. 검증된
라이브러리를 조합하되, 환경에 따라 갈리는 동작은 그 위에 직접 얹습니다.

## 무엇을 보여 주나

- **적응형 표현**: 영화 상세가 데스크톱에서는 모달, 모바일에서는 풀스크린 페이지로 갈립니다.
  평점 입력은 데스크톱 모달과 모바일 바텀시트로 갈립니다. 콘텐츠는 한 번만 작성하고 표현만 바꿉니다.
- **뒤로가기로 닫기**: 오버레이가 떠 있을 때 뒤로가기 한 번으로 오버레이가 닫힙니다.
- **적응형 내비·검색**: 하단 탭바 ↔ 사이드 내비, 풀스크린 검색 ↔ 인라인 드롭다운.
- **목록 경험**: 무한 스크롤(접근성용 "더 보기"·`aria-live` 동반), 스크롤 위치 복원, 당겨서 새로고침.
- **회원 흐름과 공유**: 데모 로그인·위시리스트·별점, 그리고 네이티브 공유 시트와 링크 복사 폴백.

## 실행해 보기

Node 22 이상이 필요합니다.

```bash
npm install
npm start
# http://localhost:4200
```

브라우저 창 폭을 좁게(모바일) 또는 넓게(데스크톱) 바꾸면 상세·평점·검색·내비의 표현이 전환되는
것을 볼 수 있습니다.

### 같은 WiFi에서 실제 모바일로 확인하기

데스크톱 브라우저의 좁은 창과 실제 터치 기기는 다릅니다. 끌어서 닫기·스와이프·공유 시트는 실제
폰에서 확인하는 편이 정확합니다.

개발 서버를 LAN에 노출합니다.

```bash
npm start -- --host 0.0.0.0
```

PC의 WiFi IPv4 주소를 확인합니다.

```bash
# Windows: "무선 LAN 어댑터 Wi-Fi"의 IPv4 주소
ipconfig
# macOS
ipconfig getifaddr en0
# Linux
hostname -I
```

폰을 같은 WiFi에 두고 `http://<그-IP>:4200`을 엽니다(예: `http://192.168.0.10:4200`). 열리지
않으면 방화벽이 Node를 막는 경우가 많으니, 실행 시 뜨는 허용 창에서 개인 네트워크를 허용합니다.

> 네이티브 공유 시트(`navigator.share`)와 클립보드 API는 보안 컨텍스트(HTTPS·localhost)에서만
> 동작합니다. LAN의 HTTP 주소에서는 레거시 복사로 폴백하며, 공유 시트까지 확인하려면
> `ng serve --ssl --host 0.0.0.0`처럼 HTTPS로 띄워야 합니다.

### 명령어

```bash
npm start        # 개발 서버 (http://localhost:4200)
npm run build    # 프로덕션 빌드 (dist/)
npm test         # 단위 테스트 (Vitest)
```

## 스택과 구조

Angular 22 · spartan/ui · Tailwind v4 · Dexie(IndexedDB). 렌더링은 CSR. 구조는
Feature-Sliced Design을 따릅니다.

```
src/
  app/        # 부트스트랩, 셸, 라우팅, 프로바이더
  pages/      # home · movie-detail · genre · search · login · wishlist · my-ratings · settings
  widgets/    # app-nav(적응형 내비) · search-box(적응형 검색 입구)
  features/   # open-movie(적응형 상세 열기)
  entities/   # movie(카드 · 상세 · 평점 시트)
  shared/
    ui/helm/           # 스타일 컴포넌트
    ui/adaptive-sheet/ # 바텀시트 ↔ 모달 적응형 래퍼
    auth/ api/ lib/    # 인증, 저장소(Dexie), 뷰포트·테마·스토리지 유틸
  styles.css
```

의존은 한 방향으로만 흐릅니다: app → pages → widgets → features → entities → shared.

## 참고 자료

- [docs/01.기획/](docs/01.기획/) — 프로젝트 브리프와 리서치(기술 스택, 모바일 인터랙션, 데이터 저장)
- [docs/02.설계/](docs/02.설계/) — 설계 결정을 담은 ADR 모음(`README.md`가 인덱스)
- [모바일 UI/UX 가이드라인 발췌](skills/responsive-web-ux/references/mobile-ux-guidelines.md) — Apple HIG·Material Design 요점
- 1차 출처: [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), [Material Design](https://m3.material.io), [Nielsen Norman Group](https://www.nngroup.com)
