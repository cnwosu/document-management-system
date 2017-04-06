import db from '../models/index';


const Document = db.Document;


class documentController {
  static newDocument(req, res) {
    const document = {};
    if (!req.body.title || !req.body.userId || !req.body.content) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    Document.findOrCreate({
      where: {
        title: req.body.title
      },
      defaults: {
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
        access: req.body.access,
        ownerRoleId: req.token.roleId
      }
    }).spread((doc, created) => {
      if (!created && doc) {
        if (doc.userId === req.token.userId) {
          res.status(409).json({ message: 'Document already exists' });
        } else {
          res.status(200).json(doc);
        }
      } else if (doc) {
        res.status(201).json(doc);
      } else {
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: 'Could not create document', err });
    });
  }

  static getDocuments(req, res) {
    let queryParams = {};
    if (req.query.limit && req.query.offset) {
      queryParams = {
        limit: req.query.limit,
        offset: req.query.offset
      };
    }
    if (req.token.roleId === 1) {
      Document.findAll(queryParams).then((document) => {
        res.status(200).json(document);
      }).catch((err) => {
        res.status(500).json({ error: err.message });
      });
    } else {
      queryParams.where = {
        $or: {
          userId: req.token.userId,
          access: 'public',
          $and: {
            access: 'private',
            userId: req.token.userId
          },
          $or: {
            access: 'role',
            ownerRoleId: req.token.roldId,
          }
        }
      };
      Document.findAll(queryParams).then((document) => {
        res.status(200).json(document);
      }).catch((err) => {
        res.status(404).json({ message: err });
      });
    }
  }

  static findDocument(req, res) {
    Document.findOne({ where: { id: req.params.id } }).then((document) => {
      if (document) {
        if (req.token.roleId === 1) {
          res.status(200).json({ document });
        } else if (document.userId === req.token.userId || document.access === 'public'
          || (document.access === 'private' && document.userId === req.token.userId)
          || (document.access === 'role' && document.ownerRoleId === req.token.roleId)) {
          res.status(200).json(document);
        } else {
          res.status(401).json({ message: 'User cannot access document' });
        }
      } else {
        res.status(404).json({ message: 'Document does not exist' });
      }
    });
  }

  static updateDocument(req, res) {
    Document.findOne({ where: { id: req.params.id } }).then((document) => {
      if (req.token.roleId !== 1 && req.token.userId !== document.userId) {
        return res.status(401).send({ message: 'User Unauthorized' });
      }
      document.userId = req.body.userId;
      document.title = req.body.title;
      document.content = req.body.content;
      document.access = req.body.access;
      document.save().then(() => {
        res.status(200).json({ message: 'Document details Updated' });
      })
      .catch((err) => {
        res.status(400).json({ message: 'Invalid request parameters', err });
      });
    }).catch((err) => {
      res.status(404).json({ message: 'Document not found', err });
    });
  }

  static deleteDocument(req, res) {
    Document.findOne({ where: { id: req.params.id } }).then((document) => {
      if (req.token.roleId !== 1 && req.token.userId !== document.userId) {
        return res.status(401).send({ message: 'User Unauthorized' });
      }
      Document.destroy({ where: { id: req.params.id } }).then((doc, err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json({ message: 'Document successfully deleted' });
        }
      });
    });
  }

  static searchDocument(req, res) {
    if (!req.query.title && !req.query.access && !req.query.ownerRoleId) {
      return res.status(400).json({ error: 'Provide a valid query' });
    }
    const searchTitle = (req.query.title) ? req.query.title : null;
    // const searchAccess = (req.query.access) ? req.query.access : 'public';
    const searchRoleId = (req.query.ownerRoleId) ? req.query.ownerRoleId : 0;
    const limit = (req.query.limit) ? req.query.limit : 10;
    const query = {
      where: {
        $or: {
          title: {
            $like: `%${searchTitle}%`
          },
          ownerRoleId: searchRoleId,
       //    access: searchAccess
        }
      },
      limit
    };
    if (req.token.roleId !== 1) {
      query.where.userId = req.token.userId;
    }
    Document.findAll(query).then((documents) => {
      if (!documents) {
        return res.status(404).send({ message: 'Document not found' });
      }
      res.status(200).json(documents);
    });
  }
}

export default documentController;
