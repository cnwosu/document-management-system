import jwt from 'jsonwebtoken';

require('dotenv').config();

/**
 * AuthorizationController class: middleware
 */
class AuthorizationController {
  /**
   * getToken method
   * @param {request} request request object
   * @param {response} response response
   * @return {object} http response
  */
  static getToken(request, response) {
    if (!request.headers.authorization) {
      return response.status(401).json({ message: 'User unauthorized' });
    }
    return request.headers.authorization;
  }

  /**
   * isAuthorized method
   * @param {request} req request object
   * @param {response} res response
   * @param {callback} next callback function
   * @return {object} http response
  */
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

  /**
   * isAdmin method
   * @param {request} req request object
   * @param {response} res response
   * @param {callback} next callback function
   * @return {object} http response
  */
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
