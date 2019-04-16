const Snack = require('./Snack');
var objectFactory = function(){
    console.log("received a new factory request.")
    return new createObjects();
}

var createObjects = function() {
    console.log("received a request to create new object.");
    this.localObject = {};
};

createObjects.prototype.snack = function(name, price, id){
    //this.localObject.name = name;
    //this.localObject.price = price;
    //this.localObject.id = id;
    return new Snack(name, price, id);//this.localObject;
};


module.exports.objectFactory = objectFactory;