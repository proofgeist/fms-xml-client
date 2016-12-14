'use strict';
/**
 * Created by toddgeist on 12/11/16.
 */

const assert = require('assert')
const client = require('../../index');
const auth = {
    user: 'admin',
    pass : 'admin'
  };




describe( 'dbnames' , function() {

  it('should return dbnames' , function( ) {

    const options = {
      server: process.env.SERVER_URL,
      auth ,
      command :{
        '-dbnames' : true
      }
    };
    return client(options)
      .then(json=>{
        assert(json.error.code === 0, 'error.code = 0')
        return json
      })
  })

});

describe( 'findall' , function() {


  it('should return some records' , function( ) {
    const options = {
      server: process.env.SERVER_URL,
      auth ,
      command :{
        '-db' : 'Test',
        '-findall' : true,
        '-lay' : 'people'
      }
    };
    return client(options)
      .then(json=>{
        assert(json.error.code === 0, 'error.Code = 0')
        return json
      })
  })


});

describe.only( 'bad url' , function() {

  it('should not throw an error', function () {
    const options = {
      server: 'yuck.com',
      auth,
      command: {
        '-db': 'Test',
        '-findall': true,
        '-lays': 'people'
      }
    };
    return client(options)
      .catch(err=>{
        assert(err.name==='RequestError')
        return console.log()
      })
  })
});