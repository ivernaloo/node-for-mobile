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

                    // Verify acces rights
                    getTokenById(postJSON.token, function(err, token){
                        authenticator.tokenOwnerHasRole(token, 'PRODUCER',
                            function(err, result){
                                if (result){
                                    insertProduct(postJSON, req, res);
                                } else {
                                    res.writeHead(403, {"Content-Type" : "application/json"});
                                    res.end({
                                        error: "Authentication failure",
                                        message: "You do not have permission to perform that action"
                                    })
                                }
                            }
                        );
                        insertProduct(postJSON, req, res);
                    });

                })
            }
            break;
        case 'api/users/register':
            if (req.method === 'POST'){
                var body = "";
                req.on('data', function(dataChunk){
                    body += dataChunk;
                });
                req.on('end', function(){
                    // Done pulling data from the POST body.
                    // Turn it into JSON and proceed to store.
                    // 这个拿到的是POST的文件体
                    var postJSON = JSON.parse(body);

                    // validate theat the required fields exist
                    // 验证有所有必须的参数
                    if (postJSON.email
                    && postJSON.password
                    && postJSON.firstName
                    && postJSON.lastName){
                        insertUser(postJSON, req, res);
                    } else {
                        res.end('All mandatory fields must be provided');
                    }
                });
            }
            break;
        case 'api/users/login':
            if(req.method === 'POST'){
                var body = "";
                req.on('data', function(dataChunk){
                    body6 += dataChunk;
                });
                req.on('end', function(){

                    var postJSON = JSON.parse(body);

                    // make sure that email and password have been provided
                    if (postJSON.email && postJSON.password){
                        findUserByEmail(postJSON.email, function(err, user){
                            if (err){
                                res.writeHead(404, {"Content-Type": "application/json"});
                                res.end({
                                    error: "User not found",
                                    message: "No user found for the specified email"
                                });
                            } else {
                                // Authenticate the user
                                authenicator.authenticate(
                                    user, postJSON.password, function(err, token){
                                        if (err) {
                                            res.end({
                                                error: "Authentication failure",
                                                message: "User email and password do not match"
                                            });
                                        } else {
                                            res.writeHead(200, {"Content-Type" : "application/json"});
                                            res.end(JSON.stringify(token));
                                        }
                                    }
                                )
                            }
                        })
                    } else {
                        res.end("All mandatory fields must be provided");
                    }
                });
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
 // wrap the insert method
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

var insertUser = function(user, req, res){
    insertResource('OrderBase', 'User', user, function(err, result){
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify(result));
    })
};
var findResourceById = function(resourceName, id, req, res){
    database.find('OrderBase', resourceName, {'_id':id}, function(err, resource){
        res.writeHead(200, {'Content-type': "application/json"});
        res.end(JSON.stringify(resource));
    })
};

var findUserByEmail = function(email, callback){
    database.find('OrderBase', 'User', {email: email}, function(err, user){
        if (err){
            callback(err, null);
        } else {
            callback(null, user);
        }
    })
}
var findAllProducts = function(req, res){
    findALlResources('Products', req, res);
};

var findProductById = function(id, req, res){
    findResourceById('Products', id, req,res);
}

server.listen(8080);

console.log('up, running and ready for action!');