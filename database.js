//older version of our database example
const olderDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca",
             userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca",
             userID: "aJ48lW" }
};
//Database for users
const users = { 
  "userIDone": {
    id: "userIDone", 
    email: "user@example.com", 
    password: "purple"
  },
 "userIDtwo": {
    id: "userIDtwo", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
module.exports = {olderDatabase, urlDatabase, users}