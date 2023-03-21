const cors = require('cors');
const express = require('express');
//const mongo = require("./n")
const helmet = require('helmet');
//const products = require("./output.json")


const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

const MONGODB_URI = "mongodb+srv://maryam:jsonapi@cluster0.kolklxw.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

/*
async function connectToDB(){

}

async function getAll(){
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');

  return collection;
}
*/

async function getBrands(){
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');
  
  const brand = await collection.distinct('brand');

  //console.log(prods);
  client.close();
  return brand
}

async function getAll(){
  
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');
  
  const prods = await collection.find({}).toArray();

  //console.log(prods);
  client.close();
  return prods
}

async function getId(id){

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');
  const prods = await collection.find({_id : new ObjectId(id)}).toArray();

  //console.log(prods);
  client.close();
  return prods
}

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/brands', async (request, response) => {
  const brands = await getBrands()
  response.send(brands);
  
})

app.get('/products', async (request, response) => {
  const products = await getAll()
  response.send(products);
  
})

app.get('/products/search/', async (request, response) => {
  const filters = request.query;


  //const filters = request.query.brand
  //const products = await getAll()

  const brand = request.query.brand;
  const desc = requesct.query.desc;
  const price = parseInt(request.query.price);
  var limit = parseInt(request.query.limit);
  let sort =  { price: 1 }

  let filter = {};
  if(desc==true){
    sort = { price: -1 }
  }

  if(brand){
    filter.brand = brand;
  }
  if(price){
    filter.price = {$lte : price}

  }
  
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');
  const prods = await collection.find(filter).sort(sort).limit(limit).toArray();

  response.send(prods)

})

app.get('/products/:id', async (request, response) => {
  const products = await getId(request.params.id)
  response.send(products);

})


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`)
