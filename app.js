var express= require('express'),
    path = require('path'),
    exphbs= require('express-handlebars');
    bodyParser=require('body-parser'),
    nodemailer=require('nodemailer');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,result){

});

var routes=require('./routes/index');
var doctors=require('./routes/doctors');
var categories=require('./routes/categories');

var app=express();

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'main',partialsDir:'views/partials'}));
app.set('view engine','handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

var query = "SELECT * FROM findadoc.categories";
client.execute(query,[],function(err,results){
  if(err){
    res.status(404).send({msg:err});
  }else{
    app.locals.cats=results.rows;
  }
});

app.use('/',routes);
app.use('/doctors',doctors);
app.use('/categories',categories);

app.set('port',(process.env.PORT || 3000));



app.listen(app.get('port'),function(){
  console.log("Server is  Running on port :"+app.get('port'));
});
