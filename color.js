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

			
//var numberDragons = 0; //incremented and used with each dragon
var objectarray = new Array(); //contains all a user's dragons
var mSelected = false, fSelected = true; //only select one male/one female dragon at a time -- checks if this is true
var male, female; //the dragons to breed
var editIndex = -1; //index of dragon we are editing, or -1
var deleteMale = false; // checked only when deleting. false is delete female, true is delete male. 
var deleteAll = false; // checked when deleting something. true if delete all. 
var maleLock = false, femaleLock = false; //check if center dragon is locked in place


$(document).ready(function () {
//set up selectpicker
$('.selectpicker').selectpicker();

//set up toggling sidebar
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
 
  $('#save').click(function(){
	var blob = new Blob([localStorage.getItem('frcolorplus')], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "frcolorplus.txt");
  });
  $('#canvas-color-spread').click(function(){
	var canvas = document.getElementById("canvas-color-spread");
// draw to canvas...
	canvas.toBlob(function(blob) {
		saveAs(blob, "dragoncolor_"+male.name+ '_'+female.name+ ".png");
	});
  });
  
  
  $('#file-manual-add').click(function(){
	alert("If you have already added this file or dragons in it, the dragons stored in it will appear twice!");
	fileAdd(); 
  });
 
  $('#file-add-btn').click(function(){
	$('#firstrun').modal('hide');
	fileAdd();
	});
  $('#file-add-btn2').click(handleFiles);
  $('#manual-add-btn1').click(manualAdd);  
  $('#manual-add-btn2').click(function(){
  editIndex = -1;
  manualAdd();
  });
  $('#save-manual-add1').click(function(){
	if(	$('#sex-dropdown').val() != "Sex" &&
		$('#primary-dropdown').val() != "Primary" &&
		$('#secondary-dropdown').val() != "Secondary" &&
		$('#tertiary-dropdown').val() != "Tertiary") {
		saveDragon()
	} else return false;
  });
  $('#save-manual-add2').click(function(){
	if(	$('#sex-dropdown').val() != "Sex" &&
		$('#primary-dropdown').val() != "Primary" &&
		$('#secondary-dropdown').val() != "Secondary" &&
		$('#tertiary-dropdown').val() != "Tertiary") {
		saveDragon()
	} else return false;
  });
  $('#really-delete-btn').click(deleteDragon);
  
  $('#delete-all-btn').click(function(){
	deleteAll = true;
    $('#delete-warning').modal('show');
  });
  
  $('#more-info-btn').click(function(){
	$('#storage').modal('hide');
	$('#storage2').modal('show');
  });
  
  if(!checkForStorage()){
	$('#storage').modal('show');
  } else if(!checkForDragons()){
	$('#firstrun').modal('show');
  } else { //load dragons from storage
	//numberDragons = 0;
	clearSidebarDragons();
	//objectarray.length = 0;
	setUpDragons(localStorage.getItem('frcolorplus'), 0);
  }
  
}); //end document ready

function femaleUpdateCenter(dragon, that){
		
	if(!femaleLock){

		if(!fSelected){
			fSelected = true;
			$(that).toggleClass('active');
		} else if($(that).hasClass('active')){
			fSelected = false;
			$(that).removeClass('active');
		}else { //another was selected before
			$('.female.active').removeClass('active');
			$(that).addClass('active');
		}
		
		if($(that).hasClass('active')){
			female = dragon;
		
			//set the main dragon html
			$('#female-dragon').html('<h2>' + 
						female.name + 
						' (F)</h2><ul class="list-unstyled"><li id="female-p">Primary: ' + 
						colors[female.p] + 
						'</li><li id="female-s">Secondary: ' +
						colors[female.s] + 
						'</li><li id="female-t">Tertiary: ' + 
						colors[female.t] + 
						'</li></ul><p><button class="btn btn-danger" id="female-delete">Delete</button><button class="btn btn-default" id="female-edit">Edit</button><button class="btn btn-default" id="female-lock">Lock</button></p>'
			);
			$('#female-edit').click(function(){
				editIndex = female.location;
				editDragon(female);
			});
			$('#female-delete').click(function(){
				deleteMale = false;
				$('#delete-warning').modal('show');
			});
			$('#female-lock').click(function(){
				$(this).toggleClass("active");
				femaleLock = !femaleLock;
			});
			$('#female-p').css('color',hex[female.p]);
			$('#female-s').css('color',hex[female.s]);
			$('#female-t').css('color',hex[female.t]);
			
			$('#female-p').addClass('black-border-text');
			
			$('#female-s').addClass('black-border-text');
				
			$('#female-t').addClass('black-border-text');
			
			
			if(mSelected && fSelected){
				updateSpreads();
			}
		} else {
			removeCenter(1);
		}
	}
}

