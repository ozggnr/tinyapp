const { assert } = require('chai');
const { getUserByEmail } = require('../helper_functions.js');
const testUsers = {
  "userRandomID" : { 
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID" : {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password : "dishwasher-funk"
  }
};
console.log(getUserByEmail("sth@about.com", testUsers));
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
  it('should return undefined if the email does not exist', function() {
    const user = getUserByEmail("sth@about.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});