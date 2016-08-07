$(document).ready(function() {
	
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

	
});
function addToCart(id,item,amount,price){

	var container = $("#cartContainer").find("#"+id);
	console.log(container)
	if(container.length!=0)
	{
		console.log("found container");

	}
	else
	{
		console.log("did not find container");
		var newItem = '<div id="' + id + '"><input id="cart-amount" type="number" value="'+amount+'"/>: '+ item +'</div>';
		$("#cartContainer").prepend(newItem);

	}
	
};
