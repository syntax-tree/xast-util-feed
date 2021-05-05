/**
 * @typedef {import('./types.js').Author} Author
 */

/**
 * @param {Author|string} value
 * @returns {Author}
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
 * @param {Date|string|number} value
 * @returns {Date}
 */
export function toDate(value) {
  /* c8 ignore next */
  return typeof value === 'object' ? value : new Date(value)
}
