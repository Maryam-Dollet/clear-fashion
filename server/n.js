const {MongoClient} = require('mongodb');
const products = require("./output.json")

const MONGODB_URI = "mongodb+srv://maryam:<password>@cluster0.kolklxw.mongodb.net/?retryWrites=true&w=majority";
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

    let yourDate = new Date()
    yourDate.toISOString().split('T')[0]

    console.log(yourDate)

    const query = {date:{$lte: getToday(), $gte: getToday(removeTwoWeeks())}}
    const prods = await collection.find(query).toArray();

    console.log(prods);
    client.close();

}

//findbrand('circlesportswear');

//findprice(30);

//priceSort()

//dateSort();

selectDate()


//console.log(getToday(removeTwoWeeks()))
//console.log(getToday())

//addprods();

