const Service = require("./clientFactory");
const cloneDeep = require("lodash.clonedeep");
const layoutFactory = require("./layoutFactory");

/**
 * 
 * @typedef {object} ServerOptions
 * @property {string} serverAddress the full url to the server 
 * @property {Auth} auth
 * 
 * @typedef {object} Auth
 * @property {string} user the default username
 * @property {string} password the default password
 * 
 * @param {ServerOptions} config 
 * @returns {{layout : Function}}
 */
const fms = config => {
  const opts = cloneDeep(config);

  return {
    /**
     * DB Object Factory
     * 
     * @param {string} db the name of the file 
     * @returns {{layout : Funtion}}
     */
    db(db) {
      const command = {
        "-db": db
      };
      const newOpts = Object.assign({}, opts, { command });
      return layoutFactory(newOpts);
    }
  };
};

module.exports = fms;
