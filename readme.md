# xast-util-feed

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[xast][] utility to build (web) feeds ([RSS][], [Atom][]).

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`atom(channel, data)`](#atomchannel-data)
    *   [`rss(channel, data)`](#rsschannel-data)
    *   [`Author`](#author)
    *   [`Channel`](#channel)
    *   [`Enclosure`](#enclosure)
    *   [`Entry`](#entry)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package generates RSS or Atom feeds from data.

## When should I use this?

This package helps you add feeds to your site.
It focusses on a small set of widely used and supported parts of feeds.
It has a few good options instead of overwhelming with hundreds of things to
configure.
If you do need more things, well: this utility gives you a syntax tree, which
you can change.

It’s good to use this package to build several feeds and to only include recent
posts (often 15-20 items are included in a channel).
You should make a channel for all your posts; when relevant, separate channels
per language as well; and potentially, channels per post type (such as separate
ones for blog posts, notes, and images).

Just using either RSS or Atom is probably fine: no need to do both.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install xast-util-feed
```

In Deno with [`esm.sh`][esmsh]:

```js
import {atom, rss} from 'https://esm.sh/xast-util-feed@1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {atom, rss} from 'https://esm.sh/xast-util-feed@1?bundle'
</script>
```

## Use

```js
import {atom, rss} from 'xast-util-feed'
import {toXml} from 'xast-util-to-xml'

const channel = {
  title: 'NYT > Top Stories',
  url: 'https://www.nytimes.com',
  feedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  lang: 'en',
  author: 'The New York Times Company'
}

const data = [
  {
    title: 'Senate Balances Impeachment Trial With an Incoming President',
    url:
      'https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html',
    descriptionHtml: '<p>Senate leaders etc etc etc.</p>',
    author: 'Nicholas Fandos and Catie Edmondson',
    published: 'Fri, 15 Jan 2021 01:18:49 +0000',
    tags: ['Senate', 'Murkowski, Lisa', 'Trump, Donald J']
  }
]

console.log(toXml(rss(channel, data)))
console.log(toXml(atom(channel, data)))
```

Yields (pretty printed):

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NYT > Top Stories</title>
    <description></description>
    <link>https://www.nytimes.com/</link>
    <lastBuildDate>Sun, 17 Jan 2021 09:00:54 GMT</lastBuildDate>
    <dc:date>2021-01-17T09:00:54.781Z</dc:date>
    <atom:link href="https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" rel="self" type="application/rss+xml"></atom:link>
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
      <description>&#x3C;p>Senate leaders etc etc etc.&#x3C;/p></description>
    </item>
  </channel>
</rss>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>NYT > Top Stories</title>
  <subtitle></subtitle>
  <link>https://www.nytimes.com/</link>
  <id>https://www.nytimes.com/</id>
  <updated>Sun, 17 Jan 2021 09:00:54 GMT</updated>
  <link href="https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" rel="self" type="application/atom+xml"></link>
  <rights>© 2021 The New York Times Company</rights>
  <author>
    <name>The New York Times Company</name>
  </author>
  <category term="Senate"></category>
  <category term="Murkowski, Lisa"></category>
  <category term="Trump, Donald J"></category>
  <entry>
    <title>Senate Balances Impeachment Trial With an Incoming President</title>
    <author>
      <name>Nicholas Fandos and Catie Edmondson</name>
    </author>
    <link href="https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html"></link>
    <id>https://www.nytimes.com/2021/01/14/us/politics/impeachment-senate-trial-trump.html</id>
    <published>2021-01-15T01:18:49.000Z</published>
    <content type="html">&#x3C;p>Senate leaders etc etc etc.&#x3C;/p></content>
  </entry>
</feed>
```

## API

This package exports the identifiers [`atom`][api-atom] and [`rss`][api-rss].
There is no default export.

### `atom(channel, data)`

Build an [Atom][] feed.

###### Parameters

*   `channel` ([`Channel`][api-channel])
    — data on the feed (the group of items)
*   `data` ([`Array<Entry>`][api-entry], optional)
    — list of entries

###### Returns

Atom feed ([`Root`][root]).

### `rss(channel, data)`

Build an [RSS][] feed.

###### Parameters

*   `channel` ([`Channel`][api-channel])
    — data on the feed (the group of items)
*   `data` ([`Array<Entry>`][api-entry], optional)
    — list of entries

###### Returns

RSS feed ([`Root`][root]).

### `Author`

Author object (TypeScript type).

##### Fields

###### `name`

Name (`string`, **required**, example: `'Acme, Inc.'` or `'Jane Doe'`).

###### `email`

Email address (`string`, optional, ,example: `john@example.org`)

###### `url`

URL to author (`string`, optional, example: `'https://example.org/john'`).

`url` is used in `atom`, not in `rss`.

### `Channel`

Data on the feed (the group of items) (TypeScript type).

##### Fields

###### `title`

Title of the channel (`string`, **required**, example: `Zimbabwe | The
Guardian`).

###### `url`

Full URL to the *site* (`string`, **required**, example:
`'https://www.theguardian.com/world/zimbabwe'`).

###### `feedUrl`

Full URL to this channel (`string?`, example: `'https://www.adweek.com/feed/'`).

Make sure to pass different ones to `rss` and `atom` when you build both!

You *should* define this.

###### `description`

Short description of the channel (`string?`, example: `Album Reviews`).

You *should* define this.

###### `lang`

[BCP 47][bcp47] language tag representing the language of the whole channel
(`string?`, example: `'fr-BE'`).

You *should* define this.

###### `author`

Optional author of the whole channel (`string` or [`Author`][api-author]).

Either `string`, in which case it’s as passing `{name: string}`.
Or an author object.

###### `tags`

Categories of the channel (`Array<string>?`, example: `['JavaScript',
'React']`).

### `Enclosure`

Media (TypeScript type).

##### Fields

###### `url`

Full URL to the resource (`string`, **required**, example:
`'http://dallas.example.com/joebob_050689.mp3'`).

###### `size`

Resource size in bytes (`number`, **required**, example: `24986239`).

###### `type`

Mime type of the resource (`string`, **required**, example: `'audio/mpeg'`).

### `Entry`

Data on a single item (TypeScript type).

##### Fields

###### `title`

Title of the item (`string?`, example: `'Playboi Carti: Whole Lotta Red'`).

Either `title`, `description`, or `descriptionHtml` must be set.

###### `description`

Either the whole post or an excerpt of it (`string?`, example: `'Lorem'`).

Should be plain text.
`descriptionHtml` is preferred over plain text `description`.

Either `title`, `description`, or `descriptionHtml` must be set.

###### `descriptionHtml`

Either the whole post or an excerpt of it (`string?`, example: `'<p>Lorem</p>'`).

Should be serialized HTML.
`descriptionHtml` is preferred over plain text `description`.

Either `title`, `description`, or `descriptionHtml` must be set.

###### `author`

Entry version of `channel.author`.

You *should* define this.

For `atom`, it is required to either set `channel.author` or set `author` on all
entries.

###### `url`

Full URL of this entry on the *site* (`string?`, example:
`'https://pitchfork.com/reviews/albums/roberta-flack-first-take'`).

###### `published`

When the entry was first published (`Date` or value for `new Date(x)`,
optional).

###### `modified`

When the entry was last modified (`Date` or value for `new Date(x)`, optional).

###### `tags`

Categories of the entry (`Array<string>?`, example: `['laravel',
'debugging']`).

###### `enclosure`

Attached media ([`Enclosure?`][api-enclosure]).

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Author`][api-author],
[`Channel`][api-channel],
[`Enclosure`][api-enclosure], and
[`Entry`][api-entry].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `xast-util-feed@^2`,
compatible with Node.js 16.

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

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/xast-util-feed/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/xast-util-feed/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/xast-util-feed.svg

[coverage]: https://codecov.io/github/syntax-tree/xast-util-feed

[downloads-badge]: https://img.shields.io/npm/dm/xast-util-feed.svg

[downloads]: https://www.npmjs.com/package/xast-util-feed

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=xast-util-feed

[size]: https://bundlejs.com/?q=xast-util-feed

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[wooorm]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[xast]: https://github.com/syntax-tree/xast

[root]: https://github.com/syntax-tree/xast#root

[rss]: https://www.rssboard.org/rss-specification

[atom]: https://tools.ietf.org/html/rfc4287

[bcp47]: https://github.com/wooorm/bcp-47

[api-atom]: #atomchannel-data

[api-rss]: #rsschannel-data

[api-author]: #author

[api-channel]: #channel

[api-enclosure]: #enclosure

[api-entry]: #entry
