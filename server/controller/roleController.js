import db from '../models';

/**
 * roleController class
 * @class RoleController
 */
export default class RoleController {

/**
 * create a role
 * @method createRole
 * @param {object} req
 * @param {object} res
 * @return {object} HTTP response
 */
  static createRole(req, res) {
    if (req.body.title.trim() === '') {
      return res.status(400).send({ message: 'Specify role title' });
    }
    db.Roles.findOrCreate({
      where: { title: req.body.title }
    })
   .spread((role, created) => {
     if (!created) {
       res.status(409).json({ message: 'Role already exist' });
     } else {
       res.status(201).json(role);
     }
   });
  }

/**
 * deletes a role
 * @method deleteRole
 * @param {object} req
 * @param {object} res
 * @return {object} HTTP response
 */
  static deleteRole(req, res) {
    db.Roles.destroy({ where: { id: req.params.id } }).then((role, err) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send({ message: 'Role successfully deleted' });
      }
    });
  }

/**
 * get roles
 * @method getRoles
 * @param {object} req
 * @param {object} res
 * @return {object} HTTP response
 */
  static getRoles(req, res) {
    if (req.token.roleId !== 1) {
      return res.status(401).send({ message: 'User unauthorized' });
    }
    const queryParam = (req.params.id)
      ? { where: { id: req.params.id } }
      : {};
    db.Roles.findAll(queryParam)
    .then((role) => {
      if (role.length === 0) {
        return res.status(404).send({ message: 'Role does not exists' });
      }
      return res.status(200).send(role);
    });
  }


/**
 * get a role controller
 * @method updateRole
 * @param {object} req
 * @param {object} res
 * @return {object} HTTP response
 */
  static updateRole(req, res) {
    db.Roles.findOne({ where: { id: req.params.id } })
    .then((role) => {
      role.update({
        title: req.body.title
      })
      .then(() => {
        res.status(200).send({ message: 'Role Updated!' });
      });
    });
  }
}
