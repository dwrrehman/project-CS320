// this file contains the algorithmic javascritpt code for the project, as well as some of the view-switching code.

// converter display modes:
const convert_displaymode = 0;
const add_displaymode = 1;
const list_displaymode = 2;
var displaymode = convert_displaymode;






const conversion_precision = 5;// digits past the decimal point.



/* 

	Need to define the following Classes (refer to class diagram for details)
	-Expression | a string, supposed to be a valid mathematical
	expression, and its corresponding solution.
	-Value | a double with an associated unit.
	-Unit | ...
*/


var bin_variables = [];
var bin_constants = [];


//--------------------------- converter code: ---------------------------------

var systems = []; // array of array of units. each element in the outer array is a system, and each element in the system is a unit.
// except its not an array of arrays, its a array of pair<name, array>. where name is the name of the systems, and array is an array of units.

// Likely will be an array of System objects, rather than just a pair. ~ Andrew 


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





class UnitPower {
	constructor(unit, power) {
		this.unit = unit;
		this.power = power;
	}
}


class CompoundUnit {
	constructor(given_name, abbreviation, description, unitpower_list, system) {
		this.given_name = given_name;
		this.abbreviation = abbreviation;
		this.description = description;
		this.unitpower_list = unitpower_list;
		this.system = system;
	}
}



class UnitPair {
	constructor(to, from) {
		this.to = to;
		this.from = from;
	}
}


class UnitConversions {
	constructor(to,from, shift, factor) {
		this.factor = factor;
		this.shift = shift;
		this.to = to;
		this.from = from;
	}
}

class BaseUnit {
	constructor(given_name, abbreviation, description, given_type, system) {
		this.given_name = given_name;
		this.abbreviation = abbreviation;
		this.description = description;
		this.given_type = given_type;
		this.system = system;
	}
}


class System {
	constructor(given_name, length, mass, time, charge, temperature, brightness) {
		this.given_name = name;
		this.length = length;
		this.mass = mass;
		this.time = time;
		this.charge = charge;
		this.temperature = temperature;
		this.brightness = brightness;
	}

	/*function add_conversion() {

	}*/
}



function baseunit_converter(desired, system, visited, product, sum) { // expects: {Unit, Unit}, from_sys  [] 1.0, 0.0
	let list = system[desired.from.given_type];
	if (system in visited) return [false, product, sum];
		
	for (let i = 0; i < list.length; i++) {
		if(list[i].to.given_name === desired.to.given_name) 
			return [true, product * list[i].factor, sum + list[i].shift];		
	}
	visited.push(desired.from.system);
	for (let i = 0; i < list.length; i++) {
		var result = baseunit_converter(desired, list[i].to.system, visited, list[i].factor * product, list[i].shift + sum);
		if (result[0]) return result;
	}
	return [false, product, sum];
}




function convertUnit(desired,value){
    const visited = []
    let factor = baseunit_converter(desired,desired.from.system,visited,1.0,0);
    if(visited.length > 0) {
        // Define a new path.
        console.log("Path does not yet exist...adding.");
        var from_to_to = new UnitConversions(desired.to, desired.from, factor[2], factor[1]);
        desired.from.system.length.push(from_to_to)
        var to_to_from = new UnitConversions(desired.from, desired.to, -factor[2], 1 / factor[1]);
        desired.to.system.length.push(to_to_from);
    }else{
        console.log("Path exists already.");
    }
    return value * factor[1] + factor[2];
}


function convertComp(to_compound, from_compound) {
	let product = 1.0;
	let sum = 0.0;
	if (from_compound.system
	for (var i = 0; i < to_compound.unitpower_list.length; i++) {
		for (var j = 0; j < from_compound.unitpower_list.length; j++) {
			if  (to_compound.unitpower_list[i].unit.given_type == from_compound.unitpower_list[j].unit.given_type) {
				if (to_compound.unitpower_list[i].power == from_compound.unitpower_list[j].power) {
					found = true;
					let desired = new UnitPair(to_compound.unitpower_list[i].unit, from_compound.unitpower_list[j].unit);

					let result = baseunit_converter(desired, from_compound.unitpower_list[j].unit.system, [], 1.0, 0.0);

					if (!result[0]) {
						console.log("Error: convertComp(): base unit conversion failure!");
						return [false, 1.0, 0.0];
					}
					sum += Math.pow(result[2],to_compound.unitpower_list[i].power);
					product *= Math.pow(result[1],to_compound.unitpower_list[i].power);
				}
			}
		}
		if (!found) {
			console.log("Error: convertComp(): could not find base unit in from compound.");
			return [false, 1.0, 0.0];
		}
	}
	return [true, product, sum];
}


/* TEST CODE FOR BASE UNIT CONVERTER */

var metric = new System("Metric",[],[],[],[],[],[]);
var imperial = new System("Imperial",[],[],[],[],[],[]);
var smootric = new System("Smootric",[],[],[],[],[],[]);
var feathers = new System("feathers",[],[],[],[],[],[]);
var meter = new BaseUnit("meter", "m", "The length of a meter stick", "length", metric);
var foot = new BaseUnit("foot","ft","Less smelly, but about as long as a large human foot.","length",imperial);
var smoot = new BaseUnit("smoot","smt","replace 'f' with 'sm' and you get a smoot.","length",smootric);
var flock = new BaseUnit("flock","fl","I don't even know.","length",feathers);
var metertofoot = new UnitConversions(foot,meter, 0, 3.28084);
var foottometer = new UnitConversions(meter,foot, 0, 1.0/3.28084);
var foottosmoot = new UnitConversions(smoot,foot, 0, 42.0);
var foottoflock = new UnitConversions(flock,foot, 0, 23.5);
var flocktofoot = new UnitConversions(foot,flock, 0, 1/23.5);
var smoottofoot = new UnitConversions(foot,smoot, 0, 1/42.0);
metric.length.push(metertofoot);
imperial.length.push(foottometer);
imperial.length.push(foottosmoot);
imperial.length.push(foottoflock);
feathers.length.push(flocktofoot);
smootric.length.push(smoottofoot);

var newton = new CompoundUnit()

let vis = [];
var pair = new UnitPair(smoot,meter);
/*factor = baseunit_converter(pair,metric,vis,1.0,0.0);
var metertosmoot = new UnitConversions(smoot,meter,factor[2],factor[1]);
metric.length.push(metertosmoot)
var smoottometer = new UnitConversions(meter,smoot,-factor[2],1/factor[1]);
smootric.length.push(smoottometer);
console.log(factor[1]);
*/
console.log("Answer: "+convertUnit(pair,3));    // Convert 3 meters into smoots.
// The new path should exist when the second call is made.
console.log("Answer: "+convertUnit(pair,4));    // Convert 4 meters into smoots.(should use new path.)

console.log("Answer: "+convertUnit(new UnitPair(meter,smoot),413.38584))    // Convert 413.38584 smoots into meters, should be 3 meters.

console.log("Answer: "+convertUnit(new UnitPair(meter,flock),100));
/* END OF TEST CODE */










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
