# xast-util-feed

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[xast][]** utility to build (web) feeds ([RSS][], [Atom][]).

This package focusses on a small set of widely used and supported parts of
feeds.
It has a few good options instead of overwhelming with hundreds of things to
configure.
If you do need more things, well: this utility gives you a syntax tree, which
you can change.

It’s good to use this package to build several feeds and to only include recent
posts (often 15-20 items are included in a channel).
You should make a channel for all your posts; when relevant, separate channels
per language; and potentially, channels per post type (e.g., separate ones for
blog posts, notes, and images).

Just using either RSS or Atom is probably fine: no need to do both.

Note that this package is ESM only: Node 12+ is required to use it and it must
be imported instead of required.

## Install

[npm][]:

```sh
npm install xast-util-feed
```

## Use

Say we have the following module, `example.mjs`

```js
import {rss} from 'xast-util-feed'
import toXml from 'xast-util-to-xml'

var tree = rss(
  {
    title: 'NYT > Top Stories',
    url: 'https://www.nytimes.com',
    feedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    lang: 'en',
    author: 'The New York Times Company'
  },
  [
    {
      title: 'Senate Balances Impeachment Trial With an Incoming President',
      url:
        'https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html',
      description: 'Senate leaders etc etc etc.',
      author: 'Nicholas Fandos and Catie Edmondson',
      published: 'Fri, 15 Jan 2021 01:18:49 +0000',
      tags: ['Senate', 'Murkowski, Lisa', 'Trump, Donald J']
    }
  ]
)

console.log(toXml(tree))
```

Now, running `node example.mjs` yields (pretty printed):

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NYT > Top Stories</title>
    <description></description>
    <link>https://www.nytimes.com/</link>
    <lastBuildDate>Fri, 15 Jan 2021 11:38:12 GMT</lastBuildDate>
    <dc:date>2021-01-15T11:38:12.052Z</dc:date>
    <atom:link href="https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <dc:language>en</dc:language>
    <copyright>© 2021 The New York Times Company</copyright>
    <dc:rights>© 2021 The New York Times Company</dc:rights>
    <item>
      <title>Senate Balances Impeachment Trial With an Incoming President</title>
      <dc:creator>Nicholas Fandos and Catie Edmondson</dc:creator>
      <link>https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html</link>
      <guid isPermaLink="false">https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html</guid>
      <pubDate>Fri, 15 Jan 2021 01:18:49 GMT</pubDate>
      <dc:date>2021-01-15T01:18:49.000Z</dc:date>
      <category>Senate</category>
      <category>Murkowski, Lisa</category>
      <category>Trump, Donald J</category>
      <description>Senate leaders etc etc etc.</description>
    </item>
  </channel>
</rss>
```

## API

### `rss(channel, data)`

Build an RSS feed.

###### `channel`

See [`Channel`][channel].

###### `data`

List of [`Entry`][entry] objects.

###### Returns

[`Root`][root] — [xast][] root.

### `atom(channel, data)`

Build an Atom feed.
Same API as `rss` otherwise.

### `Channel`

Data on the feed (the group of items).

###### `channel.title`

Title of the channel (`string`, **required**, example: `Zimbabwe | The
Guardian`).

###### `channel.url`

Full URL to the *site* (`string`, **required**, example:
`'https://www.theguardian.com/world/zimbabwe'`).

###### `channel.feedUrl`

Full URL to this channel (`string?`, example: `'https://www.adweek.com/feed/'`).
Make sure to pass different ones to `rss` and `atom`!
You *should* define this.

###### `channel.description`

Short description of the channel (`string?`, example: `Album Reviews`).
You *should* define this.

###### `channel.lang`

[BCP 47][bcp47] language tag representing the language of the whole channel
(`string?`, example: `'fr-BE'`).
You *should* define this.

###### `channel.author`

Optional author of the whole channel.
Either `string`, in which case it’s as passing `{name: string}`.
Or an object with the following fields:

*   `name` (`string`, example: `'Acme, Inc.'` or `'Jane Doe'`)
*   `email` (`string?`, example: `john@example.org`)
*   `url` (`string?`, example: `'https://example.org/john'`)

`url` is used in `atom`, not in `rss`.

###### `channel.tags`

Categories of the channel (`Array.<string>?`, example: `['JavaScript',
'React']`).

### `Entry`

Data on a single item.

###### `entry.title`

Title of the item (`string?`, example: `'Playboi Carti: Whole Lotta Red'`).
Either `title`, `description`, or `descriptionHtml` must be set.

###### `entry.description`

Either the whole post or an excerpt of it (`string?`, example: `'Lorem'`).
Should be plain text.
`descriptionHtml` is preferred over plain text `description`.
Either `title`, `description`, or `descriptionHtml` must be set.

###### `entry.descriptionHtml`

Either the whole post or an excerpt of it (`string?`, example: `'<p>Lorem</p>'`).
Should be serialized HTML.
`descriptionHtml` is preferred over plain text `description`.
Either `title`, `description`, or `descriptionHtml` must be set.

###### `entry.author`

Entry version of [`channel.author`][channel-author].
You *should* define this.
For `atom`, it is required to either set `channel.author` or set `author` on all
entries.

###### `entry.url`

Full URL of this entry on the *site* (`string?`, example:
`'https://pitchfork.com/reviews/albums/roberta-flack-first-take'`).

###### `entry.published`

When the entry was first published (`Date` or value for `new Date(x)`,
optional).

###### `entry.modified`

When the entry was last modified (`Date` or value for `new Date(x)`, optional).

###### `entry.tags`

Categories of the entry (`Array.<string>?`, example: `['laravel',
'debugging']`).

###### `entry.enclosure`

An enclosure, such as an image or audio, is an object with the following fields:

*   `url` (`string`, example: `'http://dallas.example.com/joebob_050689.mp3'`)
    — Full URL to the resource
*   `length` (`number`, example: `24986239`)
    — Resource size in bytes
*   `type` (`string`, example: `'audio/mpeg'`)
    — Mime type of the resource

## Security

XML can be a dangerous language: don’t trust user-provided data.

## Related

*   [`xast-util-to-xml`](https://github.com/syntax-tree/xast-util-to-xml)
    — serialize xast to XML
*   [`xast-util-sitemap`](https://github.com/syntax-tree/xast-util-sitemap)
    — build a sitemap
*   [`xastscript`](https://github.com/syntax-tree/xastscript)
    — create xast trees

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/xast-util-feed/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/xast-util-feed/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/xast-util-feed.svg

[coverage]: https://codecov.io/github/syntax-tree/xast-util-feed

[downloads-badge]: https://img.shields.io/npm/dm/xast-util-feed.svg

[downloads]: https://www.npmjs.com/package/xast-util-feed

[size-badge]: https://img.shields.io/bundlephobia/minzip/xast-util-feed.svg

[size]: https://bundlephobia.com/result?p=xast-util-feed

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[xast]: https://github.com/syntax-tree/xast

[root]: https://github.com/syntax-tree/xast#root

[rss]: https://www.rssboard.org/rss-specification

[atom]: https://tools.ietf.org/html/rfc4287

[bcp47]: https://github.com/wooorm/bcp-47

[channel]: #channel

[entry]: #entry

[channel-author]: #channelauthor
