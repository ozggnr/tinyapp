const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080; 
const bodyParser = require("body-parser");
const {
      generateRandomString, 
      emailFinder,
      checkUser,
      urlUser
    } = require('./helper_functions');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//define the database which we will use or add different values
const oldurlDatabase = {
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
    password: "purple-monkey-dinosaur"
  },
 "userIDtwo": {
    id: "userIDtwo", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//render database in urls_index
app.get("/urls", (req,res) => {
  const user_id = req.cookies["user_id"];
  const userTable = urlUser(urlDatabase,user_id);
  const templateVars = {user : users[user_id], urls : userTable};
  res.render("urls_index",templateVars);
})

app.post("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const randomString = generateRandomString()
  let longURL = req.body.longURL;
  urlDatabase[randomString] = {longURL, userID: user_id}; 
  res.redirect(`/urls/${randomString}`);
});

app.get("/urls/new", (req,res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = { user : users[user_id] }
  res.render("urls_new",templateVars);
})

app.post("/login", (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(403).send("Email or password is missing");
  }
  const returnedUser = checkUser(email, users)
  if (returnedUser === null) {
    return res.status(403).send("User does not exist");
  }
  if (returnedUser.password !== password) {
    return res.status(403).send("Incorrect password! Try Again");
  } 
  res.cookie("user_id", returnedUser.id);
  
  res.redirect("/urls");
})

app.get('/login', (req,res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = { user : users[user_id] }
  res.render("login_page",templateVars);
})

app.post('/logout', (req,res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})
app.get("/register", (req,res) => {
  res.render("registration");
})

app.post('/register', (req,res) => {
  const id = generateRandomString();
  const { email, password } = req.body;

  if (!email || !password) { 
    return res.status(404).send("Email or password is missing!")
  }
  
  const emailChecker = emailFinder(email,users);
  if (emailChecker) {
    return res.send("This email is already exist!");
  }
  const newUser = { id, email, password };
  users[id]= newUser;
  res.cookie("user_id",newUser.id)
  res.redirect("/urls")
})


app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = {
  user : urlDatabase[req.params.shortURL].userID,
  longURL : urlDatabase[req.params.shortURL].longURL,
  shortURL : req.params.shortURL}
  res.render("urls_show", templateVars)
});
//for our database
app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params)
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//update
app.post("/urls/:shortURL", (req,res) => {
 
  if (res.status(302)) {
    res.send("Forbidden")
  } else {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
  }
})
//Delete
app.post("/urls/:shortURL/delete", (req,res) => {
  if (res.status(302)) {
    res.send("Forbidden")
  } else {
  delete urlDatabase[req.params.shortURL]; 
}
  res.redirect('/urls')
})

//Server listen given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});