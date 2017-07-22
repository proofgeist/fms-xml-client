# fms-xml-client

A Promise based FileMaker Server XML gateway client for node.js.
note! Because of CORS issues with FileMaker server this is only useful in node. It will not work in the browser.

### Version 3 Makes the simple client the default

if you need the old request object api it is still available as an additional export

```javascript
const request = require('fas-xml-client').request
```

## Usage
### Version 3 and greater.

Using the provided factory functions you create a Layout Object, for the layout you want to target. The Layout Object has a bunch of usefule methods for find, updates, etc.  See API below for details.

```javascript
// get as server factory function
const fms = require('fms-xml-client');

//config options
const options = {    
    server : "<serverURL>",
    auth : {
        user : "admin"
        pass : "pass"
    }
}

//use it to create a server object
const server = fms(options);

//get a DB object
const db = server.db("Test");

//finally get a Layout Object
const People = db.layout("people")

// query can use all the xml gateway options for finding.
// finds all the records where the firstName contains 'joe'

const query = ({firstName : 'joe', "firstName.op" : 'cn' })
People.find(query).then(resultset=>{
    //do stuff
})

// See API below for each method available to a Layout Object

```


### Layout Object API

Each method can take two optional parameters
* additionalCommands - xml gateway commands to add to the request. Useful for things like adding sorts, running scripts, max and skip etc.
* auth - lets you change the auth for just this command

Everything returns a Promise. If you care what flavor, we use bluebird Promise.


#### find 
find records using a query
`People.find(query, additionalCommands, auth)`

#### findAll 
find all the records
`People.findAll(addtionalCommands, auth)`


#### save
Save a record to the db. it will create it if it doesn't exist. 
`People.save(data, additionalCommands, auth)`

#### update
update the first record found with the query
`People.update(query,  data, additionalCommands, auth)`

#### upset 
update or the first record found with the query, or insert it if it doesn't exist
`People.upsert(query, data, additionalCommands, auth)`

#### delete 
delete the first record found by the query
`People.delete(query, additionalCommands, auth)`

delete the first record found by the query
`People.delete(query, additionalCommands, auth)`


All off the FileMaker XML Gateway command and parameters are supported in the command object.

All of the query commands are documented in the [FileMaker® Server 15
Custom Web Publishing Guide](https://fmhelp.filemaker.com/docs/15/en/fms15_cwp_guide.pdf) starting on paging 37.

### Using The Raw Request Object



```javascript
const request = require('fms-xml-client').request;
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

### Running the Test

You'll need to put the Test.fmp12 file on a FileMaker Server.

We use dotenv for setting the required ENV variables.  You can see the required vars in test/required.en. Copy the file to test/.env and set the vars correctly.

__.env is never committed to git__

finally run `npm test`