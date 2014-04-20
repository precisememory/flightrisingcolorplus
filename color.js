var colors = [	'maize', 		'white', 	'ice',		'platinum',		'silver',		'grey',		'charcoal',		'coal',			'black',		'obsidian',
				'midnight',		'shadow',	'mulberry',	'thistle',		'lavender', 	'purple',	'violet',		'royal',		'storm',		'navy',
				'blue',			'splash',	'sky', 		'stonewash',	'steel',		'denim',	'deep azure',	'caribbean',	'teal',			'aqua',
				'seafoam',		'jade',		'emerald',	'jungle',		'forest',		'swamp',	'avocado',		'green',		'leaf',			'spring',
				'goldenrod',	'lemon',	'banana',	'ivory',		'gold',			'sunshine',	'orange',		'fire',			'tangerine',	'sand', 
				'beige',		'stone',	'slate',	'soil',			'brown',		'chocolate','rust',			'tomato',		'crimson',		'blood',		
				'maroon',		'red',		'carmine',	'coral',		'magenta',		'pink',		'rose'
];

var hex = [		'#fffdea',		'#ffffff',	'#dae0f3',	'#c8bece',		'#bbbabf',		'#7e7e7e', 	'#545454',		'#4b4946',		'#333333',		'#000000',
				'#292b38',		'#3a2e44',	'#6e235d',	'#8f7c8b',		'#cca4e0',	 	'#a261cf',	'#643f9c',		'#4d2c89',		'#757adb',		'#212b5f',
				'#324ba9',		'#6394dd',	'#aec8ff', 	'#7996c2',		'#556979',		'#2f4557',	'#052343',		'#0086ce',		'#2b768f',		'#72c4c4',
				'#aaf1b1',		'#61ab89',	'#20603f',	'#1e361a',		'#425035',		'#687f67',	'#567c34',		'#629c3f',		'#a5e32d',		'#a9a032',
				'#948647',		'#ffe63b',	'#fdff72',	'#ffd297',		'#e8af49',		'#fa912b',	'#d5602b',		'#ef5c23',		'#ff7360',		'#b27749',
				'#cabba2',		'#969182',	'#564d48',	'#5a4534',		'#755136',		'#48260e',	'#8b3220',		'#ba311c',		'#850012',		'#450f0f',
				'#652127',		'#c1272d',	'#b13a3a',	'#cc6f6f',		'#e934aa',		'#e77fbf',	'#ffd6f6'	
];

			
var numberDragons = 0; //incremented and used with each dragon
var objectarray = new Array(); //contains all a user's dragons
var mSelected = false, fSelected = true; //only select one male/one female dragon at a time -- checks if this is true
var male, female; //the dragons to breed


$(document).ready(function () {
//set up toggling sidebar
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
  } else { //load dragons from storage
	setUpDragons(localStorage.getItem('frcolorplus'));
  }
  
}); //end document ready

function updateSpreads(){
	if(male && female){
	
		var primary = calculateSpread(male.p, female.p);
		var secondary = calculateSpread(male.s, female.s);
		var tertiary = calculateSpread(male.t, female.t);
		
		var canvas = document.getElementById("canvas-color-spread");
		canvas.width = $("#page-center").width();
		canvas.height = 300;
		var ctx = canvas.getContext("2d");
		for(var i = 0; i < primary.length ; i++){
			ctx.fillStyle = hex[primary[i]];
			ctx.fillRect(i*(canvas.width / primary.length),0,(i+1)*(canvas.width / primary.length), 100);
		}
		for(var i = 0; i < secondary.length ; i++){
			ctx.fillStyle = hex[secondary[i]];
			ctx.fillRect(i*(canvas.width / secondary.length),100,(i+1)*(canvas.width / secondary.length),200);
		}
		for(var i = 0; i < tertiary.length ; i++){
			ctx.fillStyle = hex[tertiary[i]];
			ctx.fillRect(i*(canvas.width / tertiary.length),200,(i+1)*(canvas.width / tertiary.length),300);
		}
	}
}

function calculateSpread(index1, index2){
	var lowi = index1 > index2 ? index2 : index1;
	var highi = index1 > index2 ? index1 : index2;
	var arr = new Array();
	if(index1 == index2){
		arr[0] = i1
		return arr;
	} else if( highi - lowi > lowi + hex.length - highi){ //we want to loop over edge of array
		if(index1 == highi){
			for(var i = 0; i < lowi + hex.length - highi; i++){
				arr[i] = (highi + i) % hex.length;
			}
		} else {
			for(var i = 0; i < lowi + hex.length - highi; i++){
				arr[i] = (lowi - i) % hex.length;
			}
		}
	} else { //simple cases
		if(index1 < index2){
			for(var i = 0; i < index2 - index1; i++){
				arr[i] = index1 + i;
			}
		} else { //index2 < index1
			for(var i = 0; i < index1 - index2; i++){
				arr[i] = index1 - i;
			}
		}
	}
	return arr;
}

