const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { render } = require('ejs');
// const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  Name: String,
  Email: String,
  Phone: Number,
  Message: String,
};

const User = new mongoose.model('User', userSchema);

app
  .route('/user')
  .get((req, res) => {
    User.find({}, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        // res.send(user);
        res.render('form', {
          userData: user,
        });
      }
    });
  })
  .post((req, res) => {
    const newUser = new User({
      Name: req.body.name,
      Email: req.body.email,
      Phone: req.body.phone,
      Message: req.body.message,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully added a new User');
        res.redirect('/user');
      }
    });
  });

app
  .route('/user/:getid')
  .get((req, res) => {
    User.findOne({ _id: req.params.getid }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        res.send(foundUser);
        console.log(foundUser);
        res.render('user', {
          singleUser: foundUser,
        });
      }
    });
  })
  .put((req, res) => {
    User.update(
      { _id: req.params.getid },
      {
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Message: req.body.Message,
      },
      { overwrite: true },
      (err) => {
        if (err) {
          console.log(err, foundUser);
        } else {
          res.send('Successfully Updated the Document');
        }
      }
    );
  })
  .delete((req, res) => {
    User.deleteOne({ _id: req.params.getid }, (err) => {
      if (err) {
        console.log(err);
      } else {
        alert('Successfully deleted Document');
      }
    });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
