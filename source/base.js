// this file contains the algorithmic javascritpt code for the project, as well as some of the view-switching code.

// converter display modes:
const convert_displaymode = 0;
const add_displaymode = 1;
const list_displaymode = 2;
var displaymode = convert_displaymode;






const conversion_precision = 5;// digits past the decimal point.






var bin_variables = [];
var bin_constants = [];


//--------------------------- converter code: ---------------------------------

var systemes = []; // array of array of units. each element in the outer array is a system, and each element in the system is a unit.
// except its not an array of arrays, its a array of pair<name, array>. where name is the name of the systems, and array is an array of units.



function system(given_systemname, given_units) {
	this.systemname = given_name;
	this.units = given_units;
}

function unit(given_unitname, given_definition) {
	this.unitname = given_unitname;
	this.definition = given_definition;
}

function add_new_unit_to_system(given_system, given_name, definition) {
	for (i = 0; i < systemes.length; i++) {
		if (systemes[i].systemname === given_system) {
			systemes[i].units.push(unit(given_name, definition));
		}
	}
}

function add_new_system(given_systemname) {
	systemes.push(system(given_systemname, []));
}











// variables and constants: bins :

// a ds that could be a var or a const.
function bin(given_name, given_data) {
	this.given_name = given_name;
	this.given_data = given_data;
}


// adders:

function add_variable(given_name, given_data) {
	if (given_name === undefined  && given_data === undefined) return;
	bin_variables.push(bin(given_name, given_data));
}

function add_constant(given_name, given_data) {
	if (given_name === undefined  && given_data === undefined) return;
	bin_constants.push(bin(given_name, given_data));
}










/// calcilator stuff:


var display_string = "";

function receive(string) {


	if (string == "store") {
		let bin_type = prompt("Specify the bin type: (variable/constant)", "variable");
		let given_name = prompt("Specify the name of the bin: ");

		let raw_data = document.getElementById("calculator_display").innerText;
		let num_data = Number(raw_data);
		if (isNaN(num_data)) {
			alert("cannot store: " + raw_data);
			return;
		}
		
		if (bin_type == "variable") {
			add_variable(given_name, num_data);
			alert("Stored Successfully");
		} else if (bin_type == "constant"){
			add_constant(given_name, num_data);
			alert("Stored Successfully");
		} else {
			alert("cannot use bin type: " + bin_type);			
		}		
		return;
	}

	else if (string == "load") {
		console.log("found load");

	}

	if (string.length == 1) {
		display_string += string;
	} else if (string == "clear"){
		display_string = "";
	} else {
		display_string = "";
	}
	document.getElementById("calculator_display").innerText = display_string;
}



//// ---------------------------- view switching code ------------------------------


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
		document.getElementById("content").innerHTML = load_file("main.html");
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

// a function for each page that is run when the page finsihes loading.
function main() {
	if (displaymode === convert_displaymode) {		
		document.getElementById("calculator_display").text = display_string;




	} else if (displaymode === add_displaymode) {		

	} else if (displaymode === list_displaymode) {
		for (v = 0; v < bin_variables.length; v++) {
			var n = bin_variables[v].given_name;
			var d = bin_variables[v].given_data;

			document.getElementById("text").innerText += n + " = " + d + "\n";

		}
	}
}	














/// ------------------- main.html code: ---------------------------------






function convert() {	
	let result = null;
	let input = document.getElementById("converter_input").value;

	input = input.replace(/,/g, '');

	if (input == "" || input == null) {
		document.getElementById("converter_result").value = null;
		return;
	}

	// temp dummy code :	
	result = Number(input) * Number(input);	

	//get the units the user picked.
	var from = document.getElementById("from_unit").value;
	var to = document.getElementById("to_unit").value;

	// do conversion;
	
	if (isNaN(result) || result == null || result == undefined) {		
		document.getElementById("converter_result").value = null;
		return;
	}	

	result = result.toFixed(conversion_precision);
	result = Number(result);

	document.getElementById("converter_result").value = result + " " + to;	
}












/// --------- add.html code: --------------          [OLD and invalid now]

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