import jwt from 'jsonwebtoken';
import { User } from '../models/index';

require('dotenv').config();

/**
 *
 */

class AuthorizationController {
  static getToken(request, response) {
    if (!request.headers.authorization) {
      return response.status(401).json({ message: 'User unauthorized' });
    }
    return request.headers.authorization;
  }

  static isAuthorized(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'User unauthorized' });
    }
    let verifyToken;
    try {
      verifyToken = jwt.verify(AuthorizationController.getToken(req, res), process.env.SECRET);
    } catch (e) {
      // Token is malformed hence unauthorized
      return res.status(401).json({ message: 'User unauthorized' });
    }
    if (verifyToken) {
      req.token = verifyToken;
      next();
    } else {
      res.status(401).json({ message: 'User unauthorized' });
    }
  }

  static isAdmin(req, res, next) {
    const decodedToken = jwt.decode(AuthorizationController.getToken(req, res));
    req.token = decodedToken;
    if (decodedToken.roleId !== 1) {
      return res.status(401).json({ message: 'Only an admin can perform this action' });
    }
    next();
  }
}

module.exports = AuthorizationController;
