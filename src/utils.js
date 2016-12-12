'use strict';

/**
 *
 * @param options options object
 * @param options.server the server url
 * @param options.auth user login info
 * @param options.auth.user user name
 * @param options.auth.password user password
 * @param options.command the command object to pass to the XML gateway
 * @returns {{uri: string, auth: *}}
 */
const requestOptions = (options)=>{

  const request = {
    uri: options.server + '/fmi/xml/fmresultset.xml',
    auth : Object.assign({}, options.auth, {sendImmediate : true})
  };

  request.strictSSL=false;
  request.resolveWithFullResponse = true;
  request.simple = false;
  request.headers = {
   contentType : 'application/xml'
  };

  if(options.command['-edit'] || options.command['-new']){
    request.method = 'POST';
    request.form = options.command
  }else{
    request.method = 'GET';
    request.qs = options.command
  }

  return request

};

module.exports = {

  requestOptions

}