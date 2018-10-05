type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
// @ts-ignore -> this compiles fine in tsc, so it's an VScode error only.
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | string;

export interface RequestOptions {
  url?: string;
  method?: HttpMethod;
  body?: string | object; // Request raw body (as string), or object to be transcoded to x-www-form-urlencoded or json.
  json?: object | any[]; // JSON to be transcoded in the body.
  form?: object; // Content to add as x-www-form-urlencoded in body.
  headers?: { [name: string]: string }; // Request headers.
  params?: object; // Request query parameters.
  follow?: number; // max redirect count, 0 for no limit.
  compress?: boolean; // set to false to disable gzip content encoding.
  timeout?: number; // Request timeout. Set to 0 to disable. Default 0.
  size?: number; // Request size limit. Set to 0 to disable. Default 0.
}

export interface HttpResponse {
  status: number;
  headers: { [key: string]: string };
  content: string;
  json?: object;
  request: RequestOptions;
  getHeader(key: string): string | null;
  throwForStatus(): void;
}
