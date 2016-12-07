'use strict';
/**
 * Created by toddgeist on 12/6/16.
 */

const xml2js = require('xml2js');
const FileMakerServerError = require('./FileMakerServerError');

module.exports = (xml)=>{
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, function (err, json) {
      if (err)
        reject(err);
      else
        resolve(json);
    });

  })
};