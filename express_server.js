const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080; //default port 8080
//set ejs as the view engine
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
//define the database which we will use or add different values
const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//render database in urls_index
app.get("/urls", (req,res) => {
  const templateVars = {username: req.cookies["username"],urls : urlDatabase};
  res.render("urls_index", templateVars);
})
//create random string for shortURL
let randomString = generateRandomString()
//create a new key-value pair which comes from submission and add database
app.post("/urls", (req, res) => {
  urlDatabase[randomString] = req.body.longURL; 
  // console.log(urlDatabase); 
  res.redirect(`/urls/${randomString}`);
});
app.get("/urls/new", (req,res) => {
  const templateVars = {username: req.cookies["username"]}
  res.render("urls_new",templateVars);
})

app.post("/login", (req,res) => {
  res.cookie("username",req.body.username)
  // console.log(req)
  res.redirect("/urls")
})
app.get('/login', (req,res) => {
  const templateVars = {username: req.body.username}
  res.render("urls",templateVars)
})
app.post('/logout', (req,res) => {
  res.clearCookie("username")
  res.redirect("/urls")
})
app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const templateVars = {
  username: req.cookies["username"],
  longURL : urlDatabase[req.params.shortURL],
  shortURL : req.params.shortURL}
  res.render("urls_show", templateVars)
});
//for our database
app.get("/u/:shortURL", (req, res) => {
  console.log(req.params)
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//update
app.post("/urls/:shortURL", (req,res) => {
  console.log("something will update",req.params.shortURL,req.body.longURL)
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls")
})
//Delete
app.post("/urls/:shortURL/delete", (req,res) => {
  console.log("something will delete",req.params.shortURL)
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})



function generateRandomString() {
  return Math.random().toString(36).substring(2,8)
}


//Server listen given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});