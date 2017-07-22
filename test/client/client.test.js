const assert = require("assert");
const fms = require("../../src/client");

const auth = {
  user: "admin",
  pass: "admin"
};

const options = {
  server: process.env.SERVER_URL,
  auth
};

const server = fms(options);
const testDB = server.db("Test");
const People = testDB.layout("People");

describe("client", function() {
  describe("find", function() {
    it("should find some records", function() {
      return People.find({ name: "Dave" }).then(json => {
        assert(json.count === 1);
        return json;
      });
    });

    it("should find all", function() {
      return People.findall().then(result => {
        assert(result.count > 3);
        return result;
      });
    });
  });

  describe("delete", function() {
    it("should remove the record", function() {
      const query = { name: "delete me" };
      return People.delete(query).then(result => {
        assert(result.count === 0);
        return result;
      });
    });

    it("should fail to record", function() {
      const query = { name: "no me" };
      return People.delete(query).catch(e => {
        assert(e.error === 401);
        return e;
      });
    });
  });

  describe("Upsert", function() {
    it("should edit the a record if it is there", function() {
      const query = { name: "Dave" };
      const newData = { age: 32 };
      return People.upsert(query, newData).then(result => {
        const age = parseInt(result.records[0].age);
        assert(age === 32, "age should have changed");
        return age;
      });
    });

    it("should add the record if it ins't there", function() {
      const query = { name: "Not there" };
      const newData = { name: "Not there" };
      return People.upsert(query, newData).then(result => {
        const name = result.records[0].name;
        assert(name === "Not there", "age should have changed");
        return name;
      });
    });
  });

  describe("Update", function() {
    it("should edit the record", function() {
      const query = { name: "Dave" };
      const newData = { age: 35 };
      return People.update(query, newData).then(result => {
        const age = parseInt(result.records[0].age);
        assert(age === 35, "age should have changed");
        return age;
      });
    });

    it("should error if record doesn't exist", function() {
      const query = { name: "really nobody" };
      const newData = { age: 900 };
      return People.update(query, newData).catch(e => {
        assert(e.error === 401, "should not find the record");
        return e;
      });
    });
  });
});
