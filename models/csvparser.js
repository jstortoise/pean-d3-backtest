const readline = require('readline');
const fs = require('fs');

// const rl = readline.createInterface({
//   input: fs.createReadStream('uploads/file-1496424034286.csv')
// });

// rl.on('line', function (line) {
//   console.log('Line from file:', line);
// });

module.exports.parseCSV = function(filepath, callback){
    var rl = readline.createInterface({
		  input: fs.createReadStream(filepath)
		});

    var result = [];
    var nCount = 0;
    var nFocus = 0;
    var nStartPrice = 0;
		rl.on('line', function (line) {
			if (nFocus > 0) {
				var splits = line.split(",");
				var unit;
				
				if (nCount == 0) {
					unit = {
						date: splits[0],
						time: splits[1],
						price: parseFloat(splits[18].substring(1)),
						return: parseFloat(splits[18].substring(1)),
						pl: parseFloat("0.0")//splits[6]
					};
					nStartPrice = parseFloat(splits[18].substring(1));
					result[nCount++] = unit;
				} else {
					if (splits[6].length > 0 && splits[6] != "0") {
						nStartPrice = nStartPrice * (1 + parseFloat(splits[6]) / 100);
						unit = {
							date: splits[0],
							time: splits[1],
							price: parseFloat(splits[18].substring(1)),
							return: nStartPrice,
							pl: parseFloat(splits[6])
						};
						result[nCount++] = unit;
					}
				}
			}
			nFocus++;
		});

		rl.on('close', function() {
			var json = {result: result};
			// console.log(JSON.stringify(json));
			// console.log(nCount);
			callback(true, JSON.stringify(json));
		});
};