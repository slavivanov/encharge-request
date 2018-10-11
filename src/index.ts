// This module implements a zapier-inspired fetch modification.

import fetch = require("cross-fetch");
// Clone fetch so we don't pollute the global library
// import * as clone from 'clone';
// const fetch = clone(fetchGlobal);
// import Promise = require("bluebird");
import { RequestOptions, HttpResponse, Overwrite } from "./our";
import {
  handleURLAndOptions,
  setDefaultOptions,
  parseHeaders,
  filterRequestOptions,
  setRequestBody
} from "./request_options";
import { parseResponse } from "./parse_response";
// fetch.Promise = Promise;

// A stripped down version of fetch.
const request = (
  _url: string | RequestOptions,
  _options?: RequestOptions
): Promise<HttpResponse> => {
  // tslint:disable-next-line:prefer-const
  let { url, options } = handleURLAndOptions(_url, _options);

  options = setDefaultOptions(options);
  options.headers = parseHeaders(options.headers);
  options = setRequestBody(options);
  options = filterRequestOptions(options);

  /// @ts-ignore
  return fetch(url, options as Overwrite<
    RequestOptions,
    { body: string | undefined }
  >).then((res: Response) => {
    options!.url = url;
    return parseResponse(res, options);
  });
};

export default request;
