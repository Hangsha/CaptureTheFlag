const express = require('express');
var mysql = require('mysql');
const path = require("path");
const app = express();

app.set('view engine', 'html');
app.use(express.urlencoded());
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"mydata"

});
//const connection = mysql.createConnection(config);

connection.connect(function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log('MySQL connected...');
  }
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + './home.html');
});
app.get('/register', (req, res) => {
  res.sendFile(__dirname + './register.html');
});

app.post('/register', function(req, res) {
  const { fullname, groupname, institutionname,password,confirm_password } = req.body;
  var sql = 'INSERT INTO ctf (fullname,groupname,institutionname, password,confirm_password) VALUES (? , ?, ?, ?, ?)';
  connection.query(sql,[fullname, groupname, institutionname,password,confirm_password] ,function(error, result) {
    if (error) {
      console.log(error);
      res.send('Registration failed...');
      console.log("Unable to Send data")
    } else {
      res.redirect('home.html');
    }
  });
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + './index.html');
});


app.post('/index', (req, res) => {
  const { groupname, password } = req.body;
  const sql = 'SELECT * FROM ctf WHERE groupname = ? AND password = ?';
  connection.query(sql, [groupname, password], (error, result) => {
    if (error) {
      console.log(error);
      res.send('Login failed...');
    } else {
      if (result.length > 0) {
        res.redirect('profile.html');
      }
      else {
        res.send('Email or password is incorrect...');
      }
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
