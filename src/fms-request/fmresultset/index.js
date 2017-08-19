const fastParser = require("./fastParser");
const formatter = require("./formatter");
const Promise = require("bluebird");

module.exports = xml => {
  return Promise.try(() => {
    const json = fastParser(xml);
    return formatter(json);
  });
};
