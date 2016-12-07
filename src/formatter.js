'use strict';
'use strict';
/**
 * Created by toddgeist on 4/23/16.
 */



const xml2js = require('xml2js');
let FileMakerServerError = require('./FileMakerServerError');


const fieldArray = (json)=>{
  return json.FMPXMLRESULT.METADATA.map((fields)=>{
    return fields.FIELD.map((item)=>{

      const fieldName = item.$.NAME;
      const splitName = fieldName.split('::');
      const table = splitName.length===2 ? splitName[0] : '';

      const typer = {
        name : fieldName,
        type : item.$.TYPE,
        table : table
      };
      return typer;
    });

  })[0];
};

const parseString = (xml)=>{
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, function (err, json) {
      if (err)
        reject(err);
      else
        resolve(json);
    });

  })
};


module.exports = (xml)=>{


  let error;
  return parseString(xml)
    .then((json)=>{


      error = json.FMPXMLRESULT.ERRORCODE[0];
      if(error !== '0'){
        return new FileMakerServerError(error);
      }

      let fieldsArray =  fieldArray(json);
      let dataNode =  json.FMPXMLRESULT.RESULTSET[0];

      let totalFound = parseInt(dataNode.$.FOUND);

      let rows = dataNode.ROW;

      let data = [];
      if(totalFound > 0 && rows ){
        data = rows.map((row)=>{
          const record = {
            modid: parseInt(row.$.MODID),
            recid: parseInt(row.$.RECORDID)
          };

          fieldsArray.map((fieldDef, i)=>{

            if(fieldDef.table===''){
              let value = record[fieldDef.name] = row.COL[i].DATA[0];

              if(fieldDef.type==='NUMBER'){
                if(value){
                  value = parseFloat(value);
                }else{
                  value=null;
                }
              }
              record[fieldDef.name] = value;
            }else{
              // relatedRecords
            }
          });
          return record;
        });

      }

      return  {
        total:totalFound,
        error: error,
        data
      };


    });
};

