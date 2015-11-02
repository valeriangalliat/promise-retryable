/*
 * Main retry function.
 *
 * Calls the `getPromise` function with a `next` handler, that,
 * when called, will return a promise retrying the process,
 * or rejecting with the given error if the retry limit is reached.
 *
 *     getPromise = retry => Promise
 *     retry = err => Promise
 */
const retryable = ({max = 10, backoff = 1000}, getPromise) => {
  const attempt = (i, promise) =>
    promise = getPromise(
      err => new promise.constructor((resolve, reject) =>
        i >= max ? reject(err) : setTimeout(resolve, i * backoff))
          .then(() => attempt(i + 1)))

  return attempt(0)
}

/*
 * If given `getPromise` function doesn't take any argument, wrap it to call
 * the given `next` handler on every error.
 *
 * Otherwise the `getPromise` function is expected to call the `next` handler
 * when a retry is needed.
 */
const wrapGetPromise = getPromise =>
  getPromise.length > 0
    ? getPromise
    : retry => getPromise().then(null, retry)

// Wrap the `getPromise` argument
const polymorphicGetPromise = retryable => (opts, getPromise) =>
  retryable(opts, wrapGetPromise(getPromise))

// Make the `opts` argument optional
const optionalOpts = retryable => (opts, getPromise) =>
  typeof opts === 'function'
    ? retryable({}, opts)
    : retryable(opts, getPromise)

// Decorate the main function for public API
export default optionalOpts(polymorphicGetPromise(retryable))
