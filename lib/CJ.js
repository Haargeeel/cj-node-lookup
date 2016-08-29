'use strict'
const request = require('superagent');
const xml2jsParser = require('superagent-xml2jsparser');
const Promise = require('bluebird');

const URL = 'https://product-search.api.cj.com/v2/product-search';

const CJ = function(opts) {
  if (!(this instanceof CJ)) return new CJ(opts);

  this.opts = opts || {};
};

let getQuery = function(opts) {
  let query = {};
  if (opts.keywords) {
    // if we ask with multiple keywords we want to match them all
    // query looks like this: '+Samsung +Galaxy'
    let keywords;
    if (opts.keywords.indexOf(' ') > -1)
      keywords = '+' + opts.keywords.replace(/ /g, ' +');
    else
      keywords = opts.keywords;
    if (opts.filter) {
      let filter = '-' + opts.filter.replace(/ /g, ' -');
      keywords += ' ' + filter;
    }
    query.keywords = keywords;
  }
  if (opts.websiteId) {
    query['website-id'] = opts.websiteId;
  }
  if (opts.area) {
    query['serviceable-area'] = opts.area;
  }
  if (opts.advertiserId) {
    query['advertiser-ids'] = opts.advertiserId;
  }
  if (opts.sortOrder) {
    query['sort-order'] = opts.sortOrder;
  }
  if (opts.minPrice) {
    query['low-price'] = opts.minPrice;
  }
  if (opts.maxPrice) {
    query['high-price'] = opts.maxPrice;
  }
  if (opts.numResults) {
    query['records-per-page'] = opts.numResults;
  }
  return query;
};

const getProducts = function() {
  return new Promise((resolve, reject) => {
    try {
      request
        .get(URL)
        .buffer() // necessary for xml respond
        .set('authorization', this.opts.devKey)
        .set('Content-Type', 'application/xml')
        .accept('application/xml')
        .query(getQuery(this.opts))
        .parse(xml2jsParser)
        .end((err, res) => {
          if (err) reject(err);
          if (this.opts.onlyProducts) {
            if (res &&
                res.body['cj-api'] &&
                res.body['cj-api'].products &&
                res.body['cj-api'].products[0] &&
                res.body['cj-api'].products[0].product)
              resolve(res.body['cj-api'].products[0].product);
            else
              resolve([]);
          } else
            if (res)
              resolve(res.body);
            else
              resolve({});
        });
    } catch (e) {
      reject(e);
    }
  });
};

CJ.prototype.setFilter = function(filter) {
  this.opts.filter = filter;
  return this;
};

CJ.prototype.setDevKey = function(devKey) {
  this.opts.devKey = devKey;
  return this;
};

CJ.prototype.setWebsiteId = function(websiteId) {
  this.opts.websiteId = websiteId;
  return this;
};

CJ.prototype.setAdvertiserId = function(adId) {
  this.opts.advertiserId = adId;
  return this;
};

CJ.prototype.setArea = function(area) {
  this.opts.area = area;
  return this;
};

CJ.prototype.setKeywords = function(keywords) {
  this.opts.keywords = keywords;
  return this;
};

CJ.prototype.onlyProducts = function(onlyProducts) {
  this.opts.onlyProducts = onlyProducts;
  return this;
};

CJ.prototype.setSortOrder = function(sortOrder) {
  this.opts.sortOrder = sortOrder;
  return this;
};

CJ.prototype.setMinPrice = function(minPrice) {
  this.opts.minPrice = minPrice;
  return this;
};

CJ.prototype.setMaxPrice = function(maxPrice) {
  this.opts.maxPrice = maxPrice;
  return this;
};

CJ.prototype.setNumResults = function(numResults) {
  this.opts.numResults = numResults;
  return this;
};

CJ.prototype.done = function() {
  return new Promise((resolve, reject) => {
    getProducts
      .call(this)
      .then(resolve)
      .catch(reject);
  });
};

module.exports = CJ;
