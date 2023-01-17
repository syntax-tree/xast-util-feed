/**
 * @typedef {import('./types.js').Author} Author
 */

/**
 * Create an author object.
 *
 * @param {Author | string} value
 *   Author or string.
 * @returns {Author}
 *   Valid author.
 */
export function toAuthor(value) {
  if (typeof value === 'string') {
    return {name: value}
  }

  if (!value.name) {
    throw new Error('Expected `author.name` to be set')
  }

  return value
}

/**
 * Create a date object.
 *
 * @param {Date | string | number} value
 *   Serialized date, numeric date, actual date.
 * @returns {Date}
 *   Valid date.
 */
export function toDate(value) {
  /* c8 ignore next */
  return typeof value === 'object' ? value : new Date(value)
}
