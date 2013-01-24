/* **************************************************************** 
 *
 *  Description : Current weather conditions
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2013
 *
 ****************************************************************** */

var sqlite3 = require('sqlite3');

var month = new Array(12);
month[0] = "01";
month[1] = "02";
month[2] = "03";
month[3] = "04";
month[4] = "05";
month[5] = "06";
month[6] = "07";
month[7] = "08";
month[8] = "09";
month[9] = "10";
month[10] = "11";
month[11] = "12";
 
exports.summary = function (req, res, next){
    
    var date = new Date();
    var current_year = date.getFullYear();
    var current_month = date.getMonth();
    var db = new sqlite3.Database('weather-' + current_year + '-' + month[current_month] + '.db' , sqlite3.OPEN_READONLY);
    
    db.serialize(function() {
        db.get('select * from history order by history desc limit 1', function (err, result){

	    var answer = result;

	    db.all('select sensor, value from temperature where date = ?', [answer.date], function(err, result){

                answer.temperature = result;

                db.all('select sensor, value from humidity where date = ?', [answer.date], function(err, result){

                    answer.humidity = result;

                    db.all('select sensor, value from dewpoint where date = ?', [answer.date], function(err, result){

                        answer.dewpoint = result;

                        db.all('select sensor, value from smiley where date = ?', [answer.date], function(err, result){

                            answer.smiley = result;

                            db.all('select sensor, value from trend where date = ?', [answer.date], function(err, result){

                                answer.trend = result;

                                res.json({type : "data", body : answer});

                            });

                        });
                    });
                });
            });
        });
    });
}

