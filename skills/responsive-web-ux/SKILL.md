---
name: responsive-web-ux
description: Guidance for designing and implementing responsive web UX strategies and patterns, bridging user expectations between desktop and mobile.
---

# Responsive Web UX Strategy Skill

이 스킬은 에이전트가 반응형 웹 환경에서 데스크톱과 모바일 사용자의 이질적인 요구사항을 일관되게 만족시킬 수 있도록 UX 레이아웃과 인터랙션 모델을 설계하고 구현할 때 사용하는 전문 가이드라인입니다.

특정 프런트엔드 프레임워크나 특정 라이브러리에 종속되지 않으며, 반응형 UX 패턴의 **핵심 개념**, **설계 원리**, **기술 대안 탐색**, 그리고 **사용자와의 협의 프로토콜**을 제공합니다.

---

## 핵심 철학 및 개념

반응형 웹은 단순한 '가변 레이아웃(Fluid Layout)'을 넘어, **기기 특성과 뷰포트에 맞추어 최적화된 컴포넌트 표현 방식과 인터랙션 모델을 교체(Adaptive Swapping)하는 것**입니다.

1. **관심사의 분리 (Separation of Concerns)**
   - 비즈니스/콘텐츠 컴포넌트(예: 영화 상세, 입력 폼 등)는 자신이 어떤 UI 그릇(모달 다이얼로그, 바텀시트, 단독 페이지 등)에 담겨 표현되는지 알지 못하게(Context-agnostic) 설계해야 합니다. 오직 데이터와 입력 이벤트에만 집중하도록 만들고, 표현 래퍼(Wrapper)나 오버레이 서비스를 사용하여 렌더링 방식을 결정합니다.
2. **웹 표준 API 우선주의 (Web Standard APIs First)**
   - 브라우저 표준 명세인 `CloseWatcher`, `VisualViewport`, `navigator.share`, `navigator.vibrate` 등을 적극 활용하여 네이티브 앱에 준하는 모바일 피드백을 제공하고, 미지원 브라우저를 위해 점진적 향상(Progressive Enhancement) 및 견고한 Fallback을 구현합니다.
3. **가로채기(Hijacking) 기반의 Canonical URL**
   - 웹의 핵심 가치인 **공유 가능성(Shareability)**과 **딥링크(Deep Link)**를 보존해야 합니다. 데스크톱에서는 목록에서 상세 화면으로 진입할 때 모달(Overlay)로 가로채어 표시하고, 모바일에서는 새로운 페이지로 전환하되, 양쪽 환경 모두 브라우저 주소창의 URL은 리소스 고유 주소(Canonical URL)를 가리켜야 합니다.

---

## 5대 핵심 반응형 UX 패턴 설계 전략

### 1. 적응형 표현 (Adaptive Presentation)
* **데스크톱 (모달/팝오버)**: 넓은 화면을 활용하여 직전의 목록 컨텍스트를 유지할 수 있는 중앙 모달을 활용합니다.
* **모바일 (풀스크린/바텀시트)**: 물리적 크기가 작은 화면에서는 중앙 모달 대신 하단 바텀시트나 전체 화면 페이지를 활용해 가독성과 터치 도달률을 확보합니다.
* **설계 지침**:
  - CSS 미디어 쿼리(컨테이너 쿼리)를 사용해 컴포넌트 자체의 정적 스타일을 조정하고, JS의 Breakpoint 관찰기(예: `ResizeObserver`, 프레임워크의 Breakpoint 관찰 유틸)를 사용하여 동적 렌더링 분기(모달 서비스 호출 vs 라우팅 이동)를 결합합니다.

### 2. 뒤로가기 & 오버레이 연동 (CloseWatcher & Back Button Control)
* **기대 수준**: 모바일 사용자는 화면 위에 다이얼로그나 바텀시트가 떠 있는 상태에서 하드웨어/제스처 뒤로가기를 하면, 이전 웹 페이지로 가는 대신 **현재 활성화된 오버레이만 닫히기를** 원합니다.
* **설계 지침**:
  - 최신 표준 API인 **`CloseWatcher`**를 우선 바인딩하여 닫기 신호(Esc 키, 뒤로가기 제스처 등)를 수신합니다.
  - `CloseWatcher`가 작동하지 않는 구형/타사 브라우저(iOS Safari 등)를 위해 `history.pushState`로 가짜 엔트리를 생성한 후 `popstate`를 구독하거나, SPA 라우터의 내비게이션 훅(Navigation Guard/Event)을 통해 오버레이를 해제하도록 처리합니다.
  - **주의 (Clean-up Rule)**: 오버레이 안의 닫기 버튼이나 외부 백드롭을 눌러 직접 오버레이가 닫히는 시점에도 가짜 히스토리 엔트리를 제거(`history.back()` 또는 라우터 복구)해야 합니다. 그렇지 않으면 이후 사용자가 뒤로가기를 누를 때 화면 변화 없이 히스토리만 헛도는 문제가 발생합니다.

