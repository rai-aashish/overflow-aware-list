export type Direction = "horizontal" | "vertical";
export type SliceFrom = "start" | "end";

export interface OverflowListState<T> {
  visibleItems: T[];
  hiddenItems: T[];
  isOverflowing: boolean;
  /** Index into `items` where the visible slice begins. Always 0 when sliceFrom="start". */
  startIndex: number;
  /** False until the first measurement completes. Use to hide UI until layout is stable. */
  measured: boolean;
}

export interface OverflowListOptions<T> {
  items: T[];
  direction?: Direction;
  sliceFrom?: SliceFrom;
  /** Called synchronously whenever visible/hidden state changes. */
  onStateChange: (state: OverflowListState<T>) => void;
}
