/**
 * Module dependencies.
 */
var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var port=3000;
var SensorTag = require('sensortag');
var path = require('path');
var fs = require('fs');
var mongo=require('./routes/mongoapi')
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var multer=require('multer');
var nodemailer = require("nodemailer");
var io=require('socket.io');

var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
	user: "chilukuri3@gmail.com",
	pass: "deepthi999"
	}
	});

//all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({ secret : process.env.SESSION_SECRET||'secret',resave:false,saveuninitialized:false}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); 


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get("/",function(req,res){
	res.render('login');
});


app.post("/authenticate",function(req,res){
	var username=req.body.uname;
	var passwd=req.body.youpasswd;
	mongo.checkUser(function(err,result){
		if(err){
			throw err;
		}else{
			if(result==null){
				res.render('login');
			}else{
			console.log("user authenticated   "+result.userName);
			if(result.password=='default'){
				res.render('firstTimeLogin',{"userName":result.userName});
				//todo implement first time login page and update paswerd and redirect him to dashboard
			}else{
			res.render('dashboard',{"userName":result.userName});
			}
			}
		}
	},username,passwd);
});

app.post("/updatePassword",function(req,res){
	console.log("update password");
	var username=req.body.usernamehidden;
	console.log("hidden username  "+username);
	var currentpassword=req.body.currentpassword;
	var newpassword=req.body.newpassword;
	var confirmnewpassword=req.body.confirmnewpassword;
	
	mongo.updatePassword(function(err,result){
		if(err){
			throw err;
		}else{
			console.log('succesfully updated the password');
			res.render('dashboard',{"userName":username});
		}
	},username,currentpassword,newpassword);
});

app.get("/dashboard",function(req,res){
	res.render('dashboard');
});

app.get("/signup",function(req,res){
	res.render('signup');
});

app.post("/signup",function(req,res){
	var userfirstname=req.body.userfirstname;
	var userlastname=req.body.userlastname;
	var username=req.body.username;
	var email=req.body.email;
	var password=req.body.password;
	var userprofile=req.body.userprofile;
	
	mongo.createUser(function(err,result){
		if(err){
			throw err;
		} else{
			console.log('user successfully created'+result);
			res.header("Access-Control-Allow-Origin", "*");	
			res.render('dashboard',{"userName":username});
			var mailOptions={
					to : email,
					subject :"account created for SIEMT",
					text : "Hi"+" "+userfirstname+" "+"please login using userName: "+"   "+username+"   "+"password is default"
					}
					console.log(mailOptions);
					smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
					console.log(error);
					res.end("error");
					}else{
					console.log("Message sent: " + response.message);
					}
					});
			
		}
		
	},userfirstname,userlastname,username,email,password,userprofile);
	
	
});


//don't uncomment it
/*app.get("/", function(req, res){
SensorTag.discover(function(tag) {
		
		tag.on('disconnect', function() {
			console.log('disconnected!');
			process.exit(0);
		});
		
		function connectAndSetUpMe() {			// attempt to connect to the tag
		     console.log('connectAndSetUp');
		     tag.connectAndSetUp(enableDataPoints);		// when you connect, call enableIrTempMe
		   }
		   
			function enableDataPoints(){
				console.log('enabling datapoints');
				tag.enableIrTemperature(notifyMe);
			}	
			
			function notifyMe(){
				console.log("notifying datapoints");
				tag.notifyIrTemperature(listenForReading);
			}
				function  listenForReading(){
					
					tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
					     console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
					     console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
					     function TempChange() {
					       	io.sockets.emit('objTemp', { objTemp: objectTemp });
					        io.sockets.emit('ambTemp', { ambTemp: ambientTemp });
					       };

					       TempChange();
					   });
				}
				
				connectAndSetUpMe();
	});
res.render('index');
});*/
 
//var io = require('socket.io').listen(app.listen(port));
//console.log("Listening on port " + port);

var io = require('socket.io').listen(app.listen(3000,function(){
    console.log("We have started our server on port 3000");
    SensorTag.discover(function(tag) {
		
		tag.on('disconnect', function() {
			console.log('disconnected!');
			process.exit(0);
		});
		
		function connectAndSetUpMe() {			// attempt to connect to the tag
		     console.log('connectAndSetUp');
		     tag.connectAndSetUp(enableDataPoints);		// when you connect, call enableIrTempMe
		   }
		   
			function enableDataPoints(){
				console.log('enabling Temp datapoint');
				tag.enableIrTemperature(notifyMe);
				tag.enableHumidity(notifyHumd);
				tag.enableBarometricPressure(notifyPress);
			}	
			
			function notifyMe(){
				console.log("notifying temp datapoints");
				tag.notifyIrTemperature(listenForReading);
			}
			function notifyHumd(){
				console.log("notifying humd datapoints");
				tag.notifyHumidity(listenForHumdReading);
			}
			function notifyPress(){
				console.log("notify pressure");
				tag.notifyBarometricPressure(listenForPress);
			}
			
			
				function  listenForReading(){
					
					tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
					     console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
					     console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
					     function TempChange() {
					       	io.sockets.emit('objTemp', { objTemp: objectTemp });
					        io.sockets.emit('ambTemp', { ambTemp: ambientTemp });
					       };

					       TempChange();
					   });
				}
				
					function  listenForHumdReading(){
					
						tag.on('humidityChange', function(temperature, humidity){
							console.log('hum Temp = %d ', temperature.toFixed(1));
						     console.log('humidity = %d ', humidity.toFixed(1));
					
					     function HumdChange() {
					       	io.sockets.emit('hum Temp', { humTemp: temperature });
					        io.sockets.emit('humidity', { humidity: humidity });
					       };
					       HumdChange();
					   });
				}
					function  listenForPress(){
						
							tag.on('barometricPressureChange', function(pressure){
							console.log('barooPressu = %d', pressure.toFixed(1));
						
					     function PressChange() {
					       	io.sockets.emit('Pressure', { press: pressure });
					       };
					       PressChange();
					   });
				}
				
				connectAndSetUpMe();

	});
})
);

//io.listen(server);