function removeCenter(sex){
	if(sex == 0){
		male = null;
		$('#male-dragon').html('<h2>' + 
						"Dragon 1" + 
						' (M)</h2><ul class="list-unstyled"><li>' + 
						'Primary' + 
						'</li><li>' +
						'Secondary' + 
						'</li><li>' + 
						'Tertiary' + 
						'</li></ul>'
			);
	} else {
		female = null;
		$('#female-dragon').html('<h2>' + 
						"Dragon 2" + 
						' (F)</h2><ul class="list-unstyled"><li>' + 
						'Primary' + 
						'</li><li>' +
						'Secondary' + 
						'</li><li>' + 
						'Tertiary' + 
						'</li></ul>'
			);
	}
}

function maleUpdateCenter(dragon, that){
	if(!maleLock){
		if(!mSelected){
			mSelected = true;
			$(that).toggleClass('active');
		} else if($(that).hasClass('active')){
			mSelected = false;
			$(that).removeClass('active');
		} else { //another was selected before
			$('.male.active').removeClass('active');
			$(that).addClass('active');
		}
		
		if($(that).hasClass('active')){
			male = dragon;
			
			//set the main dragon html
			$('#male-dragon').html('<h2>' + 
						male.name + 
						' (M)</h2><ul class="list-unstyled"><li id="male-p">Primary: ' + 
						colors[male.p] + 
						'</li><li id="male-s">Secondary: ' +
						colors[male.s] + 
						'</li><li id="male-t">Tertiary: ' + 
						colors[male.t] + 
						'</li></ul><p><button class="btn btn-danger" id="male-delete">Delete</button><button class="btn btn-default" id="male-edit">Edit</button><button class="btn btn-default" id="male-lock">Lock</button></p>'
			);
			$('#male-p').css('color',hex[male.p]);
			$('#male-s').css('color',hex[male.s]);
			$('#male-t').css('color',hex[male.t]);
			
			$('#male-edit').click(function(){
				editIndex = male.location;
				editDragon(male);
			});
			$('#male-delete').click(function(){
				deleteMale = true;
				$('#delete-warning').modal('show');
			});
			$('#male-lock').click(function(){
				$(this).toggleClass("active");
				maleLock = !maleLock;
			});
			
			$('#male-p').addClass('black-border-text');
			$('#male-s').addClass('black-border-text');
			$('#male-t').addClass('black-border-text');
		
			
			if(mSelected && fSelected){
				updateSpreads();
			}
		} else {
			removeCenter(0);
		}
		
	}
 }

function saveDragon(){
	var dragon = new Object();
	dragon.name = $('#new-name').val();
	dragon.sex = ($('#sex-dropdown').val() == "M") ? 0 : 1;
	dragon.p = colorIndex($('#primary-dropdown').val());
	dragon.s = colorIndex($('#secondary-dropdown').val());
	dragon.t = colorIndex($('#tertiary-dropdown').val());
	
	
	if(editIndex == -1){
		//then save dragon and add to sidebar
		//alert(JSON.stringify(dragon));
		dragon.location = objectarray.length;
		objectarray[dragon.location] = dragon;
		var s = (localStorage.getItem('frcolorplus') ? localStorage.getItem('frcolorplus') : "") + JSON.stringify(dragon) + '\n'; //conditional fixes "null" at beginning
		localStorage.setItem('frcolorplus',s);
		addToSidebar(dragon);
		addOnClick(dragon);
	} else {
		//we are editing
		//alert(editIndex);
		dragon.location = editIndex;
		if(objectarray[editIndex].sex != dragon.sex){
			removeCenter(objectarray[editIndex].sex);	
		}
		objectarray[editIndex] = dragon;
		editIndex = -1;
		storeDragons();
		clearSidebarDragons();
		setUpDragons(localStorage.getItem('frcolorplus'), 0);
		//update center panel
		if(dragon.sex == 0){
			maleUpdateCenter(dragon, this);
		} else {
			femaleUpdateCenter(dragon, this);
			
		 }
	}
	
	//finally, reset values of dialog
	$('#new-name').val("");
	$('#sex-dropdown').selectpicker("val","Sex");
	$('#primary-dropdown').selectpicker("val","Primary")
	$('.primary-group button').css("background-color","#ffffff").css("color","#000000");
	$('#secondary-dropdown').selectpicker("val","Secondary")
	$('.secondary-group button').css("background-color","#ffffff").css("color","#000000");
	$('#tertiary-dropdown').selectpicker("val","Tertiary")
	$('.tertiary-group button').css("background-color","#ffffff").css("color","#000000");
}

