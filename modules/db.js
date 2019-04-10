const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
// Connection URL
var option = {
    useNewUrlParser: true
}
module.exports = {
    "conn": function (dbname, collection) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, option, (err, client) => {
                if (err) {
                    client.close();
                    reject(err);
                }
                console.log("Connection established");
                client.db(dbname)
                resolve({
                    "close": function () {
                        client.close()
                        console.log("Connection closed")
                    },
                    "fetch": function (query) {
                        return new Promise((resolve, reject) => {
                            client.db(dbname).collection(collection).find(query).toArray((err, doc) => {
                                if (err) reject(err)
                                resolve(doc);
                            })
                        });
                    },
                    "update": function (filter, update) {
                        return new Promise((resolve, reject) => {
                            var doc = client.db(dbname).collection(collection).updateOne(filter, update);
                            if (doc) resolve(doc);
                            reject("error")
                        });
                    },
                    "insert": function (order) {
                        return new Promise((resolve, reject) => {
                            var doc = client.db(dbname).collection(collection).insert(order);
                            if (doc) resolve(doc);
                            reject("error")
                        })
                    }
                });
            });
        })

    }
}