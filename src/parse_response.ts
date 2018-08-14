import { Response, Headers } from "node-fetch";
import { RequestOptions, HttpResponse } from "./our";

export const parseHeaders = (_headers: Headers) => {
  const headers: HttpResponse["headers"] = {};
  _headers.forEach((value, name) => {
    headers[name] = value;
  });
  return headers;
};

export const parseResponse = (res: Response, options?: RequestOptions) => {
  return res.text().then(content => {
    const headers = parseHeaders(res.headers);

    const customResponse: HttpResponse = {
      status: res.status,
      headers,
      content,
      request: options || {},
      getHeader: (key: string): string | null => {
        return res.headers.get(key);
      },
      throwForStatus: () => {}
    };

    // Enable throwing for non-success status
    customResponse.throwForStatus = () => {
      if (customResponse.status > 300) {
        const message = `Got ${customResponse.status} calling ${
          customResponse.request.method
        } ${customResponse.request.url}, expected 2xx.`;
        throw new Error(message);
      }
      return res;
    };

    // Parse response as JSON if possible
    try {
      customResponse.json = JSON.parse(content);
    } catch (err) {}

    return customResponse;
  });
};
