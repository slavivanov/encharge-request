type Dictionary<T> = { [_: string]: T };
type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
// @ts-ignore -> this compiles fine in tsc, so it's an VScode error only.
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;
