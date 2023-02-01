const mongodb=require('mongodb')
const dbName='Pass'
const dbUrl=`mongodb+srv://sachinyadav:Developer123@sachin.uhlse2y.mongodb.net/${dbName}`
const MongoClient=mongodb.MongoClient;

module.exports={mongodb,dbName,dbUrl,MongoClient}