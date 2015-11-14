var mongodb = require('mongodb');
//url='mongodb://username:password@ds045704.mongolab.com:45704/cmpe295b_siemt';
var db;

function createUser(callback, userfirstname, userlastname, username, email,
		password, userprofile) {
	console.log('inserting into mongodb');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('user', function(err, collection) {
					doc = {
						"FirstName" : userfirstname,
						"LastName" : userlastname,
						"userName" : username,
						"Email" : email,
						"password" : password,
						"userprofile" : userprofile
					}
					collection.insert(doc, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
							console.log('inserted');
						}
						db.close();
					});
				});
			}
		});
	});
}

function checkUser(callback, username, passwd) {
	console.log('authenticating user');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				var collec = db.collection('user');
				console.log("username  " + username + "  " + "passwd   "
						+ passwd);
				var cursor = collec.find({
					$and : [ {
						"userName" : username
					}, {
						"password" : passwd
					} ]
				});
				//var cursor=collec.find({  "userName": username,"password": passwd }); 
				console.log("cursor length  " + cursor.length);
				cursor.each(function(err, doc) {
					// assert.equal(err, null);
					if (doc != null) {
						console.log(doc);
						callback(null, doc);
					} else {
						callback(null, null);
					}
				});
			}
		});
	});
}

function updatePassword(callback, username, currentpassword, newpassword) {
	console.log("update password");
	var un = username;
	console.log("username  " + username);
	var np = newpassword;
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				console.log("db.collection('user').update( { userName:" + un
						+ "  },{ $set: {password:" + np + "} }");
				db.collection('user').update(
						{
							"userName" : un
						},
						{
							$set : {
								"password" : np
							}
						},
						function(err, results) {
							if (err) {
								throw err;
							} else {
								console.log("set new password   "
										+ JSON.stringify(results));
								callback(null, results);
							}
						});
			}
		});
	});
}

function insertTemp(callback, objectTemp, ambientTemp) {
	console.log('inserting into mongodb');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('temp', function(err, collection) {
					doc = {
						"ObjectTemp" : objectTemp,
						"AmbientTemp" : ambientTemp,
						"timeStamp" : new Date()
					}
					collection.insert(doc, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
							console.log('inserted');
						}
						db.close();
					});
				});
			}
		});
	});
}

function insertHumd(callback, temperature, humidity) {
	console.log('inserting into mongodb');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('humidity', function(err, collection) {
					doc = {
						"Temperature" : temperature,
						"Humidity" : humidity,
						"timeStamp" : new Date()
					}
					collection.insert(doc, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
							console.log('inserted');
						}
						db.close();
					});
				});
			}
		});
	});
}

function insertPress(callback, pressure) {
	console.log('inserting into mongodb');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('pressure', function(err, collection) {
					doc = {
						"Pressure" : pressure,
						"timeStamp" : new Date()
					}
					collection.insert(doc, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
							console.log('inserted');
						}
						db.close();
					});
				});
			}
		});
	});
}

function ruleEngine(callback, rulename, parameter, criteria, value, action) {
	console.log('rule Engine');
	db = new mongodb.Db('cmpe295b_siemt', new mongodb.Server(
			'ds045704.mongolab.com', 45704, {
				auto_reconnect : true
			}), {});
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('rules', function(err, collection) {
					doc = {
						"Rule Name" : rulename,
						"Attribute" : parameter,
						"Condition" : criteria,
						"Value" : value,
						"Action" : action
					}
					collection.insert(doc, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
							console.log('inserted rule');
						}
						db.close();
					});
				});
			}
		});
	});
}

//db.collection('user').findAndModify({ 'userName': username },
//{$set: { "password": newpassword } },
function fetchTempChart(callback, chartname) {
	console.log("i am here mongo");
	db = new mongodb.Db('cmpe295', new mongodb.Server('ds031982.mongolab.com',
			31982, {
				auto_reconnect : true
			}), {});
	db.open(function(err, p_client) {
		db.authenticate('cmpe295', 'cmpe295', function(err) {
			if (err)
				throw err;
			else {
				var collec = db.collection('attributes');
				collec.findOne({
					"name" : chartname
				}, function(err, recs) {
					if (err) {
						throw err;
					} else {
						if (recs.length != 0) {
							console.log("insde find method");
							console.log(recs);
							callback(err, recs);
						} else {
							callback(err, null);
						}
					}
				});
			}
		});
	});
}

