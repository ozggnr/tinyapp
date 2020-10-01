
//create random strings for shortURL and user ID
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
}

//Find if the email is already exist or not
const getUserByEmail = function (email, people) {
  for (let user_id in people) {
    const newPerson = people[user_id];
    if (newPerson.email === email) {
      return newPerson;
    }
  }
  // return null;
}
//This will check if the email is exist or not
const checkUser = function (email, db) {
  for (let user in db) {
    if (db[user].email === email) {
      return db[user];
    }
  }
  return null;
}
//this function will return if the URLs where userID is equal to the id of the currently logged-in user
const urlUser = function (dbUrl, id) {
  const filtered = {};
  for (let shortURL in dbUrl) {
    const urlObj = dbUrl[shortURL];
    if (urlObj.userID === id) {
      filtered[shortURL] = urlObj;
    }
  }
  return filtered;
}

 module.exports = {generateRandomString, checkUser, urlUser, getUserByEmail};