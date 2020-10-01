
//create random strings for shortURL and user ID
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
}

//Find if the email is already exist or not
const emailFinder = function (email, people) {
  for (let user_id in people) {
    const newPerson = people[user_id];
    if (newPerson.email === email) {
      return newPerson;
    }
  }
  return null;
}
const checkUser = function (email, db) {
  for (let user in db) {
    if (db[user].email === email) {
      return db[user];
    }
  }
  return null;
}

 module.exports = {generateRandomString, emailFinder,checkUser};