import {
  handleURLAndOptions,
  filterRequestOptions,
  setDefaultOptions,
  parseHeaders,
  setRequestBody,
  parseQueryParams
} from "../src/request_options";

import * as chai from "chai";
// const nock = require("nock");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
const { expect } = chai;

describe("handleURLAndOptions", () => {
  it("shoud handle separate url and options", () => {
    const { url, options } = handleURLAndOptions("http://example.com", {
      method: "POST"
    });
    expect(url).to.equal("http://example.com");
    expect(options).to.deep.equal({ method: "POST" });
  });

  it("shoud handle combined url and options", () => {
    const { url, options } = handleURLAndOptions({
      url: "http://example.com",
      method: "POST"
    });
    expect(url).to.equal("http://example.com");
    expect(options).to.deep.equal({ method: "POST" });
  });
});

describe("filterRequestOptions", () => {
  it("should filter options", () => {
    const options = filterRequestOptions({
      url: "http://example.com",
      method: "POST",
      json: {}
    });
    expect(options).to.deep.equal({ method: "POST" });
  });
});

describe("setDefaultOptions", () => {
  it("should set Default options", () => {
    const options = setDefaultOptions({});
    expect(options).to.deep.equal({
      method: "GET",
      body: {},
      headers: {},
      params: {},
      follow: 0,
      compress: true,
      timeout: 0,
      size: 0
    });
  });
});

describe("parseHeaders", () => {
  it("should parse headers", () => {
    expect(
      parseHeaders({
        lowercase: "value",
        UPPer_case_headeR: "yes"
      })
    ).to.deep.equal({
      lowercase: "value",
      upper_case_header: "yes"
    });
  });
});

describe("Set request body", () => {
  it("should respect string body", () => {
    const options = setRequestBody({
      body: `{"json": "inline"}`
    });
    expect(options).to.deep.equal({
      headers: {},
      body: `{"json": "inline"}`
    });
  });

  it("should parse object body as json", () => {
    const options = setRequestBody({
      body: {
        key: "value"
      }
    });
    expect(options).to.deep.equal({
      body: `{"key":"value"}`,
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    });
  });

  it("should parse json", () => {
    const options = setRequestBody({
      json: {
        key: "value"
      }
    });
    expect(options).to.deep.equal({
      body: `{"key":"value"}`,
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    });
  });

  it("should parse form", () => {
    const options = setRequestBody({
      form: {
        test: "123",
        data: ["hm hm", "yes"]
      }
    });
    expect(options).to.deep.equal({
      body: `test=123&data%5B%5D=hm%20hm&data%5B%5D=yes`,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });
  });

  it("shouldn't set body on GET", () => {
    const options = setRequestBody({
      method: "GET",
      body: {
        key: "value"
      }
    });
    expect(options).to.deep.equal({
      headers: {},
      method: "GET"
    });
  });
});

describe("Parse query parameters", () => {
  it("should add params", () => {
    const { url } = parseQueryParams("http://example.com/", {
      params: {
        key: "value"
      }
    });
    expect(url).to.equal("http://example.com/?key=value");
  });
  it("should add to existing params", () => {
    const { url } = parseQueryParams("http://example.com/?data=1", {
      params: {
        key: "value"
      }
    });
    expect(url).to.equal("http://example.com/?data=1&key=value");
  });
  it("should not add empty params", () => {
    const { url } = parseQueryParams("http://example.com/", {});
    expect(url).to.equal("http://example.com/");
  });
});
