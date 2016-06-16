var db = require('./database');

module.exports = {
    database: 'OrderBase',
    collection: 'AccessTokens',
    /*
    * 
    * @param {function} callback这里一个回调函数，用来控制session的。
    * */
    generateToken: function(user, callback){
        var token = {
            userID: user._id
        };

        // Persist and return the token
        // 插入token值?
        // 这个token值怎么能是持久化的
        db.insert(this.database, this.collection, token, function(err, res){
            if (err){
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    },
    authenticate: function(user, password, callback){
        if (user.password === password){
            // Create a new token for the user
            // 每次输入密码的时候验证token
            this.generateToken(user, function (err, res) {
                callback(null, res);
            })
        } else {
            callback({
                error: 'Authentication error',
                message: 'Incorrect username or password'
            }, null);
        }
    },

    tokenOwnerHasRole: function(token, roleName, callback){
        var database = this.database;
        db.find(database, 'User', {_id: token.userID}, function(err, user){
            db.find(database, 'Role', {_id: user.roleID}, funciton(err, role){
                if (err){
                    callback(err, false);
                }
                else if (role.name === roleName){
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            })
        })
    }
};

