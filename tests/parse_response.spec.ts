import { parseHeaders, parseResponse } from "../src/parse_response";

import * as chai from "chai";
import { Headers, Response } from "node-fetch";
const { expect } = chai;

describe("parseHeaders", () => {
  it("shoud handle separate url and options", () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("X-Custom-Header", "ProcessThisImmediately");
    const headers = parseHeaders(myHeaders);
    expect(headers).to.deep.equal({
      "content-type": "text/plain",
      "x-custom-header": "ProcessThisImmediately"
    });
  });
});

describe("parseResponse", () => {
  it("should handle headers", async () => {
    const myHeaders = new Headers();
    myHeaders.append("X-Custom-Header", "ProcessThisImmediately");
    const response = new Response("body text", {
      status: 200,
      headers: myHeaders
    });
    const parsed = await parseResponse(response);
    expect(parsed.headers).to.deep.equal({
      "x-custom-header": "ProcessThisImmediately"
    });
    expect(parsed.getHeader("x-custom-header")).to.equal(
      "ProcessThisImmediately"
    );
  });

  it("should handle text body", async () => {
    const response = new Response("body text", {
      status: 204
    });
    const options = {
      method: "POST" as "POST",
      url: "https://example.com"
    };
    const parsed = await parseResponse(response, options);
    expect(parsed).to.have.property("status", 204);
    expect(parsed.content).to.equal("body text");
    expect(parsed.json).to.equal(undefined);
    expect(parsed.request).to.deep.equal(options);
  });

  it("should handle json body", async () => {
    const response = new Response(`{"json":"FTW"}`);
    const parsed = await parseResponse(response);
    expect(parsed.json).to.deep.equal({ json: "FTW" });
  });

  it("should handle non-200 status code", async () => {
    const response = new Response("body text", {
      status: 400
    });
    const options = {
      method: "POST" as "POST",
      url: "https://example.com"
    };
    const parsed = await parseResponse(response, options);
    expect(parsed.status).to.equal(400);
    expect(parsed.throwForStatus).to.throw(
      "Got 400 calling POST https://example.com, expected 2xx."
    );
  });
});