function handleFiles() {
	var files = $('#file-input').prop('files'); 
	if(!files){
		$('#file-input-label').html("You must enter a file!");
		//$('#file-add').modal('show');
		return;
	}
	$('#file-add').modal('hide');
    var file = files[0];
	//var objectURL = window.URL.createObjectURL(file);
	//TODO: read in files line by line, assign each line to a dragon var
	var reader = new FileReader();
	reader.onload = function(){
		setUpDragons(reader.result);
		storeDragons();
	};
	
	reader.readAsText(file);
} 

function setUpDragons(string){
	var darray = string.split('\n');
	for(var i in darray ){
		//alert(darray[i]);
		if(darray[i] != ''){
			objectarray[i] = jQuery.parseJSON(darray[i]);
			//alert(objectarray[i].name + " added");
			addToSidebar(objectarray[i]);
			numberDragons++;
		}
	}
	setOnClickSidebar();
}

function addToSidebar(dragon){
	$('#sidebar-list').append( '<button type="button" class="btn btn-default btn-block list-group-item ' + 
								(dragon.sex == 0 ? 'male' : 'female') +
								'" id="dragon-'+numberDragons+'"><h3>' + 
								dragon.name + 
								' (<span id="dragon-sex-'+numberDragons+'">' + 
								(dragon.sex == 0 ? 'M' : 'F') + 
								'</span>)</h3> <ul> <li>Primary: ' + 
								colors[dragon.p] + 
								'</li><li>Secondary: ' + 
								colors[dragon.s] + 
								'</li><li>Tertiary:' +
								colors[dragon.t] + 
								'</li></ul></button>'
	);
	$('#dragon-' + numberDragons).css('background-color', hex[dragon.p]);
	$('#dragon-' + numberDragons).css('color', hex[dragon.s]);
	$('#dragon-sex-' + numberDragons).css('color', hex[dragon.t]);
	
	//calculate luminosity and determine if white or black text shadow from it
	var c = hex[dragon.p].substring(1);      // strip #
	var rgb = parseInt(c, 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue

	var luma1 = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
	
	c = hex[dragon.s].substring(1);      // strip #
	rgb = parseInt(c, 16);   // convert rrggbb to decimal
	r = (rgb >> 16) & 0xff;  // extract red
	g = (rgb >>  8) & 0xff;  // extract green
	b = (rgb >>  0) & 0xff;  // extract blue
	
	var luma2 = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

	//only do shadow if text is too similar in lightness
	if(luma1 - luma2 > 40 || luma2 - luma1 > 40){
		if(luma1 > 40){
			$('#dragon-' + numberDragons).css('text-shadow', '-1px -1px #000000, -1px 1px #000000, 1px -1px #000000, 1px 1px #000000'); // black border hopefully increases readability
		} else {
			$('#dragon-' + numberDragons).css('text-shadow', '-1px -1px #ffffff, -1px 1px #ffffff, 1px -1px #ffffff, 1px 1px #ffffff'); // black border hopefully increases readability
		}
	}
}


function setOnClickSidebar(){ //this has to be called after all elements added

  $('.male').click(function(){
	//alert("clicked");
	if(!mSelected){
		mSelected = true;
		$(this).toggleClass('active');
	} else if($(this).hasClass('active')){
		mSelected = false;
		$(this).removeClass('active');
	} else { //another was selected before
		$('.male.active').removeClass('active');
		$(this).addClass('active');
	}
	if($(this).hasClass('active')){
		var n = $(this).attr('id');
		n = parseInt(n.substring(n.indexOf('-') + 1));
		male = objectarray[n];
		
		//set the main dragon html
		$('#male-dragon').html('<h2>' + 
					male.name + 
					' (M)</h2><ul><li>' + 
					colors[male.p] + 
					'</li><li>' +
					colors[male.s] + 
					'</li><li>' + 
					colors[male.t] + 
					'</li></ul><p><button class="btn btn-danger" >Delete</button><button class="btn btn-default" >Edit</button></p>'
		);
		
		
		if(mSelected && fSelected){
			updateSpreads();
		}
	} else {
		//TODO: set to some default??
	}
  });
  
  $('.female').click(function(){
	//alert("clicked");
	if(!fSelected){
		fSelected = true;
		$(this).toggleClass('active');
	} else if($(this).hasClass('active')){
		fSelected = false;
		$(this).removeClass('active');
	}else { //another was selected before
		$('.female.active').removeClass('active');
		$(this).addClass('active');
	}
	
	if($(this).hasClass('active')){
		var n = $(this).attr('id');
		n = parseInt(n.substring(n.indexOf('-') + 1));
		female = objectarray[n];
	
		//set the main dragon html
		$('#female-dragon').html('<h2>' + 
					female.name + 
					' (F)</h2><ul><li>' + 
					colors[female.p] + 
					'</li><li>' +
					colors[female.s] + 
					'</li><li>' + 
					colors[female.t] + 
					'</li></ul><p><button class="btn btn-danger" >Delete</button><button class="btn btn-default" >Edit</button></p>'
		);
		
		
		if(mSelected && fSelected){
			updateSpreads();
		}
	} else {
		//TODO: set to some default??
	}
  });
  
}
function storeDragons(){ 
	var s = "";
	for(var i in objectarray){
		s = s + JSON.stringify(objectarray[i]) + '\n';
	}
	localStorage.setItem('frcolorplus',s);
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
