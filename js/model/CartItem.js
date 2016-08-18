function CartItem(obj){
	this.id = "";
	this.label = "";
	this.quantity=0;
	this.prices = [];
	this.options=[];
	for (var prop in obj) {
		if(prop == "prices")
		{
			for(var price in obj[prop]){
				if(isInt(price)){
					var priceObject = new Price(obj[prop][price]);
					this.prices.push(priceObject);
				}
			}
		}
		else{
			this[prop] = obj[prop];
		}
	}

	CartItem.prototype.addPrice = function (price){
		this.prices.push(price);
	};
	CartItem.prototype.addOption = function(option){
		this.options.push(option);
	};
	CartItem.prototype.getPrice= function(){
		var options = []
        this.options.forEach(function(element) {
            options.push(element.id);
        }, this);
		var matchingPrices = jQuery.grep(this.prices, function(e){ return e.options.sort().compare(options.sort()); });
		var bestMatch;
		for(var i =0 ; i <matchingPrices.length;i++){
			var currentPrice = matchingPrices[i];
			if(currentPrice.quantity<=this.quantity){
				if(!bestMatch){
					bestMatch = currentPrice;
				}
				else
				{
					if(bestMatch.quantity < currentPrice.quantity){
						bestMatch = currentPrice;
					}
				}
			}
		}
		return bestMatch;
	};
};