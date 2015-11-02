import assert from 'assert'
import done from 'promise-done'
import retryable from '../src'

const err = new Error()

retryable({ backoff: 10 }, () => Promise.reject(err))
  .then(
    () => assert(false, 'Should not resolve'),
    e => assert(e === err, 'Should propagate the error')
  )
  .then(null, done)

let i = 0

retryable({ backoff: 10 }, () => {
  i++

  if (i === 3) {
    return Promise.resolve(42)
  }

  return Promise.reject(err)
})
  .then(
    v => assert(v === 42, 'Should get the value after 3 tries'),
    () => assert(false, 'Should not error')
  )
  .then(null, done)
