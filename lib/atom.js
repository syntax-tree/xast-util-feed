/**
 * @typedef {import('xast').Element} Element
 * @typedef {import('xast').Root} Root
 * @typedef {import('./types.js').Author} Author
 * @typedef {import('./types.js').Enclosure} Enclosure
 * @typedef {import('./types.js').Channel} Channel
 * @typedef {import('./types.js').Entry} Entry
 */

import {URL} from 'url'
import {u} from 'unist-builder'
import {x} from 'xastscript'
import {bcp47Normalize as normalize} from 'bcp-47-normalize'
import {toAuthor, toDate} from './util.js'

/**
 * Build an Atom feed.
 * Same API as `rss` otherwise.
 *
 * @param {Channel} channel
 * @param {Array.<Entry>} [data]
 * @returns {Root}
 */
export function atom(channel, data) {
  var now = new Date()
  /** @type {Channel} */
  var meta = channel || {title: null, url: null}
  /** @type {Array.<Element>} */
  var items = []
  var index = -1
  /** @type {number} */
  var offset
  /** @type {Array.<Element>} */
  var children
  /** @type {Entry} */
  var datum
  /** @type {string} */
  var url
  /** @type {Author} */
  var author
  /** @type {Enclosure} */
  var enclosure

  if (meta.title == null) throw new Error('Expected `channel.title` to be set')
  if (meta.url == null) throw new Error('Expected `channel.url` to be set')

  url = new URL(meta.url).href

  items.push(
    x('title', String(meta.title)),
    x('subtitle', String(meta.description || '') || null),
    // `rel: 'alternate'` is the default.
    x('link', url),
    x('id', url),
    // @ts-ignore `toGTMString` is exactly what we need.
    x('updated', now.toGMTString())
  )

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
    author = toAuthor(meta.author)
    items.push(
      x('rights', '© ' + now.getUTCFullYear() + ' ' + author.name),
      createAuthor(author)
    )
  }

  if (meta.tags) {
    offset = -1
    while (++offset < meta.tags.length) {
      items.push(x('category', {term: String(meta.tags[offset])}))
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
        children.push(createAuthor(toAuthor(datum.author)))
      } else if (!meta.author) {
        throw new Error(
          'Expected `author` to be set in entry `' +
            index +
            '` or in the channel'
        )
      }

      if (datum.url) {
        url = new URL(datum.url).href
        children.push(x('link', {href: url}), x('id', url))
      }

      if (datum.published != null) {
        children.push(x('published', toDate(datum.published).toISOString()))
      }

      if (datum.modified != null) {
        children.push(x('updated', toDate(datum.modified).toISOString()))
      }

      if (datum.tags) {
        offset = -1
        while (++offset < datum.tags.length) {
          items.push(x('category', {term: String(datum.tags[offset])}))
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
