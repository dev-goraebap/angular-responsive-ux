# 모바일 UI/UX 가이드라인 (Apple HIG · Material Design 발췌)

이 문서는 **Apple Human Interface Guidelines(HIG)** 와 **Google Material Design** 공식 가이드라인에서
모바일·반응형 설계에 자주 쓰이는 원칙만 추려 정리한 참조입니다. 각 항목의 근거 링크는 하단 출처를 참고하세요.

---

## 1. 레이아웃과 터치 타깃

- **터치 타깃 최소 크기**: Apple은 최소 **44×44 pt**, Material은 최소 **48×48 dp**를 권장합니다. 타깃끼리는 충분한 간격을 둡니다.
- **Safe area 존중**: 콘텐츠를 safe area 안에 배치해 노치·상태바·홈 인디케이터·둥근 모서리에 가리지 않게 합니다.
- **적응형 레이아웃**: 다양한 화면 크기·방향에 맞춰 반응형으로 구성합니다. Material은 창 크기를 **window size class**(compact / medium / expanded)로 나눠 분기 기준을 제시합니다.

## 2. 모달리티 — 시트·다이얼로그

- **모달은 최소화한다(Minimize modality)**: 사람의 작업을 막고 명시적 dismiss를 요구하므로, 주의를 끌어야 하거나·작업을 완료/포기해야 진행되거나·중요한 데이터를 저장할 때처럼 **꼭 필요할 때만** 씁니다. (HIG)
- **Sheet**: 현재 맥락과 밀접한 **범위가 좁은 하위 작업**에 적합합니다. 뒤 콘텐츠가 보여 맥락이 유지됩니다. (HIG)
- **Full-screen**: 모달 안에서 완결되는 **복잡하거나 몰입형 작업**에 신중히 사용합니다. (HIG)
- **Material Dialogs**: 중앙에 뜨는 **basic dialog**와 **full-screen dialog**가 있습니다. **좁은 폭(compact)** 에서는 키보드 입력이 필요하거나·변경이 즉시 저장되지 않거나·다이얼로그 위에 다이얼로그를 띄워야 할 때 **full-screen dialog**를 권장합니다.
- **Material Bottom sheets**: 보조 콘텐츠·액션을 화면 하단에서 보여 줍니다. 배경과 동시에 쓸 수 있는 **standard**와 배경을 막는 **modal**이 있으며, 큰 화면에서는 바텀시트 대신 메뉴/다이얼로그가 더 적합합니다.

## 3. 내비게이션

- **탭바 / Navigation bar**: 앱의 **최상위 목적지**를 오가는 통로입니다. Material은 하단 navigation bar에 **3~5개** 목적지를 권장하고, 폭이 넓어지면 **navigation rail / drawer**로 전환합니다.
- **목적지로 직접 이동**: 주 내비게이션 항목은 메뉴/팝업을 여는 대신 목적지로 바로 이동하게 합니다.
- **선택 상태는 색만으로 구분하지 않기**: 아이콘 채움(outline ↔ filled)·라벨·형태 변화를 함께 써 색각 이상 사용자도 구분하게 합니다. (접근성)

## 4. 버튼과 액션

- **강조 계층(Material Buttons)**: 강조가 높은 순서로 **Filled → Filled tonal / Elevated → Outlined → Text**. 화면에서 가장 중요한 단일 액션에만 가장 높은 강조를 씁니다.
- **명확한 레이블(HIG)**: 버튼이 무엇을 하는지 분명히 드러내는 동사형 레이블을 씁니다.
- **다이얼로그 액션 배치**: Material 다이얼로그의 액션 버튼은 우측 정렬하며 **확정(confirming) 액션을 가장 오른쪽**에 둡니다. iOS Alert는 선호(기본) 액션을 강조해 사용자가 누르길 바라는 선택을 분명히 합니다.
- **진행 불가 상태**: 필수 입력이 채워지지 않았다면 완료/제출 버튼을 비활성(disabled)으로 두어 오류를 사전에 막습니다.

## 5. 입력 — 텍스트 필드·키보드

- **맥락에 맞는 키보드**: 입력 내용에 맞는 키보드 타입(이메일·숫자·URL·검색 등)을 표시해 전환 피로를 줄입니다.
- **명확한 텍스트 필드**: 레이블·도움말·에러 상태를 구분해 보여 줍니다. 플레이스홀더만으로 레이블을 대신하지 않습니다.
- **입력 보조**: 자동완성·자동 대문자·자동수정 같은 보조를 맥락에 맞게 켜고 끕니다(예: 이메일·검색에서는 자동 대문자 해제).

## 6. 색·접근성·타이포그래피

- **충분한 색 대비**: 텍스트와 배경의 대비를 확보합니다(WCAG AA: 본문 4.5:1, 큰 글씨 3:1).
- **색에만 의존하지 않기**: 정보·상태를 색 외에 아이콘·텍스트·형태로도 전달합니다.
- **가변 글자 크기 존중**: Dynamic Type 등 사용자가 키운 글자 크기에 레이아웃이 깨지지 않게 합니다.

## 7. 피드백과 모션

- **햅틱(HIG)**: 적절한 시스템 햅틱으로 동작을 확인시키되 과용하지 않습니다.
- **의미 있는 모션**: 화면 전환으로 공간·위계를 전달하되 과하지 않게 합니다. 접근성(움직임 줄이기) 설정을 존중합니다.

---

## 출처 (1차 공식 가이드라인)

### Apple Human Interface Guidelines
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — 터치 타깃(44pt), safe area, 적응형 레이아웃
- [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) — 모달리티 최소화, 시트/풀스크린
- [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) — 최상위 내비게이션
- [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) · [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) — 버튼·경고창 액션
- [Color](https://developer.apple.com/design/human-interface-guidelines/color) · [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics) · [Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

### Google Material Design (M3)
- [Layout & window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
- [Dialogs](https://m3.material.io/components/dialogs/guidelines) · [Bottom sheets](https://m3.material.io/components/bottom-sheets/guidelines)
- [Navigation bar](https://m3.material.io/components/navigation-bar/guidelines) · [Navigation rail](https://m3.material.io/components/navigation-rail/guidelines)
- [Buttons](https://m3.material.io/components/buttons/guidelines) · [Text fields](https://m3.material.io/components/text-fields/guidelines)
- [Accessibility](https://m3.material.io/foundations/accessible-design/overview)
