$(document).ready(function() {
	redrawCart();
	var Arrays=new Array();
	$('.cart-item').submit(function(event){
		event.preventDefault();
		var cartItem = new CartItem();
		for(var i=0; i < this.elements.length; i++){
			var element = this.elements[i];
			
			var nameSplit = element.name.split("_");
			var value = element.value;
			if(nameSplit.length>0){

				var currentName = nameSplit[0];
				if(currentName == "id"){
					cartItem.id = value;
				}
				if(currentName == "quantity"){
					cartItem.quantity = value;
				}
				if(currentName == "label"){
					cartItem.label = value;
				}
				if(currentName == "price"){
					cartItem.addPrice(parsePrice(nameSplit,value));
				}
				if(currentName == "option"){
					var option = new SelectOption();
					option.id =	value;
					option.label = element.options[element.selectedIndex].text;
					console.log(option);
					cartItem.options.push(option);
				}
			}
		}
		var basket = getBasket();
		basket.addCartItem(cartItem);
		setBasket(basket);
	});
	$('#cartContainer').on('change','#cart-amount', function () {
		var id = $(this).parent("#cart-item-container").attr("data-id");
		var options = $(this).parent("#cart-item-container").attr("data-options").split(" ");
		var cartData =getBasket();
		var newQuantity = $(this).val();
		if(newQuantity<=0)
		{
		 	cartData.removeCartItem(id,options);
		}
		else
		{
			cartData.updateQuantity(id,options,newQuantity);
		}
		setBasket(cartData);
	});
	$("#cartContainer").on('click','#remove-cart-item',function(){
		var id = $(this).parent("#cart-item-container").attr("data-id");
		var options = $(this).parent("#cart-item-container").attr("data-options").split(" ");
		var cartData =getBasket();
		cartData.removeCartItem(id,options);
		setBasket(cartData);
	});
	$('#cartContainer').on('click','#cart-checkout',function(event){
    	event.preventDefault();
		var cartData =	getBasket();
		if(cartData.hasItems()){

			var newForm = $('<form>', {
				'action': 'https://www.paypal.com/cgi-bin/webscr',
				'method': 'post'
			});
			var email = $('input:hidden[name=business-email]').val();
			var currency = $('input:hidden[name=business-currency]').val();
			console.log(email);
			console.log(currency);
			newForm = addHiddenInput(newForm,"cmd","_cart");
			newForm = addHiddenInput(newForm,"upload","1");
			newForm = addHiddenInput(newForm,"business",email);
			newForm = addHiddenInput(newForm,"currency_code",currency);
			var index = 1;
			cartData.cartItems.forEach(function(element) {
				var label = element.label;
				if(element.options.length>0)
				{
					var first = true;
					for(var i= 0;i<element.options.length;i++){
						var selectOptions = element.options[i];
						label+= ' - ' + selectOptions.label;
					}
				}
				newForm = addHiddenInput(newForm,'item_name_'+index,label);
				newForm = addHiddenInput(newForm,'amount_'+index,element.getPrice().amount);
				newForm = addHiddenInput(newForm,'quantity_'+index,element.quantity);
				index +=1;
			}, this);
			newForm.submit();
		}
	});	
});
function addHiddenInput(target,name, value){
	return target.append($('<input>',{
		'type' : 'hidden',
		'name' : name,
		'value' : value
	}));
};

function redrawCart(){
	var container = $("#cartContainer")
	container.empty();
	var cartData =	getBasket();
	if(cartData.hasItems()){
		cartData.cartItems.sort(function(a,b){
			var aName = a.label.toLowerCase();
  			var bName = b.label.toLowerCase(); 
  			return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
		});
		cartData.cartItems.forEach(function(element) {
			var price = element.getPrice();
			var label = element.label;
			var options = "";
			if(element.options.length>0)
			{
				var first = true;
				for(var i= 0;i<element.options.length;i++){
					var selectOptions = element.options[i];
					label+= ' - ' + selectOptions.label;
					if(first){
						first = false;
						options = selectOptions.id;
					}
					else
					{
						open+= ' ' +selectOptions.id;
					}
				}
			}

			var cartItem = '<div id="cart-item-container" data-id="'+ element.id +'" data-options="'+ options +'"><input id="cart-amount" type="number" value="'+element.quantity +'"/><div>'
			+ label +'</div><div class=cart-price">'+ element.quantity+'x '+ price.amount+'</div><div class"cart-price-total">' + +element.quantity * +price.amount
			+'</div><button id="remove-cart-item">remove</button></div>';
		container.append(cartItem);
	}, this);
	}
		var basketTotal = '<div id="basket-total">Total: ' + cartData.getTotalPrice() + '</div>';
		container.append(basketTotal);
		container.append('<button id="cart-checkout">Checkout</button>');
};
function getBasket(){
	var untypedObjects= JSON.parse(localStorage.getItem("junglecoder-basket"));
	if(untypedObjects)
		return new Basket(untypedObjects);
	return new Basket();
};
function setBasket(basket){
	localStorage.setItem("junglecoder-basket",JSON.stringify(basket));
	redrawCart();
};



function parsePrice(priceNames,amount){
	var price = new Price();
	price.amount=amount;
	for(var i=0; i < priceNames.length; i++){
		var name = priceNames[i];
		if(name=="option"){
			i++;
			var option = priceNames[i];
			price.addOption(option);
		}
		if(name == 'quantity'){
			i++;
			var quantity = priceNames[i];
			price.quantity = quantity;
		}
	}
	return price;
};
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { //To test values in nested arrays
            if (!this[i].compare(testArr[i])) return false;
        }
        else if (this[i] !== testArr[i]) return false;
    }
    return true;
}

function isInt(n) {
   return n % 1 === 0;
}