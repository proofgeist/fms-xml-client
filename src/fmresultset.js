'use strict';
/**
 * Created by toddgeist on 4/23/16.
 */




const parseString = require('./parseString');

module.exports = (xml)=> {

  return parseString(xml)
    .then(json=>{
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


      const fieldDefinations = json.fmresultset.metadata[0]['field-definition']

      const fields = {}
      fieldDefinations.map(field=>{
        field = field.$
        const newField = {
          autoEnter: field['auto-enter'] === 'yes',
          timeOfDay: field['time-of-day'] === 'yes',
          notEmpty: field['not-empty'] === 'yes',
          numericOnly: field['numeric-only'] === 'yes',
          fourDigitYear: field['four-digit-year'] === 'yes',
          global: field['global'] === 'yes',
          maxRepeat: field['max-repeat'] === 'yes'
        }

        fields[field.name] = newField;

      });


      const resultSet = json.fmresultset.resultset[0];
      const records = resultSet.record.map(record => {
        const recObj = {};
        recObj['modId'] = record.$['mod-id'];
        recObj['recId'] = record.$['record-id'];
        const arrayOfFieldData = record.field
        arrayOfFieldData.map(field=>{
          recObj[field.$.name] = field.data[0]
        });
        return recObj

      });

      result.records = records;
      result.fields = fields;
      console.log(result)

      return result
    })

}