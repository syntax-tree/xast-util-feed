/**
 * @typedef Author An author object
 * @property {string} name Example: `'Acme, Inc.'` or `'Jane Doe'`
 * @property {string} [email] Example: `john@example.org`
 * @property {string} [url] Example: `'https://example.org/john'`. `url` is used in `atom`, not in `rss`.
 *
 * @typedef Enclosure Media
 * @property {string} url Full URL to the resource (example: `'http://dallas.example.com/joebob_050689.mp3'`).
 * @property {number} size Resource size in bytes (example: `24986239`).
 * @property {string} type Mime type of the resource (example: `'audio/mpeg'`).
 *
 * @typedef Channel Data on the feed (the group of items).
 * @property {string} title Title of the channel (required, example: `Zimbabwe | The Guardian`).
 * @property {string} url Full URL to the site (required, example: `'https://www.theguardian.com/world/zimbabwe'`).
 * @property {string} [feedUrl] Full URL to this channel (example: `'https://www.adweek.com/feed/'`). Make sure to pass different ones to `rss` and `atom`! You *should* define this.
 * @property {string} [description] Short description of the channel (example: `Album Reviews`). You *should* define this.
 * @property {string} [lang] BCP 47 language tag representing the language of the whole channel (example: `'fr-BE'`). You *should* define this.
 * @property {string|Author} [author] Optional author of the whole channel. Either `string`, in which case it’s as passing `{name: string}`. Or an author object.
 * @property {Array.<string>} [tags] Categories of the channel (example: `['JavaScript', 'React']`).
 *
 * @typedef Entry Data on a single item.
 * @property {string} [title] Title of the item (example: `'Playboi Carti: Whole Lotta Red'`). Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {string} [description] Either the whole post or an excerpt of it (example: `'Lorem'`). Should be plain text. `descriptionHtml` is preferred over plain text `description`. Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {string} [descriptionHtml] Either the whole post or an excerpt of it (example: `'<p>Lorem</p>'`). Should be serialized HTML. `descriptionHtml` is preferred over plain text `description`. Either `title`, `description`, or `descriptionHtml` must be set.
 * @property {string|Author} [author] Entry version of `channel.author`. You *should* define this. For `atom`, it is required to either set `channel.author` or set `author` on all entries.
 * @property {string} [url] Full URL of this entry on the *site* (example: `'https://pitchfork.com/reviews/albums/roberta-flack-first-take'`).
 * @property {Date|number|string} [published] When the entry was first published (`Date` or value for `new Date(x)`, optional).
 * @property {Date|number|string} [modified] When the entry was last modified (`Date` or value for `new Date(x)`, optional).
 * @property {Array.<string>} [tags] Categories of the entry (`Array.<string>?`, example: `['laravel', 'debugging']`).
 * @property {Enclosure} [enclosure] Attached media
 */

export {}
