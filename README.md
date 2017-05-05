# fms-xml-client

A Promise based FileMaker Server XML gateway client for node.js.
note! Becuase of CORS issues with FileMaker server this is only useful in node. It will not work in the browser.

### 2.x Verson Breaking Change
recid and modid are now returned in the same format that get sent it ie `-recid` and `-modid`

### 2.1 added expiremental createClient function
new Function that will create client with some built in methods, like save, upsert, find, delete etc. Pass in the same options as when making the raw request (see below)

`const createClient = require('fms-xml-client').createClient`

## Goals

Make it easy to make request to FileMaker Server's xml gateway

* server - the server url
* auth - an object with "user" and "pass" properties
* command - an object that describes the XML Gateway command


## Usage
### Raw Request ( original method )

```javascript
const request = require('fms-xml-client');
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
request(options)
    .then(json=>{
        // do stuff with son
    })
    .catch(err=>{
        // do stuff with error
    })
```


### Command Object


### useing createClient()

```javascript
const createClient = require('fms-xml-client').createClient;
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

const People = createClient(options)
// query can use all the xml gateway options for finding.
// finds all the records where the firstName contains 'joe'
const query = ({firstName : 'joe', "firstName.op" : 'cn' })
People.find(query).then(resultset=>{
    //do stuff
})

```

All off the FileMaker XML Gateway command and parameters are supported in the command object.

All of the query commands are documented in the [FileMaker® Server 15
Custom Web Publishing Guide](https://fmhelp.filemaker.com/docs/15/en/fms15_cwp_guide.pdf) starting on paging 37.

### Running the Test

You'll need to put the Test.fmp12 file on a FileMaker Server.

We use dotenv for setting the required ENV variables.  You can see the required vars in test/required.en. Copy the file to test/.env and set the vars correctly.

__.env is never committed to git__

finally run `npm test`