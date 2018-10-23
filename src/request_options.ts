import { RequestOptions } from "./our";
import _ = require("lodash");
import idx from "idx";
import qs = require("qs");

export const handleURLAndOptions = (
  _url: string | RequestOptions,
  _options?: RequestOptions
) => {
  let url = _url;
  let options = _options;
  if (typeof url !== "string") {
    // url is actually options
    options = url;
    if (!options.url) {
      throw new Error("Missing URL");
    }
    url = options.url;
    delete options.url;
  }
  return { url, options };
};

export const filterRequestOptions = (options: RequestOptions) => {
  return _.omit(options, ["url", "json", "form", "params"]) as RequestOptions;
};

export const setDefaultOptions = (
  options: RequestOptions | undefined
): RequestOptions => {
  const defaults = {
    method: "GET",
    body: {},
    headers: {}, // Request headers.
    params: {}, // Request query parameters.
    follow: 0, // max redirect count, 0 for no limit.
    compress: true, // set to false to disable gzip content encoding.
    timeout: 0, // Request timeout. Set to 0 to disable. Default 0.
    size: 0 // Request size limit. Set to 0 to disable. Default 0.
  };
  return _.assign({}, defaults, options);
};

export const parseHeaders = (
  _headers: RequestOptions["headers"]
): RequestOptions["headers"] => {
  let headers = _headers;
  if (!headers) {
    headers = {};
  }
  return _.reduce(
    headers,
    (acc, value, name) => {
      acc![name.toLowerCase()] = value;
      return acc;
    },
    {} as RequestOptions["headers"]
  );
};

export const setRequestBody = (options: RequestOptions): RequestOptions => {
  const json = _.cloneDeep(options.json);
  const form = _.cloneDeep(options.form);
  const body = _.cloneDeep(options.body) as RequestOptions["body"];

  delete options.body;
  delete options.json;
  delete options.form;
  if (!options.headers) {
    options.headers = {};
  }
  const contentType = idx(options, _ => _.headers!["content-type"]);

  // Request with GET/HEAD method cannot have body
  if (options.method === "HEAD" || options.method === "GET") {
    return options;
  }
  // use body if available
  if (body && !_.isEmpty(body)) {
    if (typeof body === "string") {
      // String body, return as is
      options.body = body;
      return options;
    }
    // Parse body as json and set JSON content
    options.body = JSON.stringify(body);
    if (!contentType) {
      options.headers["content-type"] = "application/json; charset=utf-8";
    }
    return options;
  }

  if (json) {
    options.body = JSON.stringify(json);
    if (!contentType) {
      options.headers["content-type"] = "application/json; charset=utf-8";
    }
    return options;
  }

  if (form) {
    // Prepare form
    if (typeof form === "string") {
      options.body = form;
    } else {
      options.body = qs.stringify(form, { arrayFormat: "brackets" }); // .replace(/%20/g, '+');
    }
    if (!contentType) {
      options.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    return options;
  }

  return options;
};

export const parseQueryParams = (_url: string, _options: RequestOptions) => {
  // TODO make this a middleware, to run after user specified middlewares
  let url = _url;
  const options = _options;
  // Not empty query parameters
  if (options.params && Object.keys(options.params).length > 0) {
    const splitter = url.indexOf("?") === -1 ? "?" : "&";
    url += splitter + qs.stringify(options.params, { arrayFormat: "brackets" });
  }
  delete options.params;
  return { url, options };
};
