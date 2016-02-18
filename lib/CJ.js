'use strict'
const request = require('superagent');
const xml2jsParser = require('superagent-xml2jsparser');
const Promise = require('bluebird');

const URL = 'https://product-search.api.cj.com/v2/product-search';

const CJ = function(opts) {
  if (!(this instanceof CJ)) return new CJ(opts);

  this.opts = opts || {};
};

const getProducts = function() {
  return new Promise((resolve, reject) => {
    // if we ask with multiple keywords we want to match them all
    // query looks like this: '+Samsung +Galaxy'
    let keywords;
    if (this.opts.keywords.indexOf(' ') > -1)
      keywords = '+' + this.opts.keywords.replace(/ /g, ' +');
    else
      keywords = this.opts.keywords;

    if (this.opts.filter) {
      let filter = '-' + this.opts.filter.replace(/ /g, ' -');
      keywords += ' ' + filter;
    }

    request
      .get(URL)
      .buffer() // necessary for xml respond
      .set('authorization', this.opts.devKey)
      .set('Content-Type', 'application/xml')
      .accept('application/xml')
      .query({
        'website-id': this.opts.websiteId,
        'keywords': keywords,
        'serviceable-area': this.opts.area,
        'advertiser-ids': this.opts.advertiserId
      })
      .parse(xml2jsParser)
      .end((err, res) => {
        if (err) reject(err);
        //console.log(res.body['cj-api'].products[0].product);
        if (this.opts.onlyProducts) {
          if (res.body['cj-api'] &&
              res.body['cj-api'].products &&
              res.body['cj-api'].products[0] &&
              res.body['cj-api'].products[0].product)
            resolve(res.body['cj-api'].products[0].product);
          else
            resolve([]);
        } else
          resolve(res.body);
      });

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

CJ.prototype.done = function() {
  return new Promise((resolve, reject) => {
    getProducts
      .call(this)
      .then(resolve)
      .catch(reject);
  });
};

module.exports = CJ;
