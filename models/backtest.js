const pgpool = require('../config/database.js');

module.exports.addBackTest = function(uploadid, userid, result, callback){
    pgpool.query("INSERT INTO backtests(uploadid, userid, result) values($1, $2, $3)", [uploadid, userid, result], function(err, msg) {

        if (err) {
            console.log(err);
            callback(false, 'Failed to add backtest info');
        } else {
            callback(true, 'Backtest info added');
        }
    });
};

module.exports.getBacktestsByUserid = function(userid, callback) {
		pgpool.query("SELECT id FROM backtests WHERE userid=$1", [userid], function(err, result) {
				if (err) {
						console.log(err);
						callback(false, 'Failed to get all backtests by userid=' + userid);
				} else {
						callback(true, result.rows);
				}
		})
};

module.exports.getBacktestById = function(backtestId, callback) {
		pgpool.query("SELECT result FROM backtests WHERE id=$1", [backtestId], function(err, result) {
				if (err) {
						console.log(err);
						callback(false, 'Failed to get backtest by id=' + backtestId);
				} else {
						if (result.rows.length > 0) {
							callback(true, result.rows[0]);
						} else {
							callback(true, null);
						}
				}
		})
};