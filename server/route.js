import documentController from './controller/documentController';
import usersController from './controller/usersController';

var express = require('express');
var router = express.Router();


router.post('/users/login', usersController.login);

router.post('/users/logout', usersController.logout);

router.post('/users/', usersController.newUser);

router.get('/users/', usersController.getUsers);

router.get('/users/:id', usersController.findUser);

router.put('/users/:id', usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);

router.get('/users/q/:username', documentController.searchUser);

router.post('/documents/', documentController.newDocument);

router.get('/documents/', documentController.matchingInstances);

router.get('/documents/:id', documentController.findDocument);

router.put('/documents/:id', documentController.updateDocument);

router.delete('/documents/:id', documentController.deleteDocument);

router.get('/documents/:id/documents', documentController.userDocuments);

router.get('/documents/q/:doctittle'), documentController.searchDocument);

export default router;
