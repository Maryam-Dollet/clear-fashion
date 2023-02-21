const {MongoClient} = require('mongodb');
const sd = require("./sandbox")

const MONGODB_URI = 'mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';

const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
const db =  client.db(MONGODB_DB_NAME)

var prods = sd.sandboxall(eshop1, eshop2, eshop3)

const collection = db.collection('products');
const result = collection.insertMany(products);

console.log(result);
