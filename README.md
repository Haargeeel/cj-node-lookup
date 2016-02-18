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
  websiteId: 7654321,
  keywords: 'Teddy Bear',
  advertiserId: 1234567,
  area: 'US',
  devKey: 'abc123'
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
  .setWebsiteId(7654321)
  .setKeywords('Toilet Paper')
  .setAdvertiserId(1234567)
  .setArea('US')
  .setDevKey('abc123')
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
