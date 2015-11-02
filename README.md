# promise-retryable [![npm version](http://img.shields.io/npm/v/promise-retryable.svg?style=flat-square)](https://www.npmjs.org/package/promise-retryable)

> Retryable promises.

Description
-----------

This library allows to retry a promise upon error, with support for
retry limit and backoff.

A bit like [promise-retry](https://github.com/IndigoUnited/node-promise-retry)
but without any dependency, using the same promise constructor as the
promise your function return, and with easier error handling.

Main differences for error handling are:

* if your function doesn't take a `retry` parameter, all errors will
  trigger a retry;
* you can use multiple rejection handlers in your function without
  having to care about the library's internal `EPROMISERETRY` errors
  (if you happen to wrap the `EPROMISERETRY` error, the retry
  handler will be bypassed).

Usage
-----

```js
import retryable from 'promise-retryable'

// Conditional retry
retryable(opts, retry => stuff()
  .catch(err => {
    if (err instanceof SomeError) {
      return retry(err)
    }

    throw err
  }))
  .then(resolved, rejected)

// Retry on any error
retryable(opts, stuff)
  .then(resolved, rejected)
```

The `opts` object is optional and can contain:

| Name      | Description                                                                             | Default |
|-----------|-----------------------------------------------------------------------------------------|---------|
| `max`     | Maximum number of retries, after what the promise will be rejected with the last error. | 10      |
| `backoff` | Time in millisecods to wait between retries (multiplicated by retry number).            | 1000    |
