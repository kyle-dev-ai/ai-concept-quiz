/**
 * 홈화면에 설치된 앱 아이콘 위의 숫자 배지.
 * 밀린 복습이 몇 개인지 앱을 열지 않고도 보이게 한다.
 */
export interface AppBadge {
  /** count가 0 이하면 배지를 지운다. */
  set(count: number): void
}
