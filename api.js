var database = require('./database');
var http = require('http');

var server = http.createServer(function(req, res){

    // Break down the incoming URL into its components
    var parsedURL = URL.parse(req.URL, true);

    // Determine a response based on the URL
    switch (parsedURL.pathname) {
        case '/api/products':
            // Find and return the rpoduct with the given id
            if (req.method === 'GET') {
                // Find and return the product with the given id
                if(parsedURL.query.id){
                    findProuctyById(id, req, res);
                }
                // There is no id specified, return all products
                else {
                    findAllProducts(req, res);
                }
            }
            else if (req.method === 'POST'){

                // Extract the data stored in hte POST body
                var body = '';
                req.on('data', function(dataChunk){  // get the POST data body from the request
                    body += dataChunk;
                });
                req.on('end', function(){
                    // Done pulling data from the POST body.
                    // Turn it into JSON and proceed to store it in the database
                    var postJSON = JSON.parse(body);
                    insertProduct(postJSON, req, res);
                })
            }
            break;
        default:
            res.end('You shall not pass!');
    }

});

// Generic find methods
function findAllResources(resourceName, req, res){
    database.find('OrderBase', resourceName, {}, function(err, resources){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(JSON.stringify(resources));
    })
}

 // Generic insert/update methods (POST, PUT)
var insertResource = function(resourceName, resource, req, res){
    database.insert('OrderBase', resourceName, resource, function(err, resource){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(resource));
    })
};

// Product methods
var insertProduct = function(product, req, res){
    insertResource('OrderBase', 'Product', product, function(err, result){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    })
};

var findResourceById = function(resourceName, id, req, res){
    database.find('OrderBase', resourceName, {'_id':id}, function(err, resource){
        res.writeHead(200, {'Content-type': "application/json"});
        res.end(JSON.stringify(resource));
    })
};

var findAllProducts = function(req, res){
    findALlResources('Products', req, res);
};

var findProductById = function(id, req, res){
    findResourceById('Products', id, req,res);
}

server.listen(8080);

console.log('up, running and ready for action!');