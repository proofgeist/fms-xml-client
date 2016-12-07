'use strict';
/**
 * converts FMS XML response in to normalized JSON
 */


const parseString = require('./parseString');



/**
 * normalize field definitions
 * @param json
 * @returns {{}}
 */
const normalizeFieldDefs = (json)=>{
  const fieldDefinations = json.fmresultset.metadata[0]['field-definition']

  const fields = {}
  fieldDefinations.map(field=>{
    field = field.$;
    fields[field.name] = {
      autoEnter: field['auto-enter'] === 'yes',
      timeOfDay: field['time-of-day'] === 'yes',
      notEmpty: field['not-empty'] === 'yes',
      numericOnly: field['numeric-only'] === 'yes',
      fourDigitYear: field['four-digit-year'] === 'yes',
      global: field['global'] === 'yes',
      maxRepeat: field['max-repeat'] === 'yes'
    };
  });

  return fields
};



/**
 * normalize the records array out of the response
 * @param json
 * @returns {Array|*|{}}
 */
const normalizeRecords = (json) => {
  const resultSet = json.fmresultset.resultset[0];

  return resultSet.record.map(record => {
    const recObj = {};
    recObj['modId'] = record.$['mod-id'];
    recObj['recId'] = record.$['record-id'];
    const arrayOfFieldData = record.field
    arrayOfFieldData.map(field=>{
      recObj[field.$.name] = field.data[0]
    });
    return recObj
  });

};



/**
 * normalizes JSON
 * @param json
 * @returns {{errorCode: Number, product: *, datasource: *}}
 */
const formatJSON= (json)=>{
  const product = json.fmresultset.product[0].$;
  const datasource = json.fmresultset.datasource[0].$;
  const errorCode = parseInt(json.fmresultset.error[0].$.code);

  const result = {
    errorCode,
    product,
    datasource
  };

  if(errorCode !== 0){
    return result
  }

  result.records = normalizeRecords(json);
  result.fields = normalizeFieldDefs(json);
  return result
};



/**
 * converts FMS XML response into normalized JSON
 * @param xml
 * @returns {*}
 */
module.exports = (xml)=> {

  return parseString(xml)
    .then(formatJSON);

};