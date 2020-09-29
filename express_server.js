const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
//set ejs as the view engine
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//define the database which we will use or add different values
const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//render database in urls_index
app.get("/urls", (reg,res) => {
  const templateVars = {urls : urlDatabase};
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
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const templateVars = {
  longURL : urlDatabase[req.params.shortURL],
  shortURL : req.params.shortURL}
  // console.log(req.params)
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