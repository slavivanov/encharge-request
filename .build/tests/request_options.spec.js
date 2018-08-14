"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_options_1 = require("../src/request_options");
var chai = require("chai");
// const nock = require("nock");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
var expect = chai.expect;
describe("handleURLAndOptions", function () {
    it("shoud handle separate url and options", function () {
        var _a = request_options_1.handleURLAndOptions("http://example.com", {
            method: "POST"
        }), url = _a.url, options = _a.options;
        expect(url).to.equal("http://example.com");
        expect(options).to.deep.equal({ method: "POST" });
    });
    it("shoud handle combined url and options", function () {
        var _a = request_options_1.handleURLAndOptions({
            url: "http://example.com",
            method: "POST"
        }), url = _a.url, options = _a.options;
        expect(url).to.equal("http://example.com");
        expect(options).to.deep.equal({ method: "POST" });
    });
});
describe("filterRequestOptions", function () {
    it("should filter options", function () {
        var options = request_options_1.filterRequestOptions({
            url: "http://example.com",
            method: "POST",
            json: {}
        });
        expect(options).to.deep.equal({ method: "POST" });
    });
});
describe("setDefaultOptions", function () {
    it("should set Default options", function () {
        var options = request_options_1.setDefaultOptions({});
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
describe("parseHeaders", function () {
    it("should parse headers", function () {
        expect(request_options_1.parseHeaders({
            lowercase: "value",
            UPPer_case_headeR: "yes"
        })).to.deep.equal({
            lowercase: "value",
            upper_case_header: "yes"
        });
    });
});
describe("Set request body", function () {
    it("should parse raw body", function () {
        // const options =
    });
    it("should parse body as object", function () { });
    it("should parse json", function () { });
    it("should parse form", function () { });
});
//# sourceMappingURL=request_options.spec.js.map