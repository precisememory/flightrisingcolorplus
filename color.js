$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
  
  $('#file-add-btn').click(fileAdd);
  $('#file-add-btn2').click(handleFiles);
  $('#manual-add-btn').click(manualAdd);
  
  
  $('#more-info-btn').click(function(){
	$('#storage').modal('hide');
	$('#more-info').modal('show');
  });
  
  if(!checkForStorage()){
	$('#storage').modal('show');
  } else if(!checkForDragons()){
	$('#firstrun').modal('show');
  } else { //load dragons
	
  }
  
});

function handleFiles() {
	var files = $('#file-input').files; //TODO: is this right?
	if(!files){
		$('#file-input-label').html("You must enter a file!");
		//$('#file-add').modal('show');
		return;
	}
	$('#file-add').modal('hide');
    var file = files[0];
	var objectURL = window.URL.createObjectURL(file);
	//TODO: read in files line by line, assign each line to a dragon var
} 

function fileAdd(){
	$('#firstrun').modal('hide');
	$('#file-add').modal('show');
}

function manualAdd(){
	$('#firstrun').modal('hide');
	$('#manual-add').modal('show');
}

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