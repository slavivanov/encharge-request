"use strict";
// This module implements a zapier-inspired fetch modification.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./our.d.ts" />
var node_fetch_1 = require("node-fetch");
// As per Zapier - hacky "clone" for fetch so we don't pollute the global library
var fetch = node_fetch_1.default.bind({});
var Promise = require("bluebird");
var request_options_1 = require("./request_options");
var parse_response_1 = require("./parse_response");
fetch.Promise = Promise;
// A stripped down version of fetch.
exports.request = function (_url, _options) {
    // tslint:disable-next-line:prefer-const
    var _a = request_options_1.handleURLAndOptions(_url, _options), url = _a.url, options = _a.options;
    options = request_options_1.setDefaultOptions(options);
    options.headers = request_options_1.parseHeaders(options.headers);
    options = request_options_1.setRequestBody(options);
    options = request_options_1.filterRequestOptions(options);
    return fetch(url, options).then(function (res) {
        options.url = url;
        return parse_response_1.parseResponse(res, options);
    });
};
//# sourceMappingURL=index.js.map