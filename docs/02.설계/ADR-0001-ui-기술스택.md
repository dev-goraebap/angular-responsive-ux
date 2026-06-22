# ADR-0001 · UI 기술스택

> 상태: ✅ 결정됨
> 일자: 2026-06-22
> 관련: [`docs/01.기획/프로젝트-브리프.md`](../01.기획/프로젝트-브리프.md), [`docs/01.기획/리서치.md`](../01.기획/리서치.md), [ADR-0002](./ADR-0002-적응형-표현-전략.md)

## 1. 맥락

이 프로젝트의 본질은 **하나의 코드베이스로 데스크톱·모바일 웹에서 각각 자연스러운 경험을 주는 반응형 UX 전략**을 시연하는 것이다. UI 토대는 그 시연의 그릇이되, 모바일에서 앱처럼 느껴지는 경험을 직접 통제할 수 있어야 한다.

평가 기준(우선순):
1. **디자인 소유 / 제어권** — 표현을 우리가 완전히 통제할 수 있는가
2. **모바일 UX 자력** — 적응형 시트·제스처·접근성을 어디까지 받쳐주는가
3. **CSR 정합** — 클라이언트 전용 환경에 맞는가(SSR 가드 부담 없음)
4. **출발 속도와 일관성** — 프리미티브를 매번 손으로 짜지 않고, 자매 프로젝트와 결을 맞추는가

판단 기준은 **"외형은 소유하되, 복잡한 동작 로직은 검증된 것을 활용한다"** 이다([리서치 §2](../01.기획/리서치.md)).

## 2. 검토한 대안

| 선택지 | 디자인 소유 | 모바일 UX | CSR 정합 | 비고 |
|--------|:---:|:---:|:---:|------|
| 풀 컴포넌트 키트 (Material/PrimeNG) | ✕ | △ | ○ | 디자인 언어가 따라옴 |
| Ionic | ✕ | ◎ | ○ | Shadow DOM이 Tailwind를 가로막음 |
| raw CDK + Tailwind + 전부 직접 구현 | ◎ | ○ | ◎ | 프리미티브까지 매번 손으로 — 느림·중복 |
| **spartan/ui (Brain + Helm) + GSAP** ✅ | ◎ | ○ | ◎ | Brain=CDK 기반 헤드리스, Helm=복사해 소유 |

## 3. 결정

**spartan/ui(Brain + Helm)를 채택하고, 제스처/모션은 GSAP로 보강한다.**

spartan은 두 계층이다.

- **Brain (`@spartan-ng/brain`)** — 접근성/동작 헤드리스 프리미티브. **Angular CDK 위에 만들어져 있다.** 즉 CDK는 사라지지 않고 Brain의 토대로 남는다. 우리는 raw CDK에 프리미티브를 직접 짜는 대신 검증된 Brain을 쓴다.
- **Helm (`@spartan-ng/helm`)** — Tailwind v4로 스타일링된 컴포넌트를 **프로젝트로 복사**한다. 우리가 소유·수정하므로 "외형 소유"가 그대로 성립한다.
- **Tailwind v4** — Helm 프리셋(`hlm-tailwind-preset.css`) + CSS 변수 토큰. 디자인 시스템의 출처는 이 테마다(기존 `DESIGN.md`는 폐기).
- **GSAP** — spartan이 주지 않는 끌어서 닫기·스와이프·속도 기반 모션.

이 결정은 **"외형은 소유(Helm 복사), 동작은 차용(Brain=CDK)"** 원칙과 정확히 맞물리고, 자매 프로젝트 `angular-ssr-design`의 ADR-0001과도 일치해 두 프로젝트의 UI 결을 맞춘다.

### 적응형 표현·뒤로가기 닫기는 우리가 얹는다

spartan에 `dialog`/`sheet`가 있으나, 이 프로젝트의 핵심인 **화면 폭에 따른 모달↔풀스크린/시트 분기**([ADR-0002](./ADR-0002-적응형-표현-전략.md)), **끌어서 닫기 제스처**, **뒤로가기로 닫기**([ADR-0003](./ADR-0003-뒤로가기-오버레이-닫기.md))는 기본 제공되지 않는다. 따라서:

- spartan `dialog`/`sheet`의 오버레이·포커스 트랩(Brain)을 **동작 기반으로 차용**하고,
- 화면 폭 분기는 CDK `BreakpointObserver`로 판단하며,
- 끌어서 닫기는 GSAP로, 뒤로가기 닫기는 CloseWatcher/history로 구현하여,
- 이 모두를 도메인을 모르는 공용 `AdaptiveDialog`/`AdaptiveSheet` 안에 캡슐화한다(쓰는 쪽은 분기를 모른다).

## 4. 주의사항

- **CDK는 spartan을 채택해도 남는다**(Brain의 토대 + `BreakpointObserver`·가상 스크롤은 직접 사용). "CDK 제거"가 아니라 "raw CDK 직접 조립을 줄이는" 선택이다.
- CSR 전용이라 SSR 하이드레이션 가드 부담은 없다. 다만 `BreakpointObserver`·DOM 측정은 브라우저 런타임 의존이므로 초기 분기는 **CSS 우선**으로 처리해 깜빡임을 줄인다.
- Helm 컴포넌트는 우리 레포에 복사되어 들어온다. 업스트림 수정은 `healthcheck`로 따라가되 Brain은 포크하지 않는다.

## 5. 채택하지 않은 것

- **풀 컴포넌트 키트**: 디자인 언어가 함께 따라와 "디자인 소유" 목표와 충돌.
- **Ionic**: Shadow DOM 캡슐화로 외부 Tailwind가 내부에 닿지 않는다.
- **raw CDK + 전부 직접 구현**: 프리미티브(버튼·다이얼로그·인풋…)까지 매번 손으로 짜야 해 느리고, 자매 프로젝트와 결이 갈린다. spartan이 그 반복을 덜어 주면서도 외형 소유는 유지된다. (이전 판단을 spartan 채택으로 개정함.)

## 6. 결과

- 👍 외형 소유(Helm 복사) + 검증된 접근성·동작(Brain/CDK)을 동시에.
- 👍 프리미티브를 직접 짜지 않아 출발이 빠르고, 자매 프로젝트와 일관.
- 👍 디자인 시스템 출처가 Helm 테마로 단일화(`DESIGN.md` 폐기).
- 👎 의존성 추가(`@spartan-ng/brain`, `@spartan-ng/cli`, `@ng-icons`), Helm 코드가 레포에 들어옴.
- 👎 적응형 분기·제스처·뒤로가기 닫기는 여전히 직접 조립(비용은 ADR-0002·0003·0008에서 흡수).

## 7. 후속 작업

- [x] spartan 초기화: `ng g @spartan-ng/cli:init --theme=slate` (components.json, Tailwind 프리셋 배선)
- [x] 기본 컴포넌트 add: button, dialog, sheet, card, input, label, badge, avatar, skeleton, spinner, sonner, separator, tabs (`src/shared/ui/helm`)
- [x] 테마 일원화: Discord `@theme` 폐기 → spartan slate 테마(`:root`/`:root.dark`). `DESIGN.md` 삭제
- [x] 공용 `AdaptiveSheet` 구현([ADR-0002](./ADR-0002-적응형-표현-전략.md)). `AdaptiveDialog` 별도 래퍼 대신 영화 상세는 `HlmDialogService`(route-based)
- [ ] 제스처: 끌어서 닫기는 현재 직접 touch 핸들러로 구현. 복잡해지면 GSAP 유틸로 이관(미정)