function deleteAllDragons(){
	objectarray.length = 0;
	storeDragons();
	maleLock = femaleLock = false;
	clearSidebarDragons();
	setUpDragons(localStorage.getItem('frcolorplus'), 0);
}

function deleteDragon(){
	if(deleteAll){
		deleteAllDragons();
		deleteAll = false;
		return;
	}
	var dragon;
	if(deleteMale){
		maleLock = false;
		dragon = male;
	} else {
		femaleLock = false;
		dragon = female;
	}
	removeCenter(dragon.sex);
	objectarray.splice(dragon.location, 1);
	//numberDragons = objectarray.length;
	storeDragons();
	clearSidebarDragons();
	setUpDragons(localStorage.getItem('frcolorplus'), 0);
}

function colorIndex(name){
	for(var i in colors){
		if(colors[i] == name) return i;
	}
	return -1;
}

function updateSpreads(){
	if(male && female && mSelected && fSelected){
	
		var prim= calculateSpread(male.p, female.p);
		var second = calculateSpread(male.s, female.s);
		var tert = calculateSpread(male.t, female.t);
		
		var canvas = document.getElementById("canvas-color-spread");
		canvas.width = $("#page-center").width();
		canvas.height = 150;
		var ctx = canvas.getContext("2d");
		
		//clear canvas
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0,0,canvas.width, canvas.length);
		//NEW:add a border
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 1;
		
		var width = 15;
		//The new way, fixed-size bars that are centered
		var center = canvas.width / 2;
		var start = canvas.width / 2 - (prim.length/2)*width;
		for(var i = 0; i < prim.length; i++){
			ctx.fillStyle = hex[prim[i]];
			ctx.fillRect(start + i*width,0,width, 50);
			ctx.strokeRect(start + i*width,0,width, 50);
		}
		start = canvas.width / 2 - (second.length/2)*width;
		for(var i = 0; i < second.length ; i++){
			ctx.fillStyle = hex[second[i]];
			ctx.fillRect(start + i*width,50,width, 50);
			ctx.strokeRect(start + i*width,50,width, 50);
		}
		start = canvas.width / 2 - (tert.length/2)*width;
		for(var i = 0; i < tert.length ; i++){
			ctx.fillStyle = hex[tert[i]];
			ctx.fillRect(start + i*width,100,width, 50);
			ctx.strokeRect(start + i*width,100,width, 50);
		}
		
		/*The old way, where the bars stretch
		for(var i = 0; i < prim.length ; i++){
			ctx.fillStyle = hex[prim[i]];
			ctx.fillRect(i*(canvas.width / prim.length),0,(i+1)*(canvas.width / prim.length), 50);
		}
		for(var i = 0; i < second.length ; i++){
			ctx.fillStyle = hex[second[i]];
			ctx.fillRect(i*(canvas.width / second.length),50,(i+1)*(canvas.width / second.length),100);
		}
		for(var i = 0; i < tert.length ; i++){
			ctx.fillStyle = hex[tert[i]];
			ctx.fillRect(i*(canvas.width / tert.length),100,(i+1)*(canvas.width / tert.length),150);
		}*/
	}
}

