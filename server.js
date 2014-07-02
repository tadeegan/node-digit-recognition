var express = require('express');
var app = express();
var classifier = require('./classifier');
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// ----------------------

// #Session stuff:
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
//app.use(express.bodyParser());

app.get('/', function(req, res){
    res.render('index');
});

app.post('/classify', function(req, res){
    //console.log(req.body.pixels);
    var pixels = req.body.pixels;
    var num_samples = req.body.samples;
    var numbers = pixels.map(function(a){
        return parseInt(a);
    });
    console.log(numbers.length);
    res.send(classifier.classify(numbers, num_samples));
});


classifier.load(function(){
    console.log("done parsing");
    app.listen(3000);
    //classifier.test();
});