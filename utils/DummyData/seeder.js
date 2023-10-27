const fs = require('fs')
// eslint-disable-next-line import/no-extraneous-dependencies
require('colors')
const dotenv = require('dotenv')
const dbConnect = require('../../config/dbConnection')
const Product = require('../../Models/ProductModel')

dotenv.config({path : '../../config.env'})

// connect database
dbConnect();

// read data
const products = JSON.parse(fs.readFileSync("./products.json"))

// create dummy
const insertData = async ()=>{
    try{
        await Product.create(products);
        console.log('Data inserted'.green.inverse)
        process.exit();

    }catch(error){
        console.log(error);
    }
}

// delete dummy
const deleteData = async ()=>{
    try{
        await Product.deleteMany();
        console.log('data Deleted'.red.inverse);
        process.exit()
    }catch(error){
        console.log(error);
    }
}

// node seeder.js -i
// 0        1      2
if(process.argv[2] === '-i'){
    insertData();
// node seeder.js -d
}else if(process.argv[2] === '-d'){
    deleteData();
}



