import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './server/route';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(router);

app.get('/', (req, res) => {
  res.json({'message': 'Hello world'});
});

/**
 * Configure default port
 */
const port = process.env.PORT || 4000;


app.listen(port);
console.log(`here i am, up and running on http://localhost:${port}`);