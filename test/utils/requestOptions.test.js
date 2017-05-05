"use strict";

const assert = require("assert");
const requestOptions = require("../../src/fms-request/utils").requestOptions;

const server = "https://";
const auth = {
  user: "admin",
  pass: "admin"
};

describe("requestOptions", function() {
  it("should add defaults", function(done) {
    let options = requestOptions({ server, auth, command: {} });
    assert(options.auth.sendImmediate, "sendImmediate is true");
    assert(options.resolveWithFullResponse, "resolveWithFullResponse is true");
    assert(!options.simple, "simple is false");
    done();
  });

  describe("-find", function() {
    const data = {};
    data["-findany"] = true;
    data["firstName"] = "test";
    let options = requestOptions({ server, auth, command: {} });

    it('should have method "GET"', function(done) {
      assert(options.method === "GET", 'method is "GET"');
      done();
    });

    it("should have qs data", function(done) {
      assert(options.qs, "form should have a value");
      done();
    });
  });

  describe("-edit", function() {
    const data = {};
    data["-edit"] = true;
    data["firstName"] = "test";
    let options = requestOptions({ server, auth, command: data });

    it("should have method post", function(done) {
      assert(options.method === "POST", 'method is "POST"');
      done();
    });

    it("should have form data", function(done) {
      assert(options.form, "form should have a value");
      done();
    });
  });
});
