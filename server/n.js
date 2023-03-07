const {MongoClient} = require('mongodb');
const products = require("./output.json")

const MONGODB_URI = "mongodb+srv://maryam:jsonapi@cluster0.kolklxw.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function addprods(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const result = await collection.insertMany(products);

    console.log(result);

    client.close();
}

async function findbrand(brand){

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const prods = await collection.find({brand}).toArray();

    console.log(prods);
    client.close();

}

async function findprice(priceC){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    const query = { price: { $lt: priceC } };

    const prods = await collection.find(query).toArray();


    console.log(prods);
    client.close();
}

async function priceSort(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    const query = {}
    const mysort = { price: 1 };
    const prods = await collection.find(query).sort(mysort).toArray();

    console.log(prods);
    client.close();
}

async function dateSort(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    const query = {}
    const mysort = { date: 1 };
    const prods = await collection.find(query).sort(mysort).toArray();

    console.log(prods);
    client.close();

}

async function selectDate(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    const query = {date:{$lte: new Date()}}
    const prods = await collection.find(query).toArray();

    console.log(prods);
    client.close();

}

//findbrand('circlesportswear');

//findprice(30);

//priceSort()

//dateSort();

selectDate()

//addprods();

