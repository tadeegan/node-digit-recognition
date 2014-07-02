var png = require('png');
var fs = require('fs');
var Instance = require('./instance').instance;
console.log(Instance);
var linereader = require('line-reader');

var training_file = 'data/'
var instances = [];

var k = 10;
var fraction_training = 0.1;

exports.load = function(done){
    console.log("got here");
    var firstLine = true;
    linereader.eachLine("./data/train.csv", function(line, last){
        if(firstLine) {
            firstLine = false;
            return true;
        }
        var string_components = line.split(",");
        var components = string_components.map(function(string){return parseInt(string)});
        var temp_instance = new Instance();
        temp_instance.classification = components[0];
        temp_instance.features = components.slice(1,components.length);
        instances.push(temp_instance);
    }).then(function(){
        console.log(instances.length + " instances parsed");
        exports.instances = instances;
        done();
    });
}

exports.test = function(){
    var num_to_test = 100;
    var num_correct = 0;
    for(var i = 0; i < num_to_test; i++){
        var instance = instances[instances.length - 1 - i];
        var classification = exports.classify(instance.features);
        console.log(classification + " ~> " + instance.classification);
        if(classification == instance.classification) num_correct++;
    }
    console.log(num_correct/num_to_test);
}

exports.classify = function(pixels, num_samples) {
    var percent = num_samples ? num_samples/instances.length : fraction_training;
    var instance = new Instance();
    instance.features = pixels;
    var num_training = instances.length * percent;
    var training = instances.slice(0,num_training);
    var sorted = training.sort(function(a,b){
        return instance.distance_to(a) - instance.distance_to(b);
    });
    var votes = {};
    //set all votes to 0
    for(var i = 0; i < 10; i++){
        var classification = sorted[i].classification;
        votes[classification] = votes[classification] + 1 || 1;
    }
    var best_classification = -1;
    var top_votes = 0;
    for(var classification in votes){
        if(votes[classification] > top_votes){
            top_votes = votes[classification];
            best_classification = classification;
        }
    }
    return best_classification;
}