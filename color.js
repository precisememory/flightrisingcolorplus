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

			
var numberDragons = 0;


$(document).ready(function () {
//set up toggling sidebar
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
//set up dragon storage  
  
  var objectarray = new Array();
  
  $('#file-add-btn').click(fileAdd);
  $('#file-add-btn2').click(function(){ //this one's different because takes parameter
	handleFiles(objectarray);
  });
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
	setUpDragons(localStorage.getItem('frcolorplus'), objectarray);
  }
  
});

function handleFiles(objectarray) {
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
		setUpDragons(reader.result, objectarray);
		storeDragons(objectarray);
	};
	
	reader.readAsText(file);
} 

function setUpDragons(string, objectarray){
	var darray = string.split('\n');
	for(var i in darray ){
		//alert(darray[i]);
		objectarray[i] = jQuery.parseJSON(darray[i]);
		//alert(objectarray[i].name + " added");
		addToSidebar(objectarray[i]);
		numberDragons++;
	}
}

function addToSidebar(dragon){
	$('#sidebar-list').append( '<div class="list-group-item" id="dragon-'+numberDragons+'"><h3>' + 
								dragon.name + 
								' (<span id="dragon-sex-'+numberDragons+'">' + 
								(dragon.sex == 0 ? 'M' : 'F') + 
								'</span>)</h3> <ul> <li>Primary: ' + 
								colors[dragon.p] + 
								'</li><li>Secondary: ' + 
								colors[dragon.s] + 
								'</li><li>Tertiary:' +
								colors[dragon.t] + 
								'</li></ul></div>'
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
function storeDragons(objectarray){ 
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
