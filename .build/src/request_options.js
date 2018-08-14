"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var idx_1 = require("idx");
exports.handleURLAndOptions = function (_url, _options) {
    var url = _url;
    var options = _options;
    if (typeof url !== "string") {
        // url is actually options
        options = url;
        if (!options.url) {
            throw new Error("Missing URL");
        }
        url = options.url;
        delete options.url;
    }
    return { url: url, options: options };
};
exports.filterRequestOptions = function (options) {
    return _.pick(options, [
        "method",
        "headers",
        "body",
        "follow",
        "compress",
        "timeout",
        "size"
    ]);
};
exports.setDefaultOptions = function (options) {
    var defaults = {
        method: "GET",
        body: {},
        headers: {},
        params: {},
        follow: 0,
        compress: true,
        timeout: 0,
        size: 0 // Request size limit. Set to 0 to disable. Default 0.
    };
    return _.assign({}, defaults, options);
};
exports.parseHeaders = function (_headers) {
    var headers = _headers;
    if (!headers) {
        headers = {};
    }
    return _.reduce(headers, function (acc, value, name) {
        acc[name.toLowerCase()] = value;
        return acc;
    }, {});
};
exports.setRequestBody = function (options) {
    // const json = _.cloneDeep(options.json);
    // const form = _.cloneDeep(options.form);
    var body = _.cloneDeep(options.form);
    delete options.body;
    delete options.json;
    delete options.form;
    if (options.headers === undefined) {
        options.headers = {};
    }
    var contentType = idx_1.idx(options, function (_) { return _.headers["content-type"]; });
    // use body if available
    if (body) {
        if (typeof body === "string") {
            // String body, return as is
            options.body = body;
            return options;
        }
        // Parse body as json and set JSON content
        options.body = JSON.stringify(body);
        if (!contentType) {
            options.headers["content-type"] = "application/json";
        }
    }
    return options;
};
//# sourceMappingURL=request_options.js.map