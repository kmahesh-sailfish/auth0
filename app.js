
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var jwt = require('express-jwt');
var cors = require('cors');
var http = require('http');
var mysql = require('mysql');



var pool=mysql.createPool({
    host:'g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user:'aijbfeiq5kmvkzlw',
    password:'bp7cx96zdg8lvzhz',
    database:'cvs13rho3vyr63do',
    ConnectionLimit:20
});
var app = express();

app.use(cors());
// setting the view enginee
app.set('views', path.join(__dirname, 'views'));


app.use(cookieParser());
dotenv.load();



app.use(function(req,res,next){
    //website you wish to allow to connect
    res.setHeader('Accesss-Control-Allow-Orign','*');

    // request methods you wist to allow
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,OPTIONS,DELETE');

    //request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');

    res.setHeader('Access-Control-Expose-Headers', 'Authorization, header-a');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// midddle ware loaded
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var authenticate = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
});

// routes
//generated Api calling in this resigion

 userRouter = require('./routes/users')(pool);

app.get('/',function(req,res){
    res.send('welcome to Api exprees..');

});
app.get('/admin',function(req,res){
    pool.query("select* from usertypes",function(err,rows,fields){
        if(!err){
            res.send(rows[0]);
        }
        else
        {
            console.log('Error while performing Query');
        }
    });

});


app.use('/api',authenticate);
app.use('/api/Alluser',userRouter);

app.use(redirectUnmatched);

function redirectUnmatched(req,res){
    console.log("No route matched - redirctUnmatched");
    res.status(404).send('404 Error :No Rows Found');

}

//catch 404 and forward to error handler
app.use( function(req,res,next){
    var err =new Error('Not Found');
    err.status=404;
    next(err);
})

//pool connection in mysql in cloud jasw db
/*var connection = mysql.createConnection({
    connectionLimit :20,
    host:'localhost',
    user:'root',
    password:'Rubhu@111213',
    database:'test'
});
connection.connect();*/



var port = process.env.PORT || 3100;

http.createServer(app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
});



module.exports = app;