function calculateSpread(index1, index2){
	index1 = parseInt(index1);
	index2 = parseInt(index2);
	var lowi = index1 > index2 ? index2 : index1;
	var highi = index1 > index2 ? index1 : index2;
	var arr = new Array();
	if(index1 == index2){
		arr[0] = index1;
		return arr;
	} else if( highi - lowi > (hex.length - highi) + lowi){ //we want to loop over edge of array
		if(index1 == highi){
			for(var i = 0; i < ((hex.length - highi) + lowi) + 1; i++){
				arr[i] = (highi + i) % hex.length;
				if(arr[i] < 0) arr[i] += hex.length;
			}
		} else {
			for(var i = 0; i < lowi + hex.length - highi + 1; i++){
				arr[i] = (lowi - i) % hex.length;
				if(arr[i] < 0) arr[i] += hex.length;
			}
		}
	} else { //simple cases
		if(index1 < index2){
			for(var i = 0; i < index2 - index1 + 1; i++){
				arr[i] = index1 + i;
			}
		} else { //index2 < index1
			for(var i = 0; i < index1 - index2 + 1; i++){
				arr[i] = index1 - i;
			}
		}
	}
	
	//alert(JSON.stringify(arr));
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
	var reader = new FileReader();
	reader.onload = function(){
		setUpDragons(reader.result, objectarray.length);
		storeDragons();
		clearSidebarDragons();
		setUpDragons(localStorage.getItem('frcolorplus'), 0);
	};
	
	reader.readAsText(file);
} 

function clearSidebarDragons(){
	$('#sidebar-list').html('');
}

function setUpDragons(string, offset){
	var darray = string.split('\n');
	//$('#sidebar-list').html('');
	//numberDragons = 0;
	for(var i in darray ){
		if(darray[i] && darray[i] != ''){
			i = parseInt(i);
			//alert(darray[i]);
			try{
			objectarray[i + offset] = jQuery.parseJSON(darray[i]);
			objectarray[i + offset].location = i + offset;
			//alert(objectarray[i].name + " added");
			addToSidebar(objectarray[i + offset]);
			//numberDragons++;
			} catch(e){
			alert("Dragon file has a problem in this line: " + darray[i]);
			//ignore this line and skip to next 
			//which means, do nothing here, let the for loop take its course
			}
		}
	}
	setOnClickSidebar();
}

function addToSidebar(dragon){
	$('#sidebar-list').append( '<button type="button" class="btn btn-default btn-block list-group-item ' + 
								(dragon.sex == 0 ? 'male' : 'female') +
								'" id="dragon-'+dragon.location+'"><h3>' + 
								dragon.name + 
								' (<span id="dragon-sex-'+dragon.location+'">' + 
								(dragon.sex == 0 ? 'M' : 'F') + 
								'</span>)</h3>' + /*'<ul> <li>Primary: ' + 
								colors[dragon.p] + 
								'</li><li>Secondary: ' + 
								colors[dragon.s] + 
								'</li><li>Tertiary:' +
								colors[dragon.t] + 
								'</li></ul>'*/
								'</button>'
	);
	$('#dragon-' + dragon.location).css('background-color', hex[dragon.p]);
	$('#dragon-' + dragon.location).css('color', hex[dragon.s]);
	$('#dragon-sex-' + dragon.location).css('color', hex[dragon.t]);
	
	var luma1 = calculateLuminosity(hex[dragon.p]);
	

	if(luma1 > 60){
		$('#dragon-' + dragon.location).addClass('black-border-text');
	} else {
		$('#dragon-' + dragon.location).addClass('white-border-text');
	}
	
}