### 3. 적응형 네비게이션 (Adaptive Navigation)
* **모바일**: 한 손 조작과 엄지손가락 접근 범위를 고려하여 하단 탭바(Bottom Tab Bar)를 배치합니다. 
  - 노치나 홈 바 영역을 우회할 수 있도록 `env(safe-area-inset-bottom)` 스타일 변수를 하단 패딩에 할당하고, HTML 메타태그에 `viewport-fit=cover`를 명시합니다.
* **데스크톱**: 발견율을 극대화하기 위해 항상 노출되는 상단 가로 내비게이션이나 좌측 사이드바 구조를 취하며, 발견 속도와 과업 시간을 늦추는 햄버거 메뉴는 데스크톱에서 기본적으로 피합니다.

### 4. 목록 탐색 UX (List Navigation UX)
* **무한 스크롤 + 가상화**: 대용량 목록은 점진적 렌더링으로 돔(DOM) 개수를 제어하되, 터치가 멈추지 않도록 스크롤 로딩을 적용합니다.
* **접근성(A11y)**: 무한 스크롤은 스크린리더나 키보드 조작자에게 치명적일 수 있습니다. 따라서 반드시 다음을 보완합니다:
  - 키보드로 포커스 가능한 **"더 보기" 버튼**을 마크업 상에 두고 무한 스크롤과 병행 작동하게 설계합니다.
  - 새로운 아이템이 마운트될 때 `aria-live="polite"` 영역을 통해 사용자에게 동적으로 추가 로드 사실을 전송합니다.
* **스크롤 위치 복원**: 상세 보기 진입 후 목록으로 백네비게이션할 때, 이전에 머무르던 정확한 y축 스크롤 좌표와 노출 상태를 보존하고 복구해야 합니다. 렌더링 동기화 라이프사이클에 맞춰 강제로 복원 로직을 수행합니다.
* **Pull-to-refresh**: 터치 드래그 새로고침 제스처를 지원하되, 디바이스 네이티브 새로고침과 충돌하지 않도록 모바일 목록 컨테이너 최상단에 `overscroll-behavior-y: contain` 스타일을 적용합니다.

### 5. 모바일 제스처, 입력 및 피드백 (Mobile Gestures, Inputs & Feedbacks)
* **모바일 터치 제스처 설계의 어려움**:
  - 스와이프(Swipe), 팬(Pan), 드래그 앤 드롭(Drag & Drop), 바텀시트 드래그 닫기 등의 터치 인터랙션은 브라우저별 터치 감도, 관성(Inertia), 가속도(Velocity) 처리가 파편화되어 있습니다.
  - 특히 iOS Safari 및 최신 Android 크롬의 **에지 스와이프 뒤로가기(Edge swipe back)** 제스처와 수평 스와이프(예: 목록 스와이프 삭제)가 충돌하여 원치 않게 페이지가 뒤로 이동하거나 인터랙션이 씹히는 엣지 케이스가 빈번합니다.
* **검증된 라이브러리 우선 원칙**:
  - 터치 제스처 엔진을 바닐라 JS로 바닥부터 구현하는 것은 심각한 호환성 문제와 유지보수 비용을 초래하므로 지양해야 합니다.
  - 생태계별로 충분히 검증된 라이브러리(예: `Hammer.js`, `interact.js`, `@use-gesture`, 혹은 스와이프 전용 `Swiper`)나 터치 제스처가 내장된 헤드리스 UI 프레미티브(예: Vaul의 바텀시트 드래그 닫기 메커니즘)를 리서치하여 활용해야 합니다.
* **제스처의 보조 수단 마련 (접근성)**:
  - 제스처(스와이프 삭제 등)는 키보드나 스크린리더 사용자, 혹은 미세 제스처 조작이 어려운 사용자에게는 차단막이 됩니다. 따라서 제스처를 지원하더라도 **눈에 보이고 클릭 가능한 대체 버튼/액션**(예: 아이템 상세 진입 후 삭제 버튼 제공 또는 목록 한구석에 삭제 아이콘 기본 배치)을 반드시 병행 설계해야 합니다.
