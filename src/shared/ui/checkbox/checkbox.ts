import { Component, input, output } from '@angular/core';

/**
 * 체크박스 프리미티브.
 * 업무: 네이티브 input[checkbox]를 토큰으로 칠한다. appearance-none으로 외형만 바꾸고
 * 키보드·포커스·접근성은 네이티브에 맡긴다(헤드리스 위에 디자인만 얹는 원칙).
 */
@Component({
  selector: 'ui-checkbox',
  host: { class: 'relative inline-flex items-center justify-center' },
  template: `
    <input
      type="checkbox"
      class="peer size-6 cursor-pointer appearance-none rounded-xs border-2 border-ink/30 transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      [checked]="checked()"
      (change)="checkedChange.emit($any($event.target).checked)"
      [attr.aria-label]="ariaLabel()"
    />
    <!-- 체크 표시. 입력 위에 겹쳐 두고 checked일 때만 보인다. -->
    <svg
      class="pointer-events-none absolute size-4 text-on-primary opacity-0 transition-opacity peer-checked:opacity-100"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  `,
})
export class Checkbox {
  readonly checked = input(false);
  readonly ariaLabel = input<string>();
  readonly checkedChange = output<boolean>();
}
