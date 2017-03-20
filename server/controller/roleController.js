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
    db.Roles.create({
      title: req.body.title
    })
   .then((role, err) => {
     if (err) {
       res.status(500).json({ error: err.message });
     } else {
       res.status(200).json(role);
     }
   })
   .catch((err) => {
     res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ success: 'Role successfully deleted' });
      }
    });
  }

/**
 * get a role controller
 * @method getRole
 * @param {object} req
 * @param {object} res
 * @return {object} HTTP response
 */
  static getRoles(req, res) {
    const queryParam = (req.params.id)
      ? { where: { id: req.params.id } }
      : {};
    db.Roles.findAll(queryParam)
    .then((role) => {
      res.status(200).send(role);
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
