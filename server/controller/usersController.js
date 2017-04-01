import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import db from '../models/index';

const User = db.User;

class usersController {

  static login(req, res) {
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user && bcrypt.compareSync(req.body.password, user.password_digest)) {
        const tokenData = { userId: user.id, email: user.email, roleId: user.roleId };
        const token = jsonwebtoken.sign(tokenData, process.env.SECRET);
        const userDetails = { fullname: user.fullname, roleId: user.roleId };
        res.status(200).json({ message: 'success', jwt: token, userData: userDetails });
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    });
  }

  static logout(req, res) {
    return res.status(201).json({ message: "i'm going!" });
  }

  static newUser(req, res) {
    if (!req.body.fullname || !req.body.username || !req.body.password
    || !req.body.email || !req.body.roleId) {
      return res.status(400).send({ message: 'Incomplete details' });
    } else if (req.body.fullname.trim() === '' || req.body.username.trim() === ''
    || req.body.password.trim() === '' || req.body.email.trim() === ''
    || (!parseInt(req.body.roleId, 10))) {
      return res.status(400).send({ message: 'Invalid details' });
    }
    const password = bcrypt.hashSync(req.body.password);
    User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        fullname: req.body.fullname,
        username: req.body.username,
        password_confirmation: req.body.password_confirmation,
        password_digest: password,
        password: req.body.password,
        email: req.body.email,
        roleId: req.body.roleId
      }
    }).spread((userData, created) => {
      if (!created) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const tokenData = { userId: userData.id, email: userData.email, roleId: userData.roleId };
      const token = jsonwebtoken.sign(tokenData, process.env.SECRET);
      res.status(201).json({ userData, token });
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
      res.status(500).json({ message: err.message });
    });
  }

  static findUser(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      if (user && (user.id === req.token.userId || req.token.roleId === 1)) {
        res.status(200).json({ user });
      } else if (user && (user.id !== req.token.userId && req.token.roleId !== 1)) {
        res.status(409).json({ message: 'User Unauthorised' });
      } else {
        res.status(404).json({ message: 'User does not exist' });
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
        user.password_digest = password;
        user.save().then(() => {
          res.status(200).json({ message: 'User details Updated' });
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
          res.status(200).json({ message: 'success', documents });
        });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
  }

  static deleteUser(req, res) {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
      if (user.email === req.token.email || req.token.roleId === 1) {
        User.destroy({ where: { id: req.params.id } }).then((info, err) => {
          if (err) {
            res.status(500).json({ message: 'Could not delete user' });
          } else {
            res.status(204).json({ message: 'User successfully deleted' });
          }
        });
      } else {
        res.status(401).json({ message: 'User Unauthorised' });
      }
    });
  }
}

export default usersController;
