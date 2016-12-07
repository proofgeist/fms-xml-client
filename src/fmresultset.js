'use strict';
/**
 * Created by toddgeist on 4/23/16.
 */




const parseString = require('./parseString');

module.exports = (xml)=> {

  return parseString(xml)
    .then(json=>{
      const errorCode = parseInt(json.fmresultset.error[0].$.code);
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

      })
      return {errorCode, records   }
    })

}