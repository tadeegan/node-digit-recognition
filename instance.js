function dot_product(vectora, vectorb){
    var dot = 0;
    for(var i = 0; i < vectora.length; i++){
        dot = dot + vectora[i] * vectorb[i];
    }
    return dot;
}
function angle(vectora, vectorb){
    var dot = dot_product(vectora, vectorb);
    return Math.acos(dot/(length(vectora)*length(vectorb)));
}
function length(vector){
    var sum = 0;
    for(var i = 0; i < vector.length; i++){
        var f = vector[i];
        sum = sum + f*f;
    }
    return Math.sqrt(sum);
}

var Instance = function(){
    this.classification = -1;
    this.features = [];

    this.distance_to = function(instance){
        if(this.features.length != instance.features.length) {
            console.log("Something went wrong " + this.features.length + " " + instance.features.length);
            return;
        }
        return angle(instance.features, this.features);
    }
}

exports.instance = Instance;