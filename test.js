import assert from 'node:assert/strict'
import test from 'node:test'
import {atom, rss} from './index.js'

// Hack so the tests don’t need updating everytime…
const ODate = global.Date

// Note: this isn’t reset.
// @ts-expect-error: the other fields on `Date` are not used here.
global.Date = wrapperDate

/**
 * @param {string | number} value
 * @returns {Date}
 */
function wrapperDate(value) {
  return new ODate(value || 1_234_567_890_123)
}

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'atom',
      'rss'
    ])
  })
})

test('rss', async function (t) {
  await t.test('should throw when w/o `channel`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles missing `channel`.
      rss()
    }, /Expected `channel.title` to be set/)
  })

  await t.test('should throw when w/o `url`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles missing `channel.url`.
      rss({title: 'a'})
    }, /Expected `channel.url` to be set/)
  })

  await t.test('should throw on incorrect `url`', async function () {
    assert.throws(function () {
      rss({title: 'a', url: 'b'})
    }, /Invalid URL/)
  })

  await t.test('should support `title` and `url`', async function () {
    assert.deepEqual(rss({title: 'a', url: 'https://example.com'}), {
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
    })
  })

  await t.test('should support `feedUrl` (for `atom:link`)', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test('should support `description`', async function () {
    assert.deepEqual(
      rss({title: 'a', url: 'https://example.com', description: 'b'})
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
    )
  })

  await t.test('should support `lang`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test('should support `author` (for copyright)', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test('should support `tags`', async function () {
    assert.deepEqual(
      rss({title: 'a', url: 'https://example.com', tags: ['b', 'c']})
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test(
    'should throw when entry w/o `title` or `description`',
    async function () {
      assert.throws(function () {
        rss({title: 'a', url: 'https://example.com'}, [{}])
      }, /Expected either `title` or `description` to be set in entry `0`/)
    }
  )

  await t.test('should support an item w/ `title`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test('should support an item w/ `description`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test(
    'should support an item w/ `descriptionHtml`',
    async function () {
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test(
    'should prefer `descriptionHtml` over `description`',
    async function () {
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test(
    'should support an item w/ `author` (`dc:creator`)',
    async function () {
      assert.deepEqual(
        rss({title: 'a', url: 'https://example.com'}, [
          {title: 'b', author: 'c'}
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test('should throw on author w/o `name`', async function () {
    assert.throws(function () {
      rss({title: 'a', url: 'https://example.com'}, [
        {
          title: 'b',
          // @ts-expect-error: check how the runtime handles missing `author.name`.
          author: {}
        }
      ])
    }, /Expected `author.name` to be set/)
  })

  await t.test(
    'should support an item w/ `author` as object (`author`)',
    async function () {
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test(
    'should support an item w/ `author` as object w/ `email` (`author`)',
    async function () {
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test(
    'should support an item w/ `link` (`link` and `guid`)',
    async function () {
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
                  children: [
                    {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                  ]
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
        }
      )
    }
  )

  await t.test('should support an item w/ `tags`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })

  await t.test('should support an item w/ `published`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
                    children: [
                      {type: 'text', value: '2009-01-04T23:18:31.111Z'}
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    )
  })

  await t.test('should support an item w/ `modified`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
                    children: [
                      {type: 'text', value: '2009-01-04T23:18:31.111Z'}
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    )
  })

  await t.test('should throw on enclosure w/o `url`', async function () {
    assert.throws(function () {
      rss({title: 'a', url: 'https://example.com'}, [
        {
          title: 'b',
          // @ts-expect-error: check how the runtime handles missing `enclosure.url`.
          enclosure: {}
        }
      ])
    }, /Expected either `enclosure.url` to be set in entry `0`/)
  })

  await t.test('should throw on enclosure w/o `size`', async function () {
    assert.throws(function () {
      rss({title: 'a', url: 'https://example.com'}, [
        {
          title: 'b',
          // @ts-expect-error: check how the runtime handles missing `enclosure.size`.
          enclosure: {url: 'c'}
        }
      ])
    }, /Expected either `enclosure.size` to be set in entry `0`/)
  })

  await t.test('should throw on enclosure w/o `type`', async function () {
    assert.throws(function () {
      rss({title: 'a', url: 'https://example.com'}, [
        {
          title: 'b',
          // @ts-expect-error: check how the runtime handles missing `enclosure.type`.
          enclosure: {url: 'c', size: 1}
        }
      ])
    }, /Expected either `enclosure.type` to be set in entry `0`/)
  })

  await t.test(
    'should throw on incorrect `url` in enclosure',
    async function () {
      assert.throws(function () {
        rss({title: 'a', url: 'https://example.com'}, [
          {title: 'b', enclosure: {url: 'c', size: 1, type: 'd'}}
        ])
      }, /Invalid URL/)
    }
  )

  await t.test('should support an item w/ `enclosure`', async function () {
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
                children: [
                  {type: 'text', value: 'Fri, 13 Feb 2009 23:31:30 GMT'}
                ]
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
      }
    )
  })
})

test('atom', async function (t) {
  await t.test('should throw when w/o `title`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles missing `channel`.
      atom()
    }, /Expected `channel.title` to be set/)
  })

  await t.test('should throw when w/o `url`', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles missing `channel.url`.
      atom({title: 'a'})
    }, /Expected `channel.url` to be set/)
  })

  await t.test('should throw on incorrect `url`', async function () {
    assert.throws(function () {
      atom({title: 'a', url: 'b'})
    }, /Invalid URL/)
  })

  await t.test('should support `title` and `url`', async function () {
    assert.deepEqual(atom({title: 'a', url: 'https://example.com'}), {
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
    })
  })

  await t.test(
    'should support `feedUrl` (for `link[rel=self]`)',
    async function () {
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
        }
      )
    }
  )

  await t.test('should support `description`', async function () {
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
      }
    )
  })

  await t.test('should support `lang`', async function () {
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
      }
    )
  })

  await t.test('should support `author`', async function () {
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
      }
    )
  })

  await t.test('should support `tags`', async function () {
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
      }
    )
  })

  await t.test(
    'should throw when entry w/o `title` or `description`',
    async function () {
      assert.throws(function () {
        atom({title: 'a', url: 'https://example.com'}, [{}])
      }, /Expected either `title` or `description` to be set in entry `0`/)
    }
  )

  await t.test(
    'should throw w/ entry (and channel) w/o `author`',
    async function () {
      assert.throws(function () {
        atom({title: 'a', url: 'https://example.com'}, [{title: 'b'}])
      }, /Expected `author` to be set in entry `0` or in the channel/)
    }
  )

  await t.test('should support an item w/ `title`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c'}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test('should support an item w/ `description`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {description: 'c'}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test(
    'should support an item w/ `descriptionHtml`',
    async function () {
      const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {descriptionHtml: '<p>c</p>'}
      ])
      const element = root.children[1]
      assert(element.type === 'element')
      const entry = element.children.pop()

      assert.deepEqual(entry, {
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
      })
    }
  )

  await t.test(
    'should prefer `descriptionHtml` over `description`',
    async function () {
      const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {description: 'c', descriptionHtml: '<p>c</p>'}
      ])
      const element = root.children[1]
      assert(element.type === 'element')
      const entry = element.children.pop()

      assert.deepEqual(entry, {
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
      })
    }
  )

  await t.test('should support an item w/ `author`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', author: 'd'}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test('should throw on author w/o `name`', async function () {
    assert.throws(function () {
      atom({title: 'a', url: 'https://example.com'}, [
        {
          title: 'b',
          // @ts-expect-error: check how the runtime handles missing `author.name`.
          author: {}
        }
      ])
    }, /Expected `author.name` to be set/)
  })

  await t.test(
    'should support an item w/ `author` as object',
    async function () {
      const root = atom({title: 'a', url: 'https://example.com'}, [
        {title: 'b', author: {name: 'c'}}
      ])
      const element = root.children[1]
      assert(element.type === 'element')
      const entry = element.children.pop()

      assert.deepEqual(entry, {
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
      })
    }
  )

  await t.test(
    'should support an item w/ `author` as object w/ `email`',
    async function () {
      const root = atom({title: 'a', url: 'https://example.com'}, [
        {title: 'b', author: {name: 'c', email: 'd'}}
      ])
      const element = root.children[1]
      assert(element.type === 'element')
      const entry = element.children.pop()

      assert.deepEqual(entry, {
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
      })
    }
  )

  await t.test('should throw on author w/ incorrect `url`', async function () {
    assert.throws(function () {
      atom({title: 'a', url: 'https://example.com'}, [
        {title: 'b', author: {name: 'c', url: 'd'}}
      ])
    }, /Invalid URL/)
  })

  await t.test(
    'should support an item w/ `author` as object w/ `url`',
    async function () {
      const root = atom({title: 'a', url: 'https://example.com'}, [
        {title: 'b', author: {name: 'c', url: 'https://example.org'}}
      ])
      const element = root.children[1]
      assert(element.type === 'element')
      const entry = element.children.pop()

      assert.deepEqual(entry, {
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
      })
    }
  )

  await t.test('should support an item w/ `link`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', url: 'https://example.com/b.html'}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test('should support an item w/ `tags`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', tags: ['x', 'y']}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
          name: 'category',
          attributes: {term: 'x'},
          children: []
        },
        {
          type: 'element',
          name: 'category',
          attributes: {term: 'y'},
          children: []
        }
      ]
    })
  })

  await t.test('should support an item w/ `published`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', published: 1_231_111_111_111}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test('should support an item w/ `modified`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {title: 'c', modified: 1_231_111_111_111}
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })

  await t.test('should throw on enclosure w/o `url`', async function () {
    assert.throws(function () {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {
          title: 'c',
          // @ts-expect-error: check how the runtime handles missing `enclosure.url`.
          enclosure: {}
        }
      ])
    }, /Expected either `enclosure.url` to be set in entry `0`/)
  })

  await t.test('should throw on enclosure w/o `size`', async function () {
    assert.throws(function () {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {
          title: 'c',
          // @ts-expect-error: check how the runtime handles missing `enclosure.size`.
          enclosure: {url: 'd'}
        }
      ])
    }, /Expected either `enclosure.size` to be set in entry `0`/)
  })

  await t.test('should throw on enclosure w/o `type`', async function () {
    assert.throws(function () {
      atom({title: 'a', author: 'b', url: 'https://example.com'}, [
        {
          title: 'c',
          // @ts-expect-error: check how the runtime handles missing `enclosure.type`.
          enclosure: {url: 'd', size: 1}
        }
      ])
    }, /Expected either `enclosure.type` to be set in entry `0`/)
  })

  await t.test(
    'should throw on incorrect `url` in enclosure',
    async function () {
      assert.throws(function () {
        atom({title: 'a', author: 'b', url: 'https://example.com'}, [
          {title: 'c', enclosure: {url: 'd', size: 1, type: 'e'}}
        ])
      }, /Invalid URL/)
    }
  )

  await t.test('should support an item w/ `enclosure`', async function () {
    const root = atom({title: 'a', author: 'b', url: 'https://example.com'}, [
      {
        title: 'c',
        enclosure: {
          url: 'https://example.com/123.png',
          size: 1,
          type: 'image/png'
        }
      }
    ])
    const element = root.children[1]
    assert(element.type === 'element')
    const entry = element.children.pop()

    assert.deepEqual(entry, {
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
    })
  })
})
