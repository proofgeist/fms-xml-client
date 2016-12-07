'use strict';
/**
 * Created by toddgeist on 12/6/16.
 */

const assert = require('assert')

const fmresultset = require('../src/fmresultset');
const fs = require('fs');


describe('fmresultset converter', function(){
  describe( 'when given the dbnames query result' , function() {
    const xml = fs.readFileSync(__dirname + '/fixtures/dbnames-fmpresultset.xml')

    const convertToJSON = fmresultset(xml)

    it('should get errorCode === 0', function(){
      return convertToJSON
        .then((json)=>{
          return assert(json.errorCode === 0, 'errorcode is 0')
        })
    })

    it('should get a record array with a length greater than 0', function(){
      return convertToJSON
        .then((json)=>{
          return assert(json.records.length > 0, 'records is array')
        })
    })
  })

  describe( 'when given a findall xml' , function() {
    const xml = fs.readFileSync(__dirname + '/fixtures/findall-fmresultset.xml')
    const convertToJSON = fmresultset(xml)
    it('should get records' , function( ) {
      return convertToJSON
        .then(json=>{
          return assert(json.records.length > 0, 'records is array')
        })
    })


  })


});