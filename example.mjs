import {rss} from './index.mjs'
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
