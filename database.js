// Our Primary interface for the MongoDB instance
// import the db driver for the mongoDB
var MongoClient = require('mongodb').MongoClient;

// Used in order to verify correct return values
var assert = require('assert');

/*
* @param databaseName - name of the database we are connecting to
* @param callBack - callback to execute when connection finishes
* */
var connect = function (databaseName, callback){

    // URL to the MongoDB instance we are connecting to
    var url = 'mongodb://192.168.99.100:32770/' + databaseName;

    // Connect to our MongoDB instance, retrieve the selected
    // database, and execute a callback on it.
    MongoClient.connect(url, function(error, database){

        // Make sure that no error was thrown
        assert.equal(null, error);

        console.log("Successfully connected to MongoDB instance!");

        callback(database); // 这里把回调函数传入的
    });
};

/*
 * Executes the find() method of the target collection in the
 * target database, optionally with a query
 * @param databaseName - name of the database
 * @params collectionName - name of the collection
 * @param query - optional query parameters for find()
 * */
exports.find = function (databaseName, collectionName, query){
    /*
    * databaseName pass the parameters to the function
    * */
    connect(databaseName, function(database){ // connect to the database

        // The collection we want to find documents from
        // database come from the callback
        var collection = database.collection(collectionName);

        // Search the given collection in the give database for
        // all documetns which match the criteria, convert them to
        // an array, and findally execute a callback on them.
        collection.find(query).toArray(
            // Callback method
            function (err, documents){

                // make sure nothing went wrong
                assert.equal(err, null);

                // Print all the documents that we found, if any
                console.log("MongoDB returned the following documents:");
                console.dir(documents);

                // Close the database connectoion to free resources
                data.close();
            }
        )
    })
}