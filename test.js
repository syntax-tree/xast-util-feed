import assert from 'node:assert/strict'
import test from 'node:test'
import {atom, rss} from './index.js'

// Hack so the tests don’t need updating everytime…
const ODate = global.Date

// Note: this isn’t reset.
// @ts-expect-error
global.Date = function (/** @type {string | number} */ value) {
  return new ODate(value || 1_234_567_890_123)
}

test('rss', () => {
  assert.throws(
    () => {
      // @ts-expect-error runtime
      rss()
    },
    /Expected `channel.title` to be set/,
    'should throw when w/o `title`'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime
      rss({title: 'a'})
    },
    /Expected `channel.url` to be set/,
    'should throw when w/o `url`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'b'})
    },
    /Invalid URL/,
    'should throw on incorrect `url`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}),
    {
      type: 'root',
      children: [
        {
          type: 'instruction',
          name: 'xml',
          value: 'version="1.0" encoding="utf-8"'
        },
        {
          type: 'element',
          name: 'rss',
          attributes: {
            version: '2.0',
            'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
          },
          children: [
            {
              type: 'element',
              name: 'channel',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'a'}]
                },
                {
                  type: 'element',
                  name: 'description',
                  attributes: {},
                  children: []
                },
                {
                  type: 'element',
                  name: 'link',
                  attributes: {},
                  children: [{type: 'text', value: 'https://example.com/'}]
                },
                {
                  type: 'element',
                  name: 'lastBuildDate',
                  attributes: {},
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
                },
                {
                  type: 'element',
                  name: 'dc:date',
                  attributes: {},
                  children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support `title` and `url`'
  )

  assert.deepEqual(
    rss({
      title: 'a',
      url: 'https://example.com',
      feedUrl: 'https://example.com/rss'
    }).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:atom': 'http://www.w3.org/2005/Atom'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'atom:link',
              attributes: {
                href: 'https://example.com/rss',
                rel: 'self',
                type: 'application/rss+xml'
              },
              children: []
            }
          ]
        }
      ]
    },
    'should support `feedUrl` (for `atom:link`)'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com', description: 'b'}).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: [{type: 'text', value: 'b'}]
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            }
          ]
        }
      ]
    },
    'should support `description`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com', lang: 'nl-NL'}).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'language',
              attributes: {},
              children: [{type: 'text', value: 'nl'}]
            },
            {
              type: 'element',
              name: 'dc:language',
              attributes: {},
              children: [{type: 'text', value: 'nl'}]
            }
          ]
        }
      ]
    },
    'should support `lang`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com', author: 'b'}).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'copyright',
              attributes: {},
              children: [{type: 'text', value: '© 2009 b'}]
            },
            {
              type: 'element',
              name: 'dc:rights',
              attributes: {},
              children: [{type: 'text', value: '© 2009 b'}]
            }
          ]
        }
      ]
    },
    'should support `author` (for copyright)'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com', tags: ['b', 'c']}).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'category',
              attributes: {},
              children: [{type: 'text', value: 'b'}]
            },
            {
              type: 'element',
              name: 'category',
              attributes: {},
              children: [{type: 'text', value: 'c'}]
            }
          ]
        }
      ]
    },
    'should support `tags`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'https://example.com'}, [{}])
    },
    /Expected either `title` or `description` to be set in entry `0`/,
    'should throw when entry w/o `title` or `description`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [{title: 'b'}]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `title`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [{description: 'b'}])
      .children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'description',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `description`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {descriptionHtml: '<p>b</p>'}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'description',
                  attributes: {},
                  children: [{type: 'text', value: '<p>b</p>'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `descriptionHtml`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {description: 'b', descriptionHtml: '<p>b</p>'}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'description',
                  attributes: {},
                  children: [{type: 'text', value: '<p>b</p>'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should prefer `descriptionHtml` over `description`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [{title: 'b', author: 'c'}])
      .children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'dc:creator',
                  attributes: {},
                  children: [{type: 'text', value: 'c'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` (`dc:creator`)'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      rss({title: 'a', url: 'https://example.com'}, [{title: 'b', author: {}}])
    },
    /Expected `author.name` to be set/,
    'should throw on author w/o `name`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', author: {name: 'c'}}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'dc:creator',
                  attributes: {},
                  children: [{type: 'text', value: 'c'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` as object (`author`)'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', author: {name: 'c', email: 'd'}}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'dc:creator',
                  attributes: {},
                  children: [{type: 'text', value: 'c'}]
                },
                {
                  type: 'element',
                  name: 'author',
                  attributes: {},
                  children: [{type: 'text', value: 'd (c)'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` as object w/ `email` (`author`)'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', url: 'https://example.com/b.html'}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'link',
                  attributes: {},
                  children: [
                    {type: 'text', value: 'https://example.com/b.html'}
                  ]
                },
                {
                  type: 'element',
                  name: 'guid',
                  attributes: {isPermaLink: 'false'},
                  children: [
                    {type: 'text', value: 'https://example.com/b.html'}
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `link` (`link` and `guid`)'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', tags: ['a', 'b']}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'category',
                  attributes: {},
                  children: [{type: 'text', value: 'a'}]
                },
                {
                  type: 'element',
                  name: 'category',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `tags`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', published: 1_231_111_111_111}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'pubDate',
                  attributes: {},
                  children: [
                    {type: 'text', value: 'Sun, 04 Jan 2009 23:18:31 GMT'}
                  ]
                },
                {
                  type: 'element',
                  name: 'dc:date',
                  attributes: {},
                  children: [{type: 'text', value: '2009-01-04T23:18:31.111Z'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `published`'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {title: 'b', modified: 1_231_111_111_111}
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'dc:modified',
                  attributes: {},
                  children: [{type: 'text', value: '2009-01-04T23:18:31.111Z'}]
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `modified`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'b', enclosure: {}}
      ])
    },
    /Expected either `enclosure.url` to be set in entry `0`/,
    'should throw on enclosure w/o `url`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'b', enclosure: {url: 'c'}}
      ])
    },
    /Expected either `enclosure.size` to be set in entry `0`/,
    'should throw on enclosure w/o `size`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'b', enclosure: {url: 'c', size: 1}}
      ])
    },
    /Expected either `enclosure.type` to be set in entry `0`/,
    'should throw on enclosure w/o `type`'
  )

  assert.throws(
    () => {
      rss({title: 'a', url: 'https://example.com'}, [
        {title: 'b', enclosure: {url: 'c', size: 1, type: 'd'}}
      ])
    },
    /Invalid URL/,
    'should throw on incorrect `url` in enclosure'
  )

  assert.deepEqual(
    rss({title: 'a', url: 'https://example.com'}, [
      {
        title: 'b',
        enclosure: {
          url: 'https://example.com/123.png',
          size: 1,
          type: 'image/png'
        }
      }
    ]).children[1],
    {
      type: 'element',
      name: 'rss',
      attributes: {
        version: '2.0',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
      },
      children: [
        {
          type: 'element',
          name: 'channel',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {
              type: 'element',
              name: 'description',
              attributes: {},
              children: []
            },
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'lastBuildDate',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            },
            {
              type: 'element',
              name: 'dc:date',
              attributes: {},
              children: [{type: 'text', value: '2009-02-13T23:31:30.123Z'}]
            },
            {
              type: 'element',
              name: 'item',
              attributes: {},
              children: [
                {
                  type: 'element',
                  name: 'title',
                  attributes: {},
                  children: [{type: 'text', value: 'b'}]
                },
                {
                  type: 'element',
                  name: 'enclosure',
                  attributes: {
                    url: 'https://example.com/123.png',
                    length: '1',
                    type: 'image/png'
                  },
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    'should support an item w/ `enclosure`'
  )
})

test('atom', () => {
  assert.throws(
    () => {
      // @ts-expect-error runtime.
      atom()
    },
    /Expected `channel.title` to be set/,
    'should throw when w/o `title`'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      atom({title: 'a'})
    },
    /Expected `channel.url` to be set/,
    'should throw when w/o `url`'
  )

  assert.throws(
    () => {
      atom({title: 'a', url: 'b'})
    },
    /Invalid URL/,
    'should throw on incorrect `url`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com'}),
    {
      type: 'root',
      children: [
        {
          type: 'instruction',
          name: 'xml',
          value: 'version="1.0" encoding="utf-8"'
        },
        {
          type: 'element',
          name: 'feed',
          attributes: {xmlns: 'http://www.w3.org/2005/Atom'},
          children: [
            {
              type: 'element',
              name: 'title',
              attributes: {},
              children: [{type: 'text', value: 'a'}]
            },
            {type: 'element', name: 'subtitle', attributes: {}, children: []},
            {
              type: 'element',
              name: 'link',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'id',
              attributes: {},
              children: [{type: 'text', value: 'https://example.com/'}]
            },
            {
              type: 'element',
              name: 'updated',
              attributes: {},
              children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
            }
          ]
        }
      ]
    },
    'should support `title` and `url`'
  )

  assert.deepEqual(
    atom({
      title: 'a',
      url: 'https://example.com',
      feedUrl: 'https://example.com/atom'
    }).children[1],
    {
      type: 'element',
      name: 'feed',
      attributes: {xmlns: 'http://www.w3.org/2005/Atom'},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'a'}]
        },
        {type: 'element', name: 'subtitle', attributes: {}, children: []},
        {
          type: 'element',
          name: 'link',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
        },
        {
          type: 'element',
          name: 'link',
          attributes: {
            href: 'https://example.com/atom',
            rel: 'self',
            type: 'application/atom+xml'
          },
          children: []
        }
      ]
    },
    'should support `feedUrl` (for `link[rel=self]`)'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com', description: 'b'})
      .children[1],
    {
      type: 'element',
      name: 'feed',
      attributes: {xmlns: 'http://www.w3.org/2005/Atom'},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'a'}]
        },
        {
          type: 'element',
          name: 'subtitle',
          attributes: {},
          children: [{type: 'text', value: 'b'}]
        },
        {
          type: 'element',
          name: 'link',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
        }
      ]
    },
    'should support `description`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com', lang: 'nl-NL'}).children[1],
    {
      type: 'element',
      name: 'feed',
      attributes: {xmlns: 'http://www.w3.org/2005/Atom', 'xml:lang': 'nl'},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'a'}]
        },
        {type: 'element', name: 'subtitle', attributes: {}, children: []},
        {
          type: 'element',
          name: 'link',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
        }
      ]
    },
    'should support `lang`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com', author: 'b'}).children[1],
    {
      type: 'element',
      name: 'feed',
      attributes: {xmlns: 'http://www.w3.org/2005/Atom'},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'a'}]
        },
        {type: 'element', name: 'subtitle', attributes: {}, children: []},
        {
          type: 'element',
          name: 'link',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
        },
        {
          type: 'element',
          name: 'rights',
          attributes: {},
          children: [{type: 'text', value: '© 2009 b'}]
        },
        {
          type: 'element',
          name: 'author',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'name',
              attributes: {},
              children: [{type: 'text', value: 'b'}]
            }
          ]
        }
      ]
    },
    'should support `author`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com', tags: ['b', 'c']})
      .children[1],
    {
      type: 'element',
      name: 'feed',
      attributes: {xmlns: 'http://www.w3.org/2005/Atom'},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'a'}]
        },
        {type: 'element', name: 'subtitle', attributes: {}, children: []},
        {
          type: 'element',
          name: 'link',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}]
        },
        {
          type: 'element',
          name: 'category',
          attributes: {term: 'b'},
          children: []
        },
        {
          type: 'element',
          name: 'category',
          attributes: {term: 'c'},
          children: []
        }
      ]
    },
    'should support `tags`'
  )

  assert.throws(
    () => {
      atom({title: 'a', url: 'https://example.com'}, [{}])
    },
    /Expected either `title` or `description` to be set in entry `0`/,
    'should throw when entry w/o `title` or `description`'
  )

  assert.throws(
    () => {
      atom({title: 'a', url: 'https://example.com'}, [{title: 'b'}])
    },
    /Expected `author` to be set in entry `0` or in the channel/,
    'should throw w/ entry (and channel) w/o `author`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        }
      ]
    },
    'should support an item w/ `title`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {description: 'c'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'content',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        }
      ]
    },
    'should support an item w/ `description`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {descriptionHtml: '<p>c</p>'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'content',
          attributes: {type: 'html'},
          children: [{type: 'text', value: '<p>c</p>'}]
        }
      ]
    },
    'should support an item w/ `descriptionHtml`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {description: 'c', descriptionHtml: '<p>c</p>'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'content',
          attributes: {type: 'html'},
          children: [{type: 'text', value: '<p>c</p>'}]
        }
      ]
    },
    'should prefer `descriptionHtml` over `description`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', author: 'd'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        },
        {
          type: 'element',
          name: 'author',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'name',
              attributes: {},
              children: [{type: 'text', value: 'd'}]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author`'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      atom({title: 'a', url: 'https://example.com'}, [{title: 'b', author: {}}])
    },
    /Expected `author.name` to be set/,
    'should throw on author w/o `name`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com'}, [
      {title: 'b', author: {name: 'c'}}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'b'}]
        },
        {
          type: 'element',
          name: 'author',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'name',
              attributes: {},
              children: [{type: 'text', value: 'c'}]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` as object'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com'}, [
      {title: 'b', author: {name: 'c', email: 'd'}}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'b'}]
        },
        {
          type: 'element',
          name: 'author',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'name',
              attributes: {},
              children: [{type: 'text', value: 'c'}]
            },
            {
              type: 'element',
              name: 'email',
              attributes: {},
              children: [{type: 'text', value: 'd'}]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` as object w/ `email`'
  )

  assert.throws(
    () => {
      atom({title: 'a', url: 'https://example.com'}, [
        {title: 'b', author: {name: 'c', url: 'd'}}
      ])
    },
    /Invalid URL/,
    'should throw on author w/ incorrect `url`'
  )

  assert.deepEqual(
    atom({title: 'a', url: 'https://example.com'}, [
      {title: 'b', author: {name: 'c', url: 'https://example.org'}}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'b'}]
        },
        {
          type: 'element',
          name: 'author',
          attributes: {},
          children: [
            {
              type: 'element',
              name: 'name',
              attributes: {},
              children: [{type: 'text', value: 'c'}]
            },
            {
              type: 'element',
              name: 'uri',
              attributes: {},
              children: [{type: 'text', value: 'https://example.org/'}]
            }
          ]
        }
      ]
    },
    'should support an item w/ `author` as object w/ `url`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', url: 'https://example.com/b.html'}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        },
        {
          type: 'element',
          name: 'link',
          attributes: {href: 'https://example.com/b.html'},
          children: []
        },
        {
          type: 'element',
          name: 'id',
          attributes: {},
          children: [{type: 'text', value: 'https://example.com/b.html'}]
        }
      ]
    },
    'should support an item w/ `link`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', tags: ['x', 'y']}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        }
      ]
    },
    'should support an item w/ `tags`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', published: 1_231_111_111_111}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        },
        {
          type: 'element',
          name: 'published',
          attributes: {},
          children: [{type: 'text', value: '2009-01-04T23:18:31.111Z'}]
        }
      ]
    },
    'should support an item w/ `published`'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', modified: 1_231_111_111_111}
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        },
        {
          type: 'element',
          name: 'updated',
          attributes: {},
          children: [{type: 'text', value: '2009-01-04T23:18:31.111Z'}]
        }
      ]
    },
    'should support an item w/ `modified`'
  )

  assert.throws(
    () => {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'c', enclosure: {}}
      ])
    },
    /Expected either `enclosure.url` to be set in entry `0`/,
    'should throw on enclosure w/o `url`'
  )

  assert.throws(
    () => {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'c', enclosure: {url: 'd'}}
      ])
    },
    /Expected either `enclosure.size` to be set in entry `0`/,
    'should throw on enclosure w/o `size`'
  )

  assert.throws(
    () => {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        // @ts-expect-error runtime.
        {title: 'c', enclosure: {url: 'd', size: 1}}
      ])
    },
    /Expected either `enclosure.type` to be set in entry `0`/,
    'should throw on enclosure w/o `type`'
  )

  assert.throws(
    () => {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {title: 'c', enclosure: {url: 'd', size: 1, type: 'e'}}
      ])
    },
    /Invalid URL/,
    'should throw on incorrect `url` in enclosure'
  )

  assert.deepEqual(
    atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {
        title: 'c',
        enclosure: {
          url: 'https://example.com/123.png',
          size: 1,
          type: 'image/png'
        }
      }
      // @ts-expect-error hush.
    ]).children[1].children.pop(),
    {
      type: 'element',
      name: 'entry',
      attributes: {},
      children: [
        {
          type: 'element',
          name: 'title',
          attributes: {},
          children: [{type: 'text', value: 'c'}]
        },
        {
          type: 'element',
          name: 'link',
          attributes: {
            rel: 'enclosure',
            href: 'https://example.com/123.png',
            length: '1',
            type: 'image/png'
          },
          children: []
        }
      ]
    },
    'should support an item w/ `enclosure`'
  )
})
