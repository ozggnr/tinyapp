const express = require("express");
const app = express();
const cookieSession = require('cookie-session') 
const PORT = 8080; 
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(
  cookieSession({
    name : "session",
    keys : ["key1","key2"] 
  })
)
const {
      generateRandomString, 
      checkUser,
      getUserByEmail,
      urlUser
    } = require('./helper_functions');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//define the database which we will use or add different values
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
//create users database
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
//render database in urls_index
app.get("/urls", (req,res) => {
  const user_id = req.session.user_id;
  const userTable = urlUser(urlDatabase,user_id);
  const templateVars = {user : users[user_id], urls : userTable};
  res.render("urls_index",templateVars);
})
app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const randomString = generateRandomString()
  let longURL = req.body.longURL;
  urlDatabase[randomString] = {longURL, userID: user_id}; 
  res.redirect(`/urls/${randomString}`);
});

app.get("/urls/new", (req,res) => {
  const user_id = req.session.user_id;
  const templateVars = { user : users[user_id] }
  res.render("urls_new",templateVars);
})

app.post("/login", (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(403).send("<h2>Email or password is missing</h2>");
  }
  const returnedUser = checkUser(email, users);
  if (!returnedUser) {
    return res.status(403).send("<h2>User does not exist</h2>");
  }
  if (returnedUser && bcrypt.compareSync(password,returnedUser.cryptPassword)) {
    req.session.user_id = returnedUser.id;
    res.redirect("/urls");
  } else if (!bcrypt.compareSync(password,returnedUser.cryptPassword)) {
    return res.status(403).send("<h2>Incorrect password! Try Again</h2>");
  } 
  req.session.user_id = returnedUser.id;
})

app.get('/login', (req,res) => {
  const user_id = req.session.user_id;
  const templateVars = { user : users[user_id] }
  res.render("login_page",templateVars);
})

app.post('/logout', (req,res) => {
  req.session["user_id"] = null ;
  res.redirect("/urls")
})

app.get("/register", (req,res) => {
  const user_id = req.session.user_id;
  const templateVars = { user : users[user_id] }
  res.render("registration",templateVars);
})

app.post('/register', (req,res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  
  if (!email || !password) { 
    return res.status(404).send("<h2>Email or password is missing!</h2>")
  }
  const emailChecker = getUserByEmail(email,users);
  if (emailChecker) {
    return res.send("<h2>This email is already exist!</h2>");
  }
  const cryptPassword = bcrypt.hashSync(password,saltRounds )
  const newUser = { id, email, cryptPassword  };
  users[id]= newUser;
  req.session.user_id = newUser.id;
  res.redirect("/urls")
})


app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  console.log(user_id)
  const templateVars = {
    user : users[user_id],
    longURL : urlDatabase[req.params.shortURL].longURL,
    shortURL : req.params.shortURL
  }
  res.render("urls_show", templateVars)
});

//for our database
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//update
app.post("/urls/:shortURL", (req,res) => {
  const user_id = req.session.user_id;
  if(user_id !== urlDatabase[req.params.shortURL].userID) {
    res.send("Forbidden!");
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect("/urls");
})

//Delete
app.post("/urls/:shortURL/delete", (req,res) => {
  const user_id = req.session.user_id;
  if(user_id !== urlDatabase[req.params.shortURL].userID) {
    res.send("Forbidden!");
  } else {
    delete urlDatabase[req.params.shortURL]; 
  }
  res.redirect('/urls')
})

//Server listen given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});