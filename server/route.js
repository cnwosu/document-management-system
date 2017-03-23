import documentController from './controller/documentController';
import usersController from './controller/usersController';
import Authorization from './controller/authorization';
import roleController from './controller/roleController';

const express = require('express');

const router = express.Router();


router.post('/users/login', usersController.login);

router.post('/users/logout', usersController.logout);

router.post('/users', usersController.newUser);

router.get('/users', Authorization.isAuthorized, Authorization.isAdmin,
usersController.getUsers);

router.get('/users/:id', usersController.findUser);

router.put('/users/:id', Authorization.isAuthorized, usersController.updateUser);

router.delete('/users/:id', Authorization.isAuthorized, usersController.deleteUser);

router.get('/search/users', usersController.searchUser);

router.post('/documents/', Authorization.isAuthorized, documentController.newDocument);

router.get('/documents/', Authorization.isAuthorized, documentController.getDocuments);

router.get('/documents/:id', Authorization.isAuthorized, documentController.findDocument);

router.put('/documents/:id', Authorization.isAuthorized, documentController.updateDocument);

router.delete('/documents/:id', Authorization.isAuthorized, documentController.deleteDocument);

router.get('/users/:id/documents', usersController.userDocuments);

router.get('/search/documents', documentController.searchDocument);

router.post('/roles', Authorization.isAuthorized, Authorization.isAdmin, roleController.createRole);

router.get('/roles', Authorization.isAuthorized, roleController.getRoles);

router.get('/roles/:id', Authorization.isAuthorized, roleController.getRoles);

router.delete('/roles/:id', Authorization.isAuthorized, Authorization.isAdmin, roleController.deleteRole);

router.put('/roles/:id', Authorization.isAuthorized, Authorization.isAdmin, roleController.updateRole);


export default router;
