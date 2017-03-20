import db from '../models/index';


const Document = db.Document;


class documentController {
  
  static newDocument(req, res) {
    const document = {};
    document.userId = req.body.userId;
    document.title = req.body.title;
    document.content = req.body.content;
    document.access = req.body.access;
    document.ownerRoleId = req.token.roleId;
    Document.create(document).then((document) => {
      if (document){
        res.status(200).json({message: document});
      } else {
        res.status(500).json({error: err.message});
      }
    });
  }
  
  static getDocuments(req, res) {
    let queryParams = {
      limit : 10,
      offset: 0,
    };
    if (req.query.limit && req.query.offset){
      queryParams = {
        limit: req.query.limit,
        offset: req.query.offset
      };
    }
    Document.all(queryParams).then((document) => {
      res.status(200).json({document});
    }).catch((err) => {
      res.status(500).json({error: err.message});
    })
  }

  static findDocument(req, res) {
    Document.findOne({where: {id: req.params.id}}).then((document) => {
      if (document){
        res.status(200).json({document: document});
      }
      else{
        res.status(500).json({error: 'Document does not exsist'});
      }
    });
  }

  static updateDocument(req, res) {
    console.log('=========++++', req.token);
    return res.status(200).send(req.params.id);
    // Document.findOne({where: {id: req.params.id}}).then((document) => {
    //   document.userId= req.body.userId;
    //   document.title = req.body.title;
    //   document.content = req.body.content;
    //   document.access = req.body.access;
    //   document.save().then(() => {
    //     res.status(200).json({success: "Document details Updated"});
    //   });
    // }).catch(err => {
    //   res.status(500).json({error: err.message});
    // });
  }
  
  static deleteDocument(req, res) {
    Document.destroy({where: {id: req.params.id}}).then((document, err) => {
      if(err){
        res.status(500).json({error: err.message});
      } else{
        res.status(200).json({success: 'Document successfully deleted'});
      }
    })
  }

  static searchDocument(req, res){
    if (req.query.q) {
      Document.findOne({
        where: {
          title: {
            $iLike: `%${req.query.q}%`
          }
        }
      }).then((document) => {
        res.status(200).json({ docs: document });
      }).catch((err) => {
        res.status(500).json({error: err.message});
      });
    } else {
      res.status(404).json({error: "Provide a query"});
    }
  }
}

export default documentController;