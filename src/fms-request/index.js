"use strict";
/**
 * Created by toddgeist on 12/11/16.
 */

const r = require("request-promise");
const fmresultset = require("./fmresultset");
const requestOptions = require("./utils").requestOptions;

/**
 *
 * @param options
 * @param options.server  the FileMaker Server URL
 * @param options.auth
 * @param options.auth.user the user name
 * @param options.auth.pass the user password
 * @param options.command the XML gateway command object
 * @returns {Promise.<T>}
 */
module.exports = options => {
  return r(requestOptions(options))
    .then(response => {
      if (response.statusCode === 401) {
        return {
          error: {
            code: "212",
            errorMessage:
              "Invalid user account and/or password. Please try again"
          }
        };
      }
      return response;
    })
    .then(response => {
      if (response.error) {
        return response;
      }
      return fmresultset(response.body);
    });
};
