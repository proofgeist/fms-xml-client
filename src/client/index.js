const request = require("../fms-request");
const FMSError = require("../fms-request/FileMakerServerError");
const debug = require("debug")("fms-xml-client");

const handleResponse = response => {
  debug("Response", response);
  if (response.error.code === 0 || response.error.code === 401) {
    return {
      count: response.datasource["total-count"],
      records: response.records ? response.records : []
    };
  } else {
    throw new FMSError(response.error.code);
  }
};

/**
 * @param options
 * @param options.server  the FileMaker Server URL
 * @param options.auth
 * @param options.auth.user the user name
 * @param options.auth.pass the user password
 * @param options.command the XML gateway command object
 * @returns {Promise.<T>}
 */
const createClient = options => {
  const baseOpts = options;

  const buildOpts = (record, commands, auth) => {
    const opts = {
      server: baseOpts.server,
      auth: Object.assign({}, baseOpts.auth),
      command: Object.assign({}, baseOpts.command)
    };
    if (auth) {
      Object.assign(opts, auth);
    }
    opts.command = Object.assign(opts.command, record, commands);
    return opts;
  };

  const addCommandParam = (command, param) => {
    const modifiedCommand = command ? command : {};
    modifiedCommand[param] = true;
    return modifiedCommand;
  };

  /**
   * saves a record, creates it if it doesn't exist
   * @param {object} record 
   * @param {object} optionalCommands 
   * @param {object} auth 
   */
  const save = (record, optionalCommands, auth) => {
    const param = record["-recid"] ? "-edit" : "-new";
    const commands = addCommandParam(optionalCommands, param);
    const opts = buildOpts(record, commands, auth);
    debug("saving with these opts", opts);
    return request(opts).then(handleResponse);
  };

  /**
 * performs a find using the query Object
 * @param {object} query 
 * @param {object} optionalCommands 
 * @param {object} auth 
 */
  const find = (query, optionalCommands, auth) => {
    const commands = addCommandParam(optionalCommands, "-find");
    const opts = buildOpts(query, commands, auth);
    return request(opts).then(handleResponse);
  };

  /**
 * finds an updates the first record returned by the find
 * creates the record if it isn' there.
 * @param {object} query 
 * @param {objet} newData 
 * @param {object} optionalCommands 
 * @param {object} auth 
 */
  const upsert = (query, newData, optionalCommands, auth) => {
    return find(query, optionalCommands, auth)
      .then(handleResponse)
      .then(resultSet => {
        const record = resultSet.records[0] ? resultSet.records[0] : {};
        Object.assign(record, newData); //merge
        return save(record, optionalCommands);
      });
  };

  const deleteByRecId = (recid, optionalCommand, auth) => {
    const commands = addCommandParam(optionalCommands, "-delete");
    commands["-recid"] = recid;
    opts = buildOpts({}, commands, auth);
    return request(opts);
  };

  /**
   * deletes the first record returned by the find if there is one
   * @param {object} query 
   * @param {object} optionalCommand 
   * @param {object} auth 
   */
  const remove = (query, optionalCommand, auth) => {
    if (query["-recid"]) {
      return deleteByRecId(query["-recid"]);
    } else {
      return find(query, optionalCommand, auth).then(resultSet => {
        const record = resultSet.records[0];
        if (record) {
          return deleteByRecId(record["-recid"], optionalCommand, auth);
        } else {
          throw new FMSError(401);
        }
      });
    }
  };

  return {
    save,
    find,
    upsert,
    delete: remove
  };
};

module.exports = createClient;