* **iOS 16px 룰**: iOS Safari 브라우저는 인풋 요소의 폰트 크기가 `16px` 미만일 때 포커스를 받으면 화면을 강제 줌(Zoom-in) 처리합니다. 모바일 해상도의 인풋 폰트 크기는 반드시 `16px` 이상으로 고정해 자동 줌을 유발하지 않게 합니다. (maximum-scale=1 등으로 줌을 강제 차단하면 접근성 지침 위반이 됩니다.)
* **키보드 레이아웃**: 입력 폼에 적절한 `inputmode`(numeric, tel, email 등) 및 `autocomplete` 옵션을 선언하고, 검색 용도에는 `autocapitalize="off"` 및 `correct="off"`를 적용합니다.
* **호버 상태 격리**: 터치 기기는 Hover 상태가 모호하므로, 마우스 툴팁이나 가이드 표시는 CSS `@media (hover: hover)` 미디어 쿼리 블록에 묶어 마우스 환경에서만 유효하게 만듭니다.
* **터치 타깃**: 모든 클릭/터치 타깃은 최소 `48px * 48px` 이상의 히트맵 영역을 보장하고 상호 간격을 최소 `10px` 이상 이격합니다.

---

## 에이전트 실행 프로토콜 (Step-by-Step Action Guide)

다른 프로젝트에서 반응형 UX 및 디자인 시스템을 구현하거나 점검할 때, 에이전트는 다음 단계를 순서대로 수행하며 **사용자와 지속적으로 대화 및 합의**해야 합니다.

### 1단계: 프로젝트 환경 조사 및 서칭 (Search & Research)
에이전트는 이 스킬만으로 작업을 즉시 단행하지 말고, 현재 프로젝트의 기술적 제약을 먼저 분석합니다.
* 적용 프레임워크(React, Vue, Solid, Angular 등) 및 디자인 시스템(Radix UI, Headless UI, Shadcn, Web Components 등) 조사.
* 브라우저 대응 표준 요구사항 확인(예: 구형 브라우저 대응 비중, PWA 필수 여부).

### 2단계: 최적의 기술 대안 식별
현재 기술 스택에 적합한 적응형 래퍼, 오버레이 및 **제스처 라이브러리**를 선별합니다.
* **예시 (React)**: 데스크톱 `Radix Dialog` + 모바일 `Vaul BottomSheet` + 리스트 스와이프는 `@use-gesture` 결합이 가능한지 검토.
* **예시 (Angular)**: `@angular/cdk/overlay` + 스와이프 제스처는 HammerJS 또는 커스텀 디렉티브 기반 검증된 라이브러리 연계 여부 확인.
* **예시 (Vanilla CSS/JS)**: `<dialog>` 태그 및 터치 제스처를 위한 `interact.js` 혹은 `Hammer.js` 도입 여지 설계.

### 3단계: 사용자와의 의사결정 합의 (User Alignment)
식별한 설계 대안을 기반으로 사용자에게 핵심 의사결정 포인트를 명시하여 합의합니다.
* **대화 가이드라인**:
  > "현재 프로젝트는 [프레임워크명] 기반으로 빌드되어 있습니다. 이에 데스크톱에서는 [대안A](예: 다이얼로그 모달)를 사용하고, 모바일 뷰포트에서는 [대안B](예: 바텀시트)로 전환하는 적응형 레이어를 설계하려고 합니다. 뒤로가기 처리는 [CloseWatcher/popstate fallback]을 활용하려 하며, 모바일 스와이프 등 제스처 인터랙션의 경우 수작업 구현 시 엣지 스와이프 충돌이 발생할 수 있어 [제스처 라이브러리명]을 활용해 엣지 케이스를 방어하고자 하는데, 이에 동의하시나요? 혹은 고려 중인 타 UI/제스처 라이브러리가 있으신가요?"
* 사용자가 동의하거나 특정 라이브러리를 요청하는 경우 이를 최우선 반영하여 아키텍처 설정을 확정합니다.

### 4단계: 적응형 인프라 구현 (Foundation)
뷰포트 브레이크포인트를 공통으로 격리하고, 프레젠테이션 계층을 래핑할 기본 구조를 shared/ui 영역에 먼저 구현합니다.
* 뷰포트 크기를 감지하는 훅 또는 서비스 구축.
* 데스크톱 모달과 모바일 바텀시트를 추상화하는 공용 오버레이 서비스 구현.

### 5단계: 관심사가 독립된 콘텐츠 작성 및 조립 (Component & Page Assembly)
* 순수 폼(Form)이나 데이터 상세 컴포넌트가 UI 래퍼의 형태(바텀시트인지 페이지인지)에 직접 의존하지 않게 작성합니다.
* 데이터 저장 상태, 햅틱 피드백, 공유 버튼 등을 뷰포트에 맞게 탑재하고 최종 검증합니다.