function calculateLuminosity(hexcode){
	var c = hexcode.substring(1);      // strip #
	var rgb = parseInt(c, 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue
	return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}
function addOnClick(dragon){

	if(dragon.sex == 0){
	 $('#dragon-' + dragon.location).click(function(){
		maleUpdateCenter(dragon, this);
	  });
	  } else { 
	  $('#dragon-' + dragon.location).click(function(){
		femaleUpdateCenter(dragon, this);
	  });
	}
}

function setOnClickSidebar(){ //this has to be called after all elements added

  $('.male').click(function(){
	var n = $(this).attr('id');
	n = parseInt(n.substring(n.indexOf('-') + 1));
	maleUpdateCenter(objectarray[n], this);
  });
  
  $('.female').click(function(){
	var n = $(this).attr('id');
	n = parseInt(n.substring(n.indexOf('-') + 1));
	femaleUpdateCenter(objectarray[n], this);
  });
  
}
function storeDragons(){ 
	var s = "";
	for(var i in objectarray){
		//alert(JSON.stringify(objectarray[i]));
		if(objectarray[i]){
			s = s + JSON.stringify(objectarray[i]) + '\n';
		}
	}
	localStorage.setItem('frcolorplus',s);
}

function fileAdd(){
	$('#file-add').modal('show');
}

function editDragon(dragon){
	populateAdd();
	$('#new-name').val(dragon.name);
	dragon.sex == 0 ? $('#sex-dropdown').selectpicker("val","M") : $('#sex-dropdown').selectpicker("val","F");
	$('#primary-dropdown').selectpicker("val",colors[dragon.p]);
	$('#secondary-dropdown').selectpicker("val",colors[dragon.s]);
	$('#tertiary-dropdown').selectpicker("val",colors[dragon.t]);
	$('.selectpicker').selectpicker("refresh");
	
	$('.primary-group button').css('background-color', hex[dragon.p]);
	if(calculateLuminosity(hex[dragon.p]) < 60)
		$('.primary-group button').css('color', '#ffffff');
	
	
	$('.secondary-group button').css('background-color', hex[dragon.s]);
	if(calculateLuminosity(hex[dragon.s]) < 60)
		$('.secondary-group button').css('color', '#ffffff');
		

	$('.tertiary-group button').css('background-color', hex[dragon.t]);
	if(calculateLuminosity(hex[dragon.t]) < 60)
		$('.tertiary-group button').css('color', '#ffffff');
	
	//and modal stuff
	manualAdd();
	
}

function populateAdd(){
//alert("going to populate");
	//populate dropdowns for manual addition
	if(!($('#primary-0').length)){
		for(var i in colors){
			$('#primary-dropdown').append('<option role="menuitem" class="color-option option" id="primary-'+i+'" >'+colors[i]+'</option>');
			$('#primary-' + i).css("background-color", hex[i]);

			$('#secondary-dropdown').append('<option role="menuitem" class="color-option option" id="secondary-'+i+'">'+colors[i]+'</option>');
			$('#secondary-' + i).css("background-color", hex[i]);
			
			$('#tertiary-dropdown').append('<option role="menuitem" class="color-option option" id="tertiary-'+i+'">'+colors[i]+'</option>');
			$('#tertiary-' + i).css("background-color", hex[i]);
			
			if(calculateLuminosity(hex[i]) < 60){
				$('#primary-' +i).css('color', '#ffffff');
				$('#secondary-' +i).css('color', '#ffffff');
				$('#tertiary-' +i).css('color', '#ffffff');
			}
		}
	}
	//now populated
	 $('.selectpicker').selectpicker('refresh');
	 
	 if(editIndex == -1){//reset dialog values to initial ones
		$('#new-name').val("");
		$('#sex-dropdown').selectpicker("val","Sex");
		$('#primary-dropdown').selectpicker("val","Primary").css("background-color","#ffffff").css("color","#000000");
		$('#secondary-dropdown').selectpicker("val","Secondary").css("background-color","#ffffff").css("color","#000000");
		$('#tertiary-dropdown').selectpicker("val","Tertiary").css("background-color","#ffffff").css("color","#000000");
	}
	
	$('.primary-group button').focusout(function(){
		var i = colorIndex($('#primary-dropdown').val()); 
		$(this).css('background-color', hex[i]);
	});	
	$('.secondary-group button').focusout(function(){
		var i = colorIndex($('#secondary-dropdown').val()); 
		$(this).css('background-color', hex[i]);
	});	
	$('.tertiary-group button').focusout(function(){
		var i = colorIndex($('#tertiary-dropdown').val()); 
		$(this).css('background-color', hex[i]);
	});
}

function manualAdd(){
	populateAdd();
	/*$("option").click(function(){
		var selText = $(this).text();
		var bgcolor = $(this).css("background-color");
		var color = $(this).css("color");
		//alert(selText);
		$(this).parents('.btn-group').find('.dropdown-toggle').html(selText).css("color", color).css("background-color", bgcolor);
    });*/
	
	
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
