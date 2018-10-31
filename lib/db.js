let MongoClient = require("mongodb").MongoClient,
    DBurl = "mongodb://127.0.0.1:27017/test",
    ObjectID = require("mongodb").ObjectID;

/* 暴露objectID */
exports.ObjectID = ObjectID;

/**
 * 
 * @param {Function} callback 
 */
function __connectDB(callback) {
    MongoClient.connect(DBurl, (err, client) => {
        let dbo = client.db("test");
        callback(dbo);
    });
}

/**
 * 查询
 * @param {String} collectionName 
 * @param {Object} json 
 * @param {Function} callback 
 */
exports.find = (collectionName, json, callback) => {
    __connectDB((dbo) => {
        dbo.collection(collectionName).find(json).toArray((err, data) => {
            callback(err, data);
        });
    });
}

/**
 * 添加
 * @param {String} collectionName 
 * @param {Object} json 
 * @param {Function} callback 
 */
exports.insert = (collectionName, json, callback) => {
    __connectDB((dbo) => {
        dbo.collection(collectionName).insertOne(json, (err, data) => {
            callback(err, data);
        });
    });
}

/**
 * 修改
 * @param {String} collectionName 
 * @param {Object} json1 
 * @param {Object} json2 
 * @param {Function} callback 
 */
exports.update = (collectionName, json1, json2, callback) => {
    __connectDB((dbo) => {
        dbo.collection(collectionName).updateOne(json1, { $set: json2 }, (err, data) => {
            callback(err, data);
        });
    });
}

/**
 * 删除
 * @param {String} collectionName 
 * @param {Object} json 
 * @param {Function} callback 
 */
exports.delete = (collectionName, json, callback) => {
    __connectDB((dbo) => {
        dbo.collection(collectionName).deleteOne(json, (err, data) => {
            callback(err, data);
        });
    });
}