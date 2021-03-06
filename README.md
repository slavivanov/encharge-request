This module implements a Zapier-inspired node-fetch modification.

Usage:

```javascript
const { request } = require("request");
// Note: Only the URL is required.
request("https://example.com", {
  method: "POST",
  // Set headers
  headers: {
    "X-Header": "Heads up"
  },
  // You can add query parameters:
  params: {
    key: "will be added as a query parameter"
  },
  // Send the body as string
  body: "Can be a string",
  // Or as JSON (sets the Content-Type header to application/json)
  json: {
    Winter: "Fell"
  },
  // Or Form encoded (sets the Content-Type header to www-x-form-urlencoded)
  form: {
    John: "Snow"
  },
  // And other options:
  follow, // max redirect count, 0 for no limit.
  compress, // set to false to disable gzip content encoding.
  timeout, // Request timeout. Set to 0 to disable. Default 0.
  size // Request size limit. Set to 0 to disable. Default 0.
});
```

Then response is a promise with the following structure:

```javascript
{
  status, // HTTP status code
    headers, // Response headers as a dict
    content, // Response as text
    json, // Response parsed as JSON, if possible.
    request, // Options object (see above that fired the request).
    getHeader, // Helper function to get header by name.
    throwForStatus; // Helper function that throws if the status > 300.
}
```
