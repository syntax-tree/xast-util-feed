import {u} from 'unist-builder'
import {x} from 'xastscript'
import bcp47 from 'bcp-47-normalize'
import {toAuthor} from './util.js'

export function atom(channel, data) {
  var now = new Date()
  var meta = channel || {}
  var items = []
  var index = -1
  var offset
  var children
  var datum
  var value

  if (meta.title == null) throw new Error('Expected `channel.title` to be set')
  if (meta.url == null) throw new Error('Expected `channel.url` to be set')

  value = new URL(meta.url).href

  items.push(
    x('title', String(meta.title)),
    x('subtitle', String(meta.description || '') || null),
    // `rel: 'alternate'` is the default.
    x('link', value),
    x('id', value),
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
    value = toAuthor(meta.author)
    items.push(
      x('rights', '© ' + now.getUTCFullYear() + ' ' + value.name),
      createAuthor(value)
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
        value = new URL(datum.url).href
        children.push(x('link', {href: value}), x('id', value))
      }

      value = datum.published

      if (value != null) {
        if (typeof value !== 'object') value = new Date(value)
        children.push(x('published', value.toISOString()))
      }

      value = datum.modified

      if (value != null) {
        if (typeof value !== 'object') value = new Date(value)
        children.push(x('updated', value.toISOString()))
      }

      if (datum.tags) {
        offset = -1
        while (++offset < datum.tags.length) {
          items.push(x('category', {term: String(datum.tags[offset])}))
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

        // Can’t use `xastscript` because of `length`
        children.push({
          type: 'element',
          name: 'link',
          attributes: {
            rel: 'enclosure',
            href: new URL(value.url).href,
            length: String(value.size),
            type: value.type
          },
          children: []
        })
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
        'xml:lang': meta.lang ? bcp47(meta.lang) : undefined
      },
      items
    )
  ])
}

function createAuthor(value) {
  return x('author', [
    x('name', String(value.name)),
    value.email ? x('email', String(value.email)) : undefined,
    value.url ? x('uri', new URL(value.url).href) : undefined
  ])
}
