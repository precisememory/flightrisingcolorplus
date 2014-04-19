$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
  
  if(!checkForStorage()){
	$('#storage').modal('show');
  } else if(!checkForDragons()){
	$('#firstrun').modal('show');
  } else { //load dragons
  
  }
  
});

function checkForStorage(){
	if(localStorage)
		return true;
	else return false;
}

function checkForDragons(){
	if(checkForStorage() && localStorage.getItem('frcolorplus'))
		return true;
	else return false;
}