/**
 * @typedef {import('xast').Element} Element
 * @typedef {import('xast').Root} Root
 * @typedef {import('./types.js').Author} Author
 * @typedef {import('./types.js').Channel} Channel
 * @typedef {import('./types.js').Entry} Entry
 */

import {URL} from 'node:url'
import {u} from 'unist-builder'
import {x} from 'xastscript'
import {bcp47Normalize as normalize} from 'bcp-47-normalize'
import {toAuthor, toDate} from './util.js'

/**
 * Build an Atom feed.
 *
 * Same API as `rss` otherwise.
 *
 * @param {Channel} channel
 *   Data on the feed (the group of items).
 * @param {Array<Entry> | null | undefined} [data]
 *   List of entries (optional).
 * @returns {Root}
 *   Atom feed.
 */
export function atom(channel, data) {
  const now = new Date()
  /** @type {Channel} */
  const meta = channel || {title: undefined, url: undefined}

  if (meta.title === null || meta.title === undefined) {
    throw new Error('Expected `channel.title` to be set')
  }

  if (meta.url === null || meta.url === undefined) {
    throw new Error('Expected `channel.url` to be set')
  }

  const url = new URL(meta.url).href
  const items = [
    x('title', String(meta.title)),
    x('subtitle', String(meta.description || '') || undefined),
    // `rel: 'alternate'` is the default.
    x('link', url),
    x('id', url),
    // @ts-expect-error `toGTMString` is exactly what we need.
    x('updated', now.toGMTString())
  ]

  if (meta.feedUrl) {
    items.push(
      x('link', {
        href: new URL(meta.feedUrl).href,
        rel: 'self',
        type: 'application/atom+xml'
      })
    )
  }

  if (meta.author) {
    const author = toAuthor(meta.author)
    items.push(
      x('rights', '© ' + now.getUTCFullYear() + ' ' + author.name),
      createAuthor(author)
    )
  }

  if (meta.tags) {
    let index = -1
    while (++index < meta.tags.length) {
      items.push(x('category', {term: String(meta.tags[index])}))
    }
  }

  if (data) {
    let index = -1

    while (++index < data.length) {
      const datum = data[index]
      /** @type {Array<Element>} */
      const children = []

      if (!datum.title && !datum.description && !datum.descriptionHtml) {
        throw new Error(
          'Expected either `title` or `description` to be set in entry `' +
            index +
            '`'
        )
      }

      if (datum.title) children.push(x('title', String(datum.title)))

      if (datum.author) {
        children.push(createAuthor(toAuthor(datum.author)))
      } else if (!meta.author) {
        throw new Error(
          'Expected `author` to be set in entry `' +
            index +
            '` or in the channel'
        )
      }

      if (datum.url) {
        const url = new URL(datum.url).href
        children.push(x('link', {href: url}), x('id', url))
      }

      if (datum.published !== null && datum.published !== undefined) {
        children.push(x('published', toDate(datum.published).toISOString()))
      }

      if (datum.modified !== null && datum.modified !== undefined) {
        children.push(x('updated', toDate(datum.modified).toISOString()))
      }

      if (datum.tags) {
        let offset = -1
        while (++offset < datum.tags.length) {
          children.push(x('category', {term: String(datum.tags[offset])}))
        }
      }

      const enclosure = datum.enclosure

      if (enclosure) {
        if (!enclosure.url) {
          throw new Error(
            'Expected either `enclosure.url` to be set in entry `' + index + '`'
          )
        }

        if (!enclosure.size) {
          throw new Error(
            'Expected either `enclosure.size` to be set in entry `' +
              index +
              '`'
          )
        }

        if (!enclosure.type) {
          throw new Error(
            'Expected either `enclosure.type` to be set in entry `' +
              index +
              '`'
          )
        }

        // Can’t use `xastscript` because of `length`
        children.push(
          x('link', {
            rel: 'enclosure',
            href: new URL(enclosure.url).href,
            length: String(enclosure.size),
            type: enclosure.type
          })
        )
      }

      if (datum.descriptionHtml || datum.description) {
        children.push(
          x(
            'content',
            // `type: "text"` is the default.
            {type: datum.descriptionHtml ? 'html' : undefined},
            String(datum.descriptionHtml || datum.description)
          )
        )
      }

      items.push(x('entry', children))
    }
  }

  return u('root', [
    u('instruction', {name: 'xml'}, 'version="1.0" encoding="utf-8"'),
    x(
      'feed',
      {
        xmlns: 'http://www.w3.org/2005/Atom',
        'xml:lang': meta.lang ? normalize(meta.lang) : undefined
      },
      items
    )
  ])
}

/**
 * @param {Author} value
 * @returns {Element}
 */
function createAuthor(value) {
  return x('author', [
    x('name', String(value.name)),
    value.email ? x('email', String(value.email)) : undefined,
    value.url ? x('uri', new URL(value.url).href) : undefined
  ])
}
