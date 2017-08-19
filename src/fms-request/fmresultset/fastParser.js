const fastXmlParser = require("fast-xml-parser");

module.exports = xml => {
  // when a tag has attributes
  var options = {
    attrPrefix: "",
    ignoreTextNodeAttr: false,
    ignoreNonTextNodeAttr: false,
    arrayMode: true,
    textNodeName: "$"
  };
  /*if (fastXmlParser.validate(xmlData) === true) {
    //optional
    var data = fastXmlParser.parse(xmlData, options);
  }*/

  const data = fastXmlParser.parse(xml, options);

  return data;
};
