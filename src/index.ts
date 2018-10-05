// This module implements a zapier-inspired fetch modification.

import fetchGlobal from "cross-fetch";
// As per Zapier - hacky "clone" for fetch so we don't pollute the global library
const fetch = fetchGlobal.bind({});
import Promise = require("bluebird");
import { RequestOptions } from "./our";
import {
  handleURLAndOptions,
  setDefaultOptions,
  parseHeaders,
  filterRequestOptions,
  setRequestBody
} from "./request_options";
import { parseResponse } from "./parse_response";
fetch.Promise = Promise;

// A stripped down version of fetch.
export const request = (
  _url: string | RequestOptions,
  _options?: RequestOptions
): Promise<Response & { options: RequestOptions }> => {
  // tslint:disable-next-line:prefer-const
  let { url, options } = handleURLAndOptions(_url, _options);

  options = setDefaultOptions(options);
  options.headers = parseHeaders(options.headers);
  options = setRequestBody(options);
  options = filterRequestOptions(options);

  return fetch(url, options).then((res: Response) => {
    options!.url = url;
    return parseResponse(res, options);
  });
};
