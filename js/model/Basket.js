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
	Basket.prototype.addCartItem = function(cartItem){
      
	    var result = $.grep(this.cartItems, function(e){ return e.id == cartItem.id; });
    	if(result.length >= 1)
    	{
	    	var everythingElse = $.grep(this.cartItems, function(e){ return e.id != cartItem.id; });
	    	this.cartItems = everythingElse;
	    	if(cartItem.options.length >= 1)
	    	{
	    		var matchingOptions=false;
	    		for(var i=0; i< result.length;i++)
	    		{
	    			var item = result[i];
	    			if(item.options.sort().compare(cartItem.options.sort())){
	    				item.quantity = +item.quantity +  +cartItem.quantity;
	    				matchingOptions = true;
	    			}
	    				this.cartItems.push(item);
	    		}
	    		if(!matchingOptions){
	    			this.cartItems.push(cartItem);
	    		}
	    	}
	    	else
	    	{
	    		result[0].quantity = +result[0].quantity +  +cartItem.quantity;
	    		this.cartItems.push(result[0]);
	    	}
	    }    
	    else
	    { 
	    	this.cartItems.push(cartItem);
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

					if(cartItem.options.sort().compare(cartItemOptions.sort())){
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

					if(cartItem.options.sort().compare(cartItemOptions.sort())){
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
	    
	}
}