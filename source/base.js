// this file contains the algorithmic code for doing unit conversion, as well as the view-switching code.

const convert_displaymode = 0;
const add_displaymode = 1;
const list_displaymode = 2;

var displaymode = convert_displaymode;

var conversions = [];

function unit_conversion(from_unit_name, to_unit_name, conversion_factor) {
	this.from_unit_name = from_unit_name;
	this.to_unit_name = to_unit_name;
	this.conversion_factor = conversion_factor;
}

function add_unit_conversion(conversion) {
	if (conversion.from_unit_name === undefined) return;
	if (conversion.to_unit_name === undefined) return;
	if (conversion.conversion_unit_name === undefined) return;
	conversions.push(conversion);
}

function get_all_current_conversions() {
	return conversions;
}


// finds html file on server side, and retreives its data.
function load_file(file_path) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", file_path, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  } else return "undefined text, could not load file: " + file_path;  
  return result;
}

// sets the current content div
function draw() {
	if (displaymode === convert_displaymode) {				
		document.getElementById("content").innerHTML = load_file("convert.html");
	} else if (displaymode === add_displaymode) {
		document.getElementById("content").innerHTML = load_file("add.html");
	} else if (displaymode === list_displaymode) {
		document.getElementById("content").innerHTML = load_file("list.html");
	} else {
		displaymode = convert_displaymode;
		draw();
	}
	main();
}

function main() {
	if (displaymode === convert_displaymode) {		

	} else if (displaymode === add_displaymode) {		

	} else if (displaymode === list_displaymode) {
		
	}
}	


/// convert.html code:

function convert() {	
	document.getElementById("value").innerHTML = "42";
	document.getElementById("value").setAttribute("style", "font-size: 30px; font-family: Courier;");
}

function reset() {
	document.getElementById("value").innerHTML = "<button style=\"font-size: 20px;\" style=\"font-family: Courier;\" onclick=\"convert();\">Convert</button>";
}




/// add.html code:

function validate(formula) {	
	var result = true;
	return result;
}

function store_new_unit() { 

}

function submit_new_unit() {
	var formula = document.getElementById("formula").text;		
	// unimplemented
	if (validate(formula)) {

		store_new_unit();

		alert("Successfully added new unit.");

		displaymode = convert_displaymode; 
		draw();
	} else {
		alert("error in parsing defintition!");
	}		
}