const pgpool = require('../config/database.js');

module.exports.addFileInfo = function(filename, filesize, userid, callback){
    pgpool.query("INSERT INTO uploads(filename, filesize, userid) values($1, $2, $3)", [filename, filesize, userid], function(err, result) {
        if (err) {
            console.log(err);
            callback(false, 'Failed to add file info');
        } else {
            callback(true, 'File info added');
        }
    });
};

module.exports.getId = function(filename, userid, callback) {
    pgpool.query("SELECT * FROM uploads WHERE filename='" + filename + "' AND userid=$1", [userid], function(err, result) {
        if (err) {
            console.log(err);
            callback(false, null);
        } else {
            
            if (result.rows.length > 0) {
                callback(true, result.rows[0].id);
            } else {
                callback(false, null);
            }
        }
    });
}