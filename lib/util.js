export function toAuthor(value) {
  if (typeof value === 'string') {
    return {name: value}
  }

  if (!value.name) {
    throw new Error('Expected `author.name` to be set')
  }

  return value
}