---

## 구현 레퍼런스 예시 (참고용)

### 예시 A: Angular 환경에서 CDK Overlay 기반 적응형 시트 서비스
아래는 모바일 바텀시트와 데스크톱 중앙 모달을 스왑하며 CloseWatcher/Router 이벤트를 사용해 뒤로가기 처리를 통합한 Angular 코드의 핵심 골격입니다.

```typescript
import { inject, Service, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Router, NavigationStart } from '@angular/router';
import { filter, take } from 'rxjs';
import { BreakpointService } from './breakpoint.service'; // 768px 분기 감지 서비스

export class AdaptiveSheetRef {
  private cleanup?: () => void;
  constructor(private overlayRef: any, readonly isMobile: boolean) {}

  _registerCleanup(fn: () => void) { this.cleanup = fn; }

  close() {
    this.cleanup?.();
    this.overlayRef.dispose();
  }
}

@Service()
export class AdaptiveSheetService {
  private overlay = inject(Overlay);
  private bp = inject(BreakpointService);
  private router = inject(Router);
  private injector = inject(Injector);

  open(component: ComponentType<any>, data?: any): AdaptiveSheetRef {
    const isMobile = this.bp.isMobile();
    
    // 모바일은 바텀시트 포지셔닝, 데스크톱은 중앙 배치
    const positionStrategy = isMobile
      ? this.overlay.position().global().bottom('0').left('0')
      : this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const ref = new AdaptiveSheetRef(overlayRef, isMobile);

    // 모바일 뒤로가기/Esc 대응: CloseWatcher 지원 브라우저는 CloseWatcher 바인딩
    const CloseWatcherClass = (globalThis as any).CloseWatcher;
    const watcher = CloseWatcherClass ? new CloseWatcherClass() : null;
    if (watcher) {
      watcher.onclose = () => ref.close();
    }

    // CloseWatcher 미지원 시, 라우터 페이지 이동이 감지되면 자동으로 오버레이 정리
    const navSub = this.router.events
      .pipe(filter(e => e instanceof NavigationStart), take(1))
      .subscribe(() => ref.close());

    ref._registerCleanup(() => {
      watcher?.destroy();
      navSub.unsubscribe();
    });

    const customInjector = Injector.create({
      providers: [{ provide: AdaptiveSheetRef, useValue: ref }],
      parent: this.injector
    });

    overlayRef.attach(new ComponentPortal(component, null, customInjector));
    overlayRef.backdropClick().subscribe(() => ref.close());
    
    return ref;
  }
}
```

### 예시 B: React 환경에서 CloseWatcher 기반의 모바일 오버레이 닫기 커스텀 훅
React 환경에서 다이얼로그나 드로어가 열릴 때 뒤로가기를 시스템 레벨에서 감지하여 닫아주기 위한 React 예제 가이드라인입니다.

```javascript
import { useEffect } from 'react';

/**
 * 모바일 뒤로가기 제스처 / ESC 키를 눌렀을 때 오버레이를 닫기 위한 훅
 * @param {boolean} isOpen - 오버레이 활성화 여부
 * @param {Function} onClose - 오버레이 해제 함수
 */
export function useCloseWatcher(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    // 브라우저에서 CloseWatcher API를 지원하는 경우
    if ('CloseWatcher' in window) {
      const watcher = new window.CloseWatcher();
      watcher.onclose = () => {
        onClose();
      };
      
      return () => {
        watcher.destroy();
      };
    }

    // CloseWatcher 미지원 시: History API Fallback
    // 가짜 엔트리를 생성하여 뒤로가기 차단 및 해제 연동
    const stateName = 'overlay-dismiss-watcher';
    window.history.pushState(stateName, '');

    const handlePopState = (event) => {
      // popstate가 발생하면 오버레이를 닫음
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // 만약 컴포넌트가 직접 닫기(X 버튼 등)로 소멸되는 중이라면, 가짜 히스토리 엔트리 정리
      if (window.history.state === stateName) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
}
```

---

## 추천 모바일 UI/UX 가이드 레퍼런스

이 방법론을 실제로 화면 및 인터랙션 설계에 적용할 때, 에이전트와 디자이너는 스킬 디렉토리에 동봉된 아래의 요약 지침 레퍼런스 문서를 참고하여 모바일 인터랙션을 최적화해야 합니다:

*   **[모바일 UI/UX 가이드라인 (Apple HIG·Material Design 발췌)](references/mobile-ux-guidelines.md)** (터치 타깃·모달리티·내비게이션·버튼 계층·입력·접근성 등 공식 가이드라인 요점, 하단에 1차 출처 링크)


