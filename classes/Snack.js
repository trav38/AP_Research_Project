class Snack {
    constructor(id, name, price)  {
        this.id = id || 0;
	    this.name= name || " ";
	    this.price = price || 0.0;
    }
    set setName(name){
        this.name = name;
    }
    get getName(){
        return this.name;
    }

}
module.exports = Snack;