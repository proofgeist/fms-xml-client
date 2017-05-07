const assert = require("assert");
const createClient = require("../../src/client");
const r = require("../../");
const auth = {
  user: "admin",
  pass: "admin"
};

const options = {
  server: process.env.SERVER_URL,
  auth,
  command: {
    "-db": "Test",
    "-lay": "people"
  }
};

const DB = createClient(options);
describe.skip("client", function() {
  describe("find", function() {
    it("should find some records", function() {
      return DB.find({ name: "Dave" }).then(json => {
        assert(json.count === 1);
        return json;
      });
    });

    it("should find all", function() {
      return DB.findall().then(result => {
        assert(result.count > 3);
        return result;
      });
    });
  });

  describe("delete", function() {
    it("should remove the record", function() {
      const query = { name: "delete me" };
      return DB.delete(query).then(result => {
        assert(result.count === 0);
        return result;
      });
    });

    it("should fail to record", function() {
      const query = { name: "no me" };
      return DB.delete(query).catch(e => {
        assert(e.error === 401);
        return e;
      });
    });
  });
});
