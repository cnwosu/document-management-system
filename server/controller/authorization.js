import jwt from 'jsonwebtoken';
import { User } from '../models/index';

require('dotenv').config();

/**
 *
 */

class AuthorizationController {
  static getToken(request, response) {
    if (request.headers.authorization) {
      return request.headers.authorization;
    }
    response.status(500).json({ error: 'You are not signed in' });
  }

  static isAuthorized(req, res, next) {
    const verifyToken = jwt.verify(AuthorizationController.getToken(req, res), process.env.SECRET);
    if (verifyToken) {
      req.token = verifyToken;
      next();
    } else {
      res.status(401).json({ message: 'Token expired' });
    }
  }

  static isAdmin(req, res, next) {
    const decodedToken = jwt.decode(AuthorizationController.getToken(req, res));
    req.token = decodedToken;
    if (decodedToken.roleId !== 1) {
      return res.status(401).json({ message: 'Only an admin can perform this action' });
    }
    next();
  //   User.findOne({
  //     where: {
  //       id: decodedToken.user.idß
  //     }
  //   })
  //  .then((user) => {
  //    // Admin has a roleId of 1
  //    if (user.roleId === 1) {
  //      next();
  //    } else {
  //      return res.status(401)
  //        .json({ error: 'Only an admin can perform this action' });
  //    }
  //  })
  //    .catch((error) => {
  //      res.status(401).json({ error: error.message });
  //    });
  }
}

module.exports = AuthorizationController;
