function Price(obj){
	this.amount = 0;
	this.quantity = 1;
	this.options = [];
	Price.prototype.addOption = function(option){
		this.options.push(option);
	}
	for (var prop in obj) {
		this[prop] = obj[prop];
	}
};