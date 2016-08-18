function Basket(obj){
	this.cartItems = [];
	
	for (var prop in obj) {
		if(prop == "cartItems")
		{
			for(var cartItem in obj[prop]){
				if(isInt(cartItem)){
					var cartItemObject = new CartItem(obj[prop][cartItem]);
					this.cartItems.push(cartItemObject);
				}
			}
		}
		else{
			this[prop] = obj[prop];
		}
	}
	Basket.prototype.addCartItem = function(cartObject){
		var notFound = true;
	    for(var index= 0;index < this.cartItems.length; index++)
		{
			var cartItem = this.cartItems[index];
			if(cartItem.id==cartObject.id)
			{
				if(cartItem.options.length>0){
					var optionIds = [];
					cartItem.options.forEach(function(element) {
						optionIds.push(element.id);
					}, this);
					var otherOptionsIds=[];
					cartObject.options.forEach(function(element) {
						otherOptionsIds.push(element.id);
					}, this);
					if(optionIds.sort().compare(otherOptionsIds.sort())){
						this.cartItems[index].quantity = +this.cartItems[index].quantity + +cartObject.quantity;
						notFound = false;
						break;
					}
				}
				else	
				{
					this.cartItems[index].quantity = +this.cartItems[index].quantity + +cartObject.quantity;
					notFound = false;
					break;
				}
			}
		}
		if(notFound){

			this.cartItems.push(cartObject);
		}
	}
	Basket.prototype.updateQuantity= function(cartItemId,cartItemOptions,newQuantity)
	{
		for(var index= 0;index < this.cartItems.length; index++)
		{
			var cartItem = this.cartItems[index];
			if(cartItem.id==cartItemId)
			{
				if(cartItem.options.length>0){
					var optionIds = [];
					cartItem.options.forEach(function(element) {
						optionIds.push(element.id);
					}, this);
					if(optionIds.sort().compare(cartItemOptions.sort())){
						this.cartItems[index].quantity = newQuantity;
						break;
					}
				}
				else	
				{
					this.cartItems[index].quantity = newQuantity;
					break;
				}
			}
		}
	};
	Basket.prototype.removeCartItem = function(cartItemId,cartItemOptions)
	{
			for(var index= 0;index < this.cartItems.length; index++)
		{
			var cartItem = this.cartItems[index];
			if(cartItem.id==cartItemId)
			{
				if(cartItem.options.length>0){
				var optionIds = [];
					cartItem.options.forEach(function(element) {
						optionIds.push(element.id);
					}, this);
				
					if(optionIds.sort().compare(cartItemOptions.sort())){
						this.cartItems.splice(index, 1);
						break;
					}
				}
				else	
				{
					this.cartItems.splice(index, 1);
					break;
				}
			}
		}	
	    
	};
	Basket.prototype.getTotalPrice = function()
	{
		if(this.hasItems()){
			var totalPrice = 0;
			for(var index=0; index<this.cartItems.length;index++){
				var cartItem = this.cartItems[index];
				totalPrice = totalPrice + +cartItem.quantity * +cartItem.getPrice().amount;
			}
			return totalPrice;
		}
		return 0;		
	};
	Basket.prototype.hasItems = function(){
		return this.cartItems.length > 0;
	};
};