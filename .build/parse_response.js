"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeaders = function (_headers) {
    var headers = {};
    _headers.forEach(function (value, name) {
        headers[name] = value;
    });
    return headers;
};
exports.parseResponse = function (res, options) {
    return res.text().then(function (content) {
        var headers = exports.parseHeaders(res.headers);
        var customResponse = {
            status: res.status,
            headers: headers,
            content: content,
            request: options || {},
            getHeader: function (key) {
                return res.headers.get(key);
            },
            throwForStatus: function () { }
        };
        // Enable throwing for non-success status
        customResponse.throwForStatus = function () {
            if (customResponse.status > 300) {
                var message = "Got " + customResponse.status + " calling " + customResponse.request.method + " " + customResponse.request.url + ", expected 2xx.";
                throw new Error(message);
            }
            return res;
        };
        // Parse response as JSON if possible
        try {
            customResponse.json = JSON.parse(content);
        }
        catch (err) { }
        return customResponse;
    });
};
//# sourceMappingURL=parse_response.js.map