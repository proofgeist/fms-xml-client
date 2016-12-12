# fms-xml-client

A Promise based FileMaker Server XML gateway client for node.js.
note! Becuase of CORS issues with FileMaker server this is only useful in node. It will not work in the browser.

## Goals

Make it easy to make request to FileMaker Server's xml gateway. We may add some convenience function in the future, but right now you just construct an options object with the following properties and pass it to the client.

* server - the server url
* auth - an object with "user" and "pass" properties
* command - an object that describes the XML Gateway command


## Usage

```javascript
const client = require('fms-xml-client');
const options = {    
    server : "<serverURL>",
    auth : {
        user : "admin"
        pass : "pass"
    },
    command : {
      '-db' : 'Test',
      '-findall' : true,
      '-lay' : 'people'
    }
}

// make the request
client(options)
    .then(json=>{
        // do stuff with son
    })
    .catch(err=>{
        // do stuff with error
    })
```

### Command Object

All off the FileMaker XML Gateway command and parameters are supported in the command object.

All of the query commands are documented in the [FileMaker® Server 15
Custom Web Publishing Guide](https://fmhelp.filemaker.com/docs/15/en/fms15_cwp_guide.pdf) starting on paging 37.

### Running the Test

You'll need to put the Test.fmp12 file on a FileMaker Server.

We use dotenv for setting the required ENV variables.  You can see the required vars in test/required.en. Copy the file to test/.env and set the vars correctly.

__.env is never committed to git__

finally run `npm test`