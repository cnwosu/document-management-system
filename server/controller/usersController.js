import db from '../models/index';
import bcrypt from 'bcrypt-nodejs';
import jsonwebtoken from 'jsonwebtoken';

const User = db.User;

class usersController {

  static login(req, res) {
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password_digest)) {
        const tokenData = { userId: user.id, email: user.email, roleId: user.roleId };
        const token = jsonwebtoken.sign(tokenData, process.env.SECRET);
        res.status(200).json({ message: 'success', jwt: token });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
  }

  static logout(req, res) {
    return res.status(201).json({ message: "i'm going!" });
  }

  static newUser(req, res) {
    const user = {};
    const password = bcrypt.hashSync(req.body.password);
    user.fullname = req.body.fullname;
    user.username = req.body.username;
    user.password = req.body.password;
    user.password_confirmation = req.body.password_confirmation;
    user.password_digest = password;
    user.email = req.body.email;
    user.roleId = req.body.roleId;
    User.create(user).then((userData) => {
      const tokenData = { userId: userData.id, email: userData.email, roleId: userData.roleId };
      const token = jsonwebtoken.sign(tokenData, process.env.SECRET);
      res.status(201).json({ userData, token });
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  }

  static getUsers(req, res) {
    let queryParams = {
      limit: 10,
      offset: 0,
    };
    if (req.query.limit && req.query.offset) {
      queryParams = {
        limit: req.query.limit,
        offset: req.query.offset
      };
    }
    User.all(queryParams).then((users) => {
      res.status(200).json({ users });
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  }

  static findUser(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(500).json({ error: 'User does not exsist' });
      }
    });
  }

  static updateUser(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      const password = bcrypt.hashSync(req.body.password);
      if (user.email === req.token.email || req.token.roleId === 1) {
        user.fullname = req.body.fullname;
        user.username = req.body.username;
        user.password = req.body.password;
        user.password_confirmation = req.body.password_confirmation;
        password_digest = password;
        user.save().then(() => {
          res.status(200).json({ success: 'User details Updated' });
        }).catch((err) => {
          res.status(500).json({ error: err.message });
        });
      } else {
        res.status(401).json({ message: 'User Unauthorised' });
      }
    });
  }

  static searchUser(req, res) {
    if (req.query.q) {
      User.findOne({
        where: {
          username: {
            $iLike: `%${req.query.q}%`
          }
        }
      }).then((users) => {
        res.status(200).json({ users });
      }).catch((err) => {
        res.status(500).json({ error: 'An error occured' });
      });
    } else {
      res.status(404).json({ error: 'Provide a query' });
    }
  }

  static userDocuments(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      if (user) {
        user.getDocuments().then((documents) => {
          res.status(200).json({ docs: document });
        });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
  }

  static deleteUser(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      if (user.email === req.token.email || req.token.roleIc === 1) {
        User.destroy({ where: { id: req.params.id } }).then((user, err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(200).json({ success: 'User successfully deleted' });
          }
        });
      } else {
        res.status(401).json({ message: 'User Unauthorised' });
      }
    });
  }
}

export default usersController;
