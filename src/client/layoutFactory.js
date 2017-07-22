const cloneDeep = require("lodash.clonedeep");
const Service = require("./clientFactory");

const layoutFactory = config => {
  const opts = cloneDeep(config);

  return {
    /**
     * Layout Object Factory
     * 
     * @param {string} layout the name of the layout
     * @returns {{find : Function}}
     */
    layout(layout) {
      const newOpts = cloneDeep(opts);
      newOpts.command["-lay"] = layout;
      return Service(newOpts);
    }
  };
};
module.exports = layoutFactory;