function alertTemp(callback, chartname, condi, adata) {
	console.log("i am here mongo");
	db = new mongodb.Db('cmpe295', new mongodb.Server('ds031982.mongolab.com',
			31982, {
				auto_reconnect : true
			}), {});
	db.open(function(err, p_client) {
		db.authenticate('cmpe295', 'cmpe295', function(err) {
			if (err)
				throw err;
			else {
				var collec = db.collection('attributes');
				console.log("chartname" + chartname + "condi" + condi + "data"
						+ adata);
				//				 var suvqry="{"+condi+":"+adata+"}";
				//				 var subq=JSON.parse(JSON.stringify(suvqry));
				//				 var sq=subq.replace("\'", "");
				//				 console.log(sq);
				if (condi == "$gte") {
					console.log("inside GTE");
					console.log(adata);
					var numval = parseInt(adata);
					var qury = {
						$and : [ {
							"name" : chartname,
							"data_temp.temp_value" : {
								$gte : numval
							}
						} ]
					};
					console.log(qury);
					collec.findOne(qury, function(err, recs) {
						if (err) {
							throw err;
						} else {
							if (recs) {
								console.log("insde find method");
								console.log(recs);
								callback(err, recs);
							}

							else {
								//  callback(err,"rule not met");
								console.log("rule not met");
							}

						}
					});
				} else if (condi == "$gt") {
					console.log("inside GT");
					console.log(adata);
					var numval = parseInt(adata);
					var qury = {
						$and : [ {
							"name" : chartname,
							"data_temp.temp_value" : {
								$gt : numval
							}
						} ]
					};
					console.log(qury);
					collec.findOne(qury, function(err, recs) {
						if (err) {
							throw err;
						} else {
							if (recs) {
								console.log("insde find method");
								console.log(recs);
								callback(err, recs);
							}

							else {
								//						//   callback(err,null);
								console.log("something is wrng");
							}

						}
					});
				} else if (condi == "$lt") {
					console.log("inside LT");
					console.log(adata);
					var numval = parseInt(adata);
					var qury = {
						$and : [ {
							"name" : chartname,
							"data_temp.temp_value" : {
								$lt : numval
							}
						} ]
					};
					console.log(qury);
					collec.findOne(qury, function(err, recs) {
						if (err) {
							throw err;
						} else {
							if (recs) {
								console.log("insde find method");
								console.log(recs);
								callback(err, recs);
							}

							else {
								//						//   callback(err,null);
								console.log("something is wrng");
							}

						}
					});
				} else if (condi == "$lte") {
					console.log("inside LTE");
					console.log(adata);
					var numval = parseInt(adata);
					var qury = {
						$and : [ {
							"name" : chartname,
							"data_temp.temp_value" : {
								$lte : numval
							}
						} ]
					};
					console.log(qury);
					collec.findOne(qury, function(err, recs) {
						if (err) {
							throw err;
						} else {
							if (recs) {
								console.log("insde find method");
								console.log(recs);
								callback(err, recs);
							}

							else {
								//						//   callback(err,null);
								console.log("something is wrng");
							}

						}
					});
				}
			}
		});

	});
}

function fetchHumidityCharts(callback, chartname) {
	console.log("i am here mongo");
	db = new mongodb.Db('cmpe295', new mongodb.Server('ds031982.mongolab.com',
			31982, {
				auto_reconnect : true
			}), {});
	db.open(function(err, p_client) {
		db.authenticate('cmpe295', 'cmpe295', function(err) {
			if (err)
				throw err;
			else {
				var collec = db.collection('attributes');
				collec.findOne({
					"name" : chartname
				}, function(err, recs) {
					if (err) {
						throw err;
					} else {
						if (recs.length != 0) {
							console.log("insde find method");
							console.log(recs);
							callback(err, recs);

						} else {
							callback(err, null);
						}
					}
				});
			}
		});
	});
}

exports.fetchTempChart = fetchTempChart;
exports.fetchHumidityCharts = fetchHumidityCharts;
exports.alertTemp = alertTemp;
exports.createUser = createUser;
exports.checkUser = checkUser;
exports.updatePassword = updatePassword;
exports.insertTemp = insertTemp;
exports.insertHumd = insertHumd;
exports.insertPress = insertPress;