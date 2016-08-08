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
   	console.log($(this).val());
	});
	$('#cart-checkout').click(function(event){
    	event.preventDefault();
    	var newForm = $('<form>', {
       	 	'action': 'https://www.paypal.com/cgi-bin/webscr',
       	 	'method': 'post'
    	});
		newForm = addHiddenInput(newForm,"cmd","_cart");
		newForm = addHiddenInput(newForm,"upload","1");
		newForm = addHiddenInput(newForm,"business","youremail@mail.com");
		newForm = addHiddenInput(newForm,"currency_code","US");
		var cartData =	JSON.parse(localStorage.getItem("cartContainer"));
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
function addToCart(id,item,amount,price){
	var container = $("#cartContainer")
	var cartItem = $("#cartContainer").find("#"+id);
	console.log(cartItem)
	if(cartItem.length!=0)
	{
		console.log("found container");
		removeFromCart(id);
	}
	else
	{
		
		console.log("did not find container");
		var newItem = '<div id="' + id + '"><input id="cart-amount" type="number" value="'+amount+'"/>: '+ item +'<button id="remove-cart-item">remove</button></div>';
		$("#cartContainer").prepend(newItem);
		var cartData =	jQuery.data('#cartContainer','cartData');
		
		if(!cartData){
			cartData = {
				items : []
			}
		}
		console.log(cartData);

		var result = $.grep(cartData.items, function(e){ return e.id == id; });
		
		if(result.length == 0){// not found
			console.log("no id found");
			cartData.items.push({
				id : id,
				label : item,
				quantity : amount,
				amount : price
			});
		} 
		else{ // found update data
			result[0].amount+=amount;

		}
		localStorage.setItem("cartContainer",JSON.stringify(cartData));
	}
	
};
function redrawCart(){
	var container = $("#cartContainer")
	container.empty();
		var cartData =	JSON.parse(localStorage.getItem("cartContainer"));
		cartData.items.forEach(function(element) {
			var cartItem = '<div id="' + id + '"><input id="cart-amount" type="number" value="'+element.quantity+'"/>: '+ element.label +'<button id="remove-cart-item">remove</button></div>';
			container.append(cartItem);
		}, this);
	container.append('<button id="cart-checkout">Checkout</button>');
}
function storeData(cartItem){
	
}
function removeFromCart(id){
	var container = $("#cartContainer").find("#"+id);
	$(container).remove();
}
function CartItem(id,label,amount,quantity){
	this.id=id;
	this.quantity=quantity;
	this.label=label;
	this.amount=amount;
};