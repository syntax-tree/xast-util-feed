/**
 * @typedef Author
 *   Author object
 * @property {string} name
 *   Name (example: `'Acme, Inc.'` or `'Jane Doe'`).
 * @property {string | null | undefined} [email]
 *   Email address (example: `john@example.org`, optional).
 * @property {string | null | undefined} [url]
 *   URL to author (example: `'https://example.org/john'`, optional).
 *
 *   `url` is used in `atom`, not in `rss`.
 *
 * @typedef Enclosure
 *   Media.
 * @property {string} url
 *   Full URL to the resource (example:
 *   `'http://dallas.example.com/joebob_050689.mp3'`).
 * @property {number} size
 *   Resource size in bytes (example: `24986239`).
 * @property {string} type
 *   Mime type of the resource (example: `'audio/mpeg'`).
 *
 * @typedef Channel
 *   Data on the feed (the group of items).
 * @property {string} title
 *   Title of the channel (required, example: `Zimbabwe | The Guardian`).
 * @property {string} url
 *   Full URL to the site (required, example:
 *   `'https://www.theguardian.com/world/zimbabwe'`).
 * @property {string | null | undefined} [feedUrl]
 *   Full URL to this channel (example:
 *   `'https://www.adweek.com/feed/'`, optional).
 *
 *   Make sure to pass different ones to `rss` and `atom`!
 *
 *   You *should* define this.
 * @property {string | null | undefined} [description]
 *   Short description of the channel (example: `Album Reviews`, optional).
 *
 *   You *should* define this.
 * @property {string | null | undefined} [lang]
 *   BCP 47 language tag representing the language of the whole channel (example:
 *   `'fr-BE'`, optional).
 *
 *   You *should* define this.
 * @property {Author | string | null | undefined} [author]
 *   Optional author of the whole channel (optional).
 *
 *   Either `string`, in which case it’s as passing `{name: string}`.
 *   Or an author object.
 * @property {Array<string> | null | undefined} [tags]
 *    Categories of the channel (example: `['JavaScript', 'React']`, optional).
 *
 * @typedef Entry
 *   Data on a single item.
 * @property {string | null | undefined} [title]
 *   Title of the item (example: `'Playboi Carti: Whole Lotta Red'`, optional).
 *
 *   Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {string | null | undefined} [description]
 *   Either the whole post or an excerpt of it (example: `'Lorem'`, optional).
 *
 *   Should be plain text.
 *   `descriptionHtml` is preferred over plain text `description`.
 *
 *   Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {string | null | undefined} [descriptionHtml]
 *   Either the whole post or an excerpt of it (example: `'<p>Lorem</p>'`,
 *   optional).
 *
 *   Should be serialized HTML.
 *   `descriptionHtml` is preferred over plain text `description`.
 *
 *   Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {Author | string | null | undefined} [author]
 *   Entry version of `channel.author` (optional).
 *
 *   You *should* define this.
 *
 *   For `atom`, it is required to either set `channel.author` or set `author`
 *   on all entries.
 * @property {string | null | undefined} [url]
 *   Full URL of this entry on the *site* (example:
 *   `'https://pitchfork.com/reviews/albums/roberta-flack-first-take'`,
 *   optional).
 * @property {Date | number | string | null | undefined} [published]
 *   When the entry was first published (optional).
 * @property {Date | number | string | null | undefined} [modified]
 *   When the entry was last modified (optional).
 * @property {Array<string> | null | undefined} [tags]
 *   Categories of the entry (example: `['laravel', 'debugging']`, optional).
 * @property {Enclosure | null | undefined} [enclosure]
 *   Attached media.
 */

export {}
