import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import router from './server/route';

const webpackDevHelper = require('./index.dev.js');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);

if (process.env.NODE_ENV !== 'production') {
  webpackDevHelper.useWebpackMiddleware(app);
} else {
  app.use(express.static(path.join(__dirname, './client/dist')));
}
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

/**
 * Configure default port
 */
const port = process.env.PORT || 4000;


app.listen(port);
console.log(`here i am, up and running on http://localhost:${port}`);

module.exports = app;
