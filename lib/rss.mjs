import u from 'unist-builder'
import x from 'xastscript'
import bcp47 from 'bcp-47-normalize'
import {toAuthor} from './util.mjs'

export function rss(channel, data) {
  var now = new Date()
  var meta = channel || {}
  var items = []
  var index = -1
  var atom
  var offset
  var children
  var datum
  var value

  if (meta.title == null) throw new Error('Expected `channel.title` to be set')
  if (meta.url == null) throw new Error('Expected `channel.url` to be set')

  items.push(x('title', String(meta.title)))
  items.push(x('description', String(meta.description || '')))
  items.push(x('link', new URL(meta.url).href))
  items.push(x('lastBuildDate', now.toGMTString()))
  items.push(x('dc:date', now.toISOString()))

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
    value = bcp47(meta.lang)
    items.push(x('language', value))
    items.push(x('dc:language', value))
  }

  if (meta.author) {
    value = '© ' + now.getUTCFullYear() + ' ' + meta.author
    items.push(x('copyright', value))
    items.push(x('dc:rights', value))
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
        value = toAuthor(datum.author)
        children.push(x('dc:creator', value.name))

        if (value.email) {
          children.push(x('author', value.email + ' (' + value.name + ')'))
        }
      }

      if (datum.url) {
        value = new URL(datum.url).href
        children.push(x('link', value))

        // Do not treat it as a URL, just an opaque identifier.
        // `<link>` is already used by readers for the URL.
        // Now, the value we have here is a URL, but we can’t know if it’s
        // “permanent”, so, set `false`.
        children.push(x('guid', {isPermaLink: 'false'}, value))
      }

      value = datum.published

      if (value != null) {
        if (typeof value !== 'object') value = new Date(value)
        children.push(x('pubDate', value.toGMTString()))
        children.push(x('dc:date', value.toISOString()))
      }

      value = datum.modified

      if (value != null) {
        if (typeof value !== 'object') value = new Date(value)
        children.push(x('dc:modified', value.toISOString()))
      }

      if (datum.tags) {
        offset = -1
        while (++offset < datum.tags.length) {
          children.push(x('category', String(datum.tags[offset])))
        }
      }

      value = datum.enclosure
      if (value) {
        if (!value.url) {
          throw new Error(
            'Expected either `enclosure.url` to be set in entry `' + index + '`'
          )
        }

        if (!value.size) {
          throw new Error(
            'Expected either `enclosure.size` to be set in entry `' +
              index +
              '`'
          )
        }

        if (!value.type) {
          throw new Error(
            'Expected either `enclosure.type` to be set in entry `' +
              index +
              '`'
          )
        }

        // Can’t use `xastscript` because of `length`.
        children.push({
          type: 'element',
          name: 'enclosure',
          attributes: {
            url: new URL(value.url).href,
            length: String(value.size),
            type: value.type
          },
          children: []
        })
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
