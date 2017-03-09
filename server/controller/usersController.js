import db from '../models/index';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken'; 

const User = db.User;

class usersController {
 
   static login(req, res) {
    User.findOne({where: {email: req.body.email}}).then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password_digest)){
        var token = jsonwebtoken.sign({ user: user }, 'secret');
        res.status(200).json({message: 'success', jwt: token});
      } else{
        res.status(500).json({error: err.message});
      }
    });
  }
  
  static logout(req, res) {
    return res.status(201).json({message: "i'm going!"})
     
  }
  
  static newUser(req, res) {
     const user = {};
     user.fullname = req.body.fullname;
     user.username = req.body.username;
     user.password = req.body.password;
     user.password_confirmation = req.body.password_confirmation;
     user.email = req.body.email;
     user.roleId = req.body.roleId;
     User.create(user).then((user) => {
       res.status(201).json({message: user});
     }).catch((err) => {
       res.status(500).json({error: err.message});
     });
    
  }
  
  static getUsers(req, res) {
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
    User.all(queryParams).then((users) => {
      res.status(200).json({users});
    }).catch((err) => {
      res.status(500).json({error: err.message});
    })
  }

  
  static findUser(req,res) {
    User.findOne({where: {id: req.params.id}}).then((user) => {
      if (user){
        res.status(200).json({user: user});
      }
      else{
        res.status(500).json({error: 'User does not exsist'});
      }
    });
  }
  
  static updateUser(req, res) {
    User.findOne({where: {id: req.params.id}}).then((user) => {
      user.fullname = req.body.fullname;
      user.username = req.body.username;
      user.password = req.body.password;
      user.password_confirmation = req.body.password_confirmation;
      user.save().then(() => {
        res.status(200).json({success: "User details Updated"});
      });
    }).catch(err => {
      res.status(500).json({error: err.message});
    });
  };
  
  static deleteUser(req, res) {
    User.destroy({where: {id: req.params.id}}).then((user, err) => {
      if(err){
        res.status(500).json({error: err.message});
      } else{
        res.status(200).json({success: 'successfully deleted'});
      }
    })
  }
}

 export default usersController;
