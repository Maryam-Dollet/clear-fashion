const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

const products = require("./output.json")

const MONGODB_URI = "mongodb+srv://maryam:jsonapi@cluster0.kolklxw.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

function getToday(date = new Date()){
    //var today = new Date();
    var dd = date.getDate();

    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();

    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;

    return today;
}

function removeTwoWeeks(date = new Date()) {
    date.setDate(date.getDate() - 7 * 2);
    return date;
  }

async function addprods(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const result = await collection.insertMany(products);

    console.log(result);

    client.close();
}

async function getAll(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const prods = await collection.find({}).toArray();

    console.log(prods);
    client.close();
}

async function getId(id){

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const prods = await collection.find({_id : id}).toArray();

    console.log(prods);
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

    const query = {date:{$lte: getToday(), $gte: getToday(removeTwoWeeks())}}
    const prods = await collection.find(query).toArray();

    console.log(prods);
    client.close();

}

async function getNumberProd(){
  
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)
  
    const collection = db.collection('products');
    
    const nbprods = await collection.countDocuments({}, { hint: "_id_" });
  
    //console.log(prods);
    client.close();
    //console.log(nbprods)
    return nbprods
  }

//findbrand('circlesportswear');

//findprice(30);

//priceSort()

//dateSort();

//selectDate()

//getAll()
//getId(new ObjectId("640756635a26b02b4e49f06d"))
//getId("640756635a26b02b4e49f06d")

//console.log(getToday(removeTwoWeeks()))
//console.log(getToday())

//console.log(getNumberProd())

//addprods();

