## CJ Affiliate Node Lookup

### Install

```
npm i cj-node-lookup --save
```

### Usage

You can pass a opts object.
```
var CJ = require('cj-node-lookup');
var opts = {
  devKey: 'abc123' // mandatory
  websiteId: 7654321, // mandatory
  keywords: 'Teddy Bear',
  advertiserId: 1234567,
  area: 'US',
  sortOrder: 'dec', // default: asc ...seems to work flawlessly
  minPrice: 100, // inclusive only integer
  maxPrice: 500, // exclusive only integer
  numResults: 500, // max: 1000
  filter: 'red blue brown' // maybe you don't want to have these colors
}

CJ(opts)
  .done()
  .then(result => {
    // do sth with result
  })
```

Or you set it one by one.

```
var CJ = require('cj-node-lookup');

CJ()
  .setDevKey('abc123') // mandatory
  .setWebsiteId(7654321) // mandatory
  .setKeywords('Toilet Paper')
  .setAdvertiserId(1234567)
  .setArea('US')
  .setFilter('rough 1ply')
  .setMinPrice(100), // inclusive only integer
  .setMaxPrice(500), // exclusive only integer
  .setNumResults:(500), // max: 1000
  .setSortOrder('dec') // default: asc ...seems to work flawlessly
  .done()
  .then(result => {
    // do sth with result
  })
```

The responds is usually an object like:

```
{
  'cj-api': {
    products: [
      {
        $: {}, // some information from the response like number of products
        product: [] // your actually product list
      },
    ]
  }
}
```

You can add a parameter for just getting the productlist:

```
// in your opts object
{
  ...,
  onlyProducts: true
}

// or as a function
CJ()
  ...
  .onlyProducts(true)
  ...
```
