const errorMessage = require("../FileMakerServerError").errorMessage;

/**
 * normalize field definitions
 * @param json
 * @returns {{}}
 */
const normalizeFieldDefs = json => {
  const fieldDefinations = json.fmresultset[0].metadata[0]["field-definition"];

  const fields = {};
  fieldDefinations.map(field => {
    //field = field.$;
    fields[field.name] = {
      autoEnter: field["auto-enter"] === "yes",
      timeOfDay: field["time-of-day"] === "yes",
      notEmpty: field["not-empty"] === "yes",
      numericOnly: field["numeric-only"] === "yes",
      fourDigitYear: field["four-digit-year"] === "yes",
      global: field["global"] === "yes",
      maxRepeat: field["max-repeat"] === "yes"
    };
  });

  return fields;
};

/**
 * builds the record Obj
 * 
 * @param {object} record 
 * @returns {object} recird
 */
const extractFieldData = record => {
  const recObj = {};
  recObj["-modid"] = record["mod-id"][0];
  recObj["-recid"] = record["record-id"][0];
  const arrayOfFieldData = record.field;

  arrayOfFieldData.map(field => {
    recObj[field.name] = field.data[0];
  });

  return recObj;
};

const extractRelatedSets = record => {
  const arraryOfRelatedData = record.relatedset;
  if (!arraryOfRelatedData) return null;
  return arraryOfRelatedData.map(relatedSet => {
    const table = relatedSet.table;
    const count = parseInt(relatedSet.count);
    let normalizedRelatedRecords = [];
    if (count > 0) {
      normalizedRelatedRecords = relatedSet.record.map(record => {
        return extractFieldData(record);
      });
    }

    return {
      table,
      count,
      records: normalizedRelatedRecords
    };
  });
};

/**
 * normalize the records array out of the response
 * @param json
 * @returns {Array|*|{}}
 */
const normalizeRecords = json => {
  const resultSet = json.fmresultset[0].resultset[0];

  if (resultSet.count >= 1) {
    return resultSet.record.map(record => {
      const recObj = extractFieldData(record);
      recObj.relatedSets = extractRelatedSets(record);
      return recObj;
    });
  }
  return [];
};

const formatJSON = json => {
  const product = json.fmresultset[0].product[0];
  delete product.$;
  const datasource = json.fmresultset[0].datasource[0];
  delete datasource.$;
  const errorCode = parseInt(json.fmresultset[0].error[0].code);
  const errorMesg = errorMessage(errorCode);

  const result = {
    error: { code: errorCode, message: errorMesg },
    product,
    datasource
  };

  if (errorCode !== 0) {
    return result;
  }

  result.meta = {
    found: parseInt(json.fmresultset[0].resultset[0].count),
    total: parseInt(datasource["total-count"])
  };
  result.records = normalizeRecords(json);
  result.fields = normalizeFieldDefs(json);
  return result;
};

module.exports = json => {
  return formatJSON(json);
};
