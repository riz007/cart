$(document).ready(function() {
	redrawCart();
	var Arrays=new Array();
	$('.cart-item').submit(function(event){
		event.preventDefault();
	var price =	$(this).find("#price").val();
	var amount =$(this).find("#amount").val();
	var lable = $(this).find("#label").val();
	var id = $(this).find("#id").val();
	addToCart(id,lable,amount,price);
	});

	$('#cartContainer').on('change','#cart-amount', function () {
		var id = $(this).attr("data-id");
		var cartData =getCartData();
		 var newQuantity = $(this).val();
		var result =	$.grep(cartData.items, function(e){ return e.id == id; });
		var everythingElse =	$.grep(cartData.items, function(e){ return e.id != id; });
		result[0].quantity  = newQuantity;
		cartData.items = everythingElse;
		cartData.items.push(result[0]);
		setCartDate(cartData);
	});
	$("#cartContainer").on('click','#remove-cart-item',function(){
		var id = $(this).attr("data-id");
		removeFromCart(id);
	});
	$('#cartContainer').on('click','#cart-checkout',function(event){
    	event.preventDefault();
    	var newForm = $('<form>', {
       	 	'action': 'https://www.paypal.com/cgi-bin/webscr',
       	 	'method': 'post'
    	});
		newForm = addHiddenInput(newForm,"cmd","_cart");
		newForm = addHiddenInput(newForm,"upload","1");
		newForm = addHiddenInput(newForm,"business","youremail@mail.com");
		newForm = addHiddenInput(newForm,"currency_code","US");
		var cartData =	getCartData();
		console.log(cartData);
		var index = 1;
		cartData.items.forEach(function(element) {
			newForm = addHiddenInput(newForm,'item_name_'+index,element.label);
			newForm = addHiddenInput(newForm,'amount_'+index,element.amount);
			newForm = addHiddenInput(newForm,'quantity_'+index,element.quantity);
			index +=1;
		}, this);
    	newForm.submit();
	});
	
});
function addHiddenInput(target,name, value){
	return target.append($('<input>',{
		'type' : 'hidden',
		'name' : name,
		'value' : value
	}));
};
function addToCart(id,item,quantity,amount){
	var cartData =	getCartData();
	if(!cartData)
	{
		cartData = {
			items : []
		};
	}
	var result = $.grep(cartData.items, function(e){ return e.id == id; });
		
	if(result.length == 0){// not found
		console.log("no id found");
		cartData.items.push({
			id : id,
			label : item,
			quantity : quantity,
			amount : amount
		});
	} 
	else{ // found update data
		var everythingElse =	$.grep(cartData.items, function(e){ return e.id != id; });
		result[0].quantity = +result[0].quantity +  +quantity;
		cartData.items = everythingElse;
		cartData.items.push(result[0]);
	}
	setCartDate(cartData);
	redrawCart();
};
function redrawCart(){
	var container = $("#cartContainer")
	container.empty();
		var cartData =	getCartData();
		if(cartData){
			cartData.items.sort(function(a,b){
				var aName = a.label.toLowerCase();
  				var bName = b.label.toLowerCase(); 
  				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			});
			cartData.items.forEach(function(element) {
			var cartItem = '<div><input id="cart-amount" type="number" value="'+element.quantity +'" data-id="'+ element.id +'"/>'
				+ element.label 
				+'<button id="remove-cart-item" data-id="'+ element.id +'">remove</button></div>';
			container.append(cartItem);
		}, this);
		}
	container.append('<button id="cart-checkout">Checkout</button>');
};
function removeFromCart(id){

	var cartData =	getCartData();
	var everythingElse =	$.grep(cartData.items, function(e){ return e.id != id; });
	cartData.items = everythingElse;
	setCartDate(cartData);
	redrawCart();
};
function getCartData(){
	return 	JSON.parse(localStorage.getItem("cartContainer"));
};
function setCartDate(cartData){
	localStorage.setItem("cartContainer",JSON.stringify(cartData));
};