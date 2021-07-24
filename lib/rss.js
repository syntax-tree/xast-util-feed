/**
 * @typedef {import('xast').Element} Element
 * @typedef {import('xast').Root} Root
 * @typedef {import('./types.js').Author} Author
 * @typedef {import('./types.js').Enclosure} Enclosure
 * @typedef {import('./types.js').Channel} Channel
 * @typedef {import('./types.js').Entry} Entry
 */

import {URL} from 'node:url'
import {u} from 'unist-builder'
import {x} from 'xastscript'
import {bcp47Normalize as normalize} from 'bcp-47-normalize'
import {toAuthor, toDate} from './util.js'

/**
 * Build an RSS feed.
 * Same API as `atom` otherwise.
 *
 * @param {Channel} channel
 * @param {Array.<Entry>} [data]
 * @returns {Root}
 */
export function rss(channel, data) {
  const now = new Date()
  /** @type {Channel} */
  const meta = channel || {title: null, url: null}
  /** @type {Array.<Element>} */
  const items = []
  let index = -1
  /** @type {boolean} */
  let atom
  /** @type {number} */
  let offset
  /** @type {Array.<Element>} */
  let children
  /** @type {Entry} */
  let datum
  /** @type {string} */
  let lang
  /** @type {string} */
  let copy
  /** @type {string} */
  let url
  /** @type {Author} */
  let author
  /** @type {Enclosure} */
  let enclosure

  if (meta.title === undefined || meta.title === null) {
    throw new Error('Expected `channel.title` to be set')
  }

  if (meta.url === undefined || meta.url === null) {
    throw new Error('Expected `channel.url` to be set')
  }

  items.push(
    x('title', String(meta.title)),
    x('description', String(meta.description || '') || null),
    x('link', new URL(meta.url).href),
    // @ts-ignore `toGTMString` is exactly what we need.
    x('lastBuildDate', now.toGMTString()),
    x('dc:date', now.toISOString())
  )

  if (meta.feedUrl) {
    atom = true
    items.push(
      x('atom:link', {
        href: new URL(meta.feedUrl).href,
        rel: 'self',
        type: 'application/rss+xml'
      })
    )
  }

  if (meta.lang) {
    lang = normalize(meta.lang)
    items.push(x('language', lang), x('dc:language', lang))
  }

  if (meta.author) {
    copy = '© ' + now.getUTCFullYear() + ' ' + meta.author
    items.push(x('copyright', copy), x('dc:rights', copy))
  }

  if (meta.tags) {
    offset = -1
    while (++offset < meta.tags.length) {
      items.push(x('category', String(meta.tags[offset])))
    }
  }

  if (data) {
    while (++index < data.length) {
      datum = data[index]
      children = []

      if (!datum.title && !datum.description && !datum.descriptionHtml) {
        throw new Error(
          'Expected either `title` or `description` to be set in entry `' +
            index +
            '`'
        )
      }

      if (datum.title) children.push(x('title', String(datum.title)))

      if (datum.author) {
        author = toAuthor(datum.author)
        children.push(x('dc:creator', author.name))

        if (author.email) {
          children.push(x('author', author.email + ' (' + author.name + ')'))
        }
      }

      if (datum.url) {
        url = new URL(datum.url).href
        children.push(
          x('link', url),
          // Do not treat it as a URL, just an opaque identifier.
          // `<link>` is already used by readers for the URL.
          // Now, the value we have here is a URL, but we can’t know if it’s
          // “permanent”, so, set `false`.
          x('guid', {isPermaLink: 'false'}, url)
        )
      }

      if (datum.published !== undefined && datum.published !== null) {
        children.push(
          // @ts-ignore `toGTMString` is exactly what we need.
          x('pubDate', toDate(datum.published).toGMTString()),
          x('dc:date', toDate(datum.published).toISOString())
        )
      }

      if (datum.modified !== undefined && datum.modified !== null) {
        children.push(x('dc:modified', toDate(datum.modified).toISOString()))
      }

      if (datum.tags) {
        offset = -1
        while (++offset < datum.tags.length) {
          children.push(x('category', String(datum.tags[offset])))
        }
      }

      enclosure = datum.enclosure
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

        // Can’t use `xastscript` because of `length`.
        children.push(
          x('enclosure', {
            url: new URL(enclosure.url).href,
            length: String(enclosure.size),
            type: enclosure.type
          })
        )
      }

      if (datum.descriptionHtml || datum.description) {
        children.push(
          x('description', String(datum.descriptionHtml || datum.description))
        )
      }

      items.push(x('item', children))
    }
  }

  return u('root', [
    u('instruction', {name: 'xml'}, 'version="1.0" encoding="utf-8"'),
    x(
      'rss',
      {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:atom': atom ? 'http://www.w3.org/2005/Atom' : undefined
      },
      x('channel', items)
    )
  ])
}
