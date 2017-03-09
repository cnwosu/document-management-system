var User = require('./server/models/index.js').User;

var newUser = {
  fullname: "Ngozi Achoi",
  username: "hglox",
  password_digest: "funnyp",
  email: 'going@go.com',
  roleId: 1
};

// var userBuild = User.build(newUser);

// console.log(userBuild);
User.create(newUser).then((user) => {
  // if(err) return err;
  console.log(user);
});

var Document = require('./server/models/index.js').Document;

var newDocument = {
  userId: "001",
  title: "The pelican brief",
  content: "A book by John Grisham, a really trilling read.",
  access: "READ"
};

Document.create(newDocument).then((document, err) => {
  if(err) return err;
  console.log(document);
});