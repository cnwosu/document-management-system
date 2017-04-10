import jwt from 'jsonwebtoken';

require('dotenv').config();

/**
 * AuthorizationController class: middleware
 */
class AuthorizationController {
  /**
   * getToken method verifies that a token was specified in the request header
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
   * isAuthorized method checks that a user is signed in
   * by getting the jwt token and checking that is not malformed or absent
   * @param {request} req request object
   * @param {response} res response
   * @param {callback} next callback function
   * @return {object} http response
  */
  static isAuthorized(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'User unauthorized' });
    }
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(AuthorizationController.getToken(req, res), process.env.SECRET);
    } catch (e) {
      // Token is malformed hence unauthorized
      return res.status(401).json({ message: 'User unauthorized' });
    }
    if (verifiedToken) {
      req.token = verifiedToken;
      next();
    } else {
      res.status(401).json({ message: 'User unauthorized' });
    }
  }

  /**
   * isAdmin method checks that the user is an admin by decoding
   * the user token and confirm that the role id is set to admin which is represented by 1
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
