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

class UnitMap {
    constructor(){
    }
    add(unit){
        if(this[unit.abbreviation] === undefined){
            this[unit.abbreviation] = unit;
        }else{
            console.log("Unit with that abbreviation already exists.");

            console.log(this[unit.abbreviation]);
        }
    }
}

class SystemMap {
    constructor(){
    }
    add(system){
        if(this[system.given_name] === undefined){
            this[system.given_name] = system;
        }else{
            console.log("System with that name already exists.");

            console.log(this[system.given_name]);
        }
    }
}



class UnitPower {
	constructor(unit, power) {
		this.unit = unit;
		this.power = power;
	}
}


class CompoundUnit {
	constructor(given_name, abbreviation, description, given_type, unitpower_list, system) {
		this.given_name = given_name;               // String
		this.abbreviation = abbreviation;           // String
		this.description = description;             // String
		this.unitpower_list = unitpower_list;       // list of UnitPower Objects
		this.given_type = given_type                // String
		this.system = system;                       // Actual system object.
	}
}

class abstractCompound {            // Allows for easy arithmetic with any combination of units.
    constructor(unitpowerlist){
        this.powMap = {};
        this.unitMap = {};
        for(let i = 0; i < unitpowerlist.length; i++){
            this.powMap[unitpowerlist[i].unit.abbreviation] = unitpowerlist[i].power;
            this.unitMap[unitpowerlist[i].unit.abbreviation] = unitpowerlist[i].unit;
        }
    }
    add(unitPower){
        if(this.powMap[unitPower.unit] === undefined){
            this.powMap[unitPower.unit] = unitPower.power;
        }else{
            this.powMap[unitPower.unit] += unitPower.power;
            if(this.powMap[unitPower.unit] === 0){
               delete this.powMap[unitPower.unit];
            }
        }
    }
    equals(abstr){
        let pow = abstr.powMap;
        let unitNames = Object.keys(pow);
        console.log("Comparing "+Object.keys(this.powMap)+" and "+unitNames);
        if(unitNames.length !== Object.keys(this.powMap).length){
            console.log("Not equal because of length++++++++++++++++++=");
            return false;
        }
        for(let name in unitNames){
            if(pow[name] !== this.powMap[name]){
                    console.log(pow[name]+" !== "+this.powMap[name]);
                    return false;
            }
        }
        return true;
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

class CompoundUnitConversions{
    constructor(to,from){
        this.conversions = []; // This should be an array of [UnitConversions, int] where the int is a power.
        this.to = to;          // To and from should be compound units.
        this.from = from;
    }
    convert(value){
        let total = value;
        for(let i = 0; i < this.conversions.length; i++){
            total *= Math.pow(this.conversions[i][0].factor,this.conversions[i][1]);
        }
        return total;
    }
}


class BaseUnit {
	constructor(given_name, abbreviation, description, given_type, system) {
		this.given_name = given_name;       // String
		this.abbreviation = abbreviation;   // String
		this.description = description;     // String
		this.given_type = given_type;       // String
		this.system = system;               // Actual system object
	}
}



class System {
	constructor(given_name, length, mass, time, charge, temperature, brightness) {
		this.given_name = given_name;   // String
		this.length = length;           // List of UnitConversions
		this.mass = mass;               // List of UnitConversions
		this.time = time;               // List of UnitConversions
		this.charge = charge;           // List of UnitConversions
		this.temperature = temperature; // List of UnitConversions
		this.brightness = brightness;   // List of UnitConversions
	}

	/*function add_conversion() {

	}*/
}

class Expression{
    constructor(expr){
        this.val = expr;
    }
}

class Value{
    constructor(quantity,compound){
        if(typeof(quantity) === "string"){
            this.quantity = parseFloat(quantity);
        }else{
            this.quantity = quantity;
        }
        this.units = new abstractCompound(compound);
        console.log("Making a new value "+quantity);
        console.log(compound);
    }
    add(val){
        //this.units.equals(val.units)
        if(true){
            console.log("Successfully added..............");
            this.quantity += val.quantity;
        }else{
            console.log("Error: Addition of two different units. Value.add();");
            console.log(this.units.powMap);
            console.log(val.units.powMap);
            return undefined;
        }
    }
    subtract(val){
        this.add(new Value(-val.quantity,val.units));
    }
    multiply(val){ 
        this.quantity *= val.quantity;
        let keys = Object.keys(val.units.powMap)
        let key;
        for(let i = 0; i < keys.length; i++){
            key = keys[i];
            this.units.add(new UnitPower(key,val.units.powMap[key]));
        }
    }
    divide(val){
        this.quantity /= val.quantity;
        for(let key in val.units.keys()){
            this.units.add(new UnitPower(key,-val.units[key]));
        }
    }
    pow(power){
        this.quantity = Math.pow(this.quantity,power);
        for(let key in this.units.keys()){
            this.units[key] *= power;
            if(this.units[key] === 0){
                delete this.units[key];
            }
        }
    }
}


function baseunit_converter(desired, system, visited, product, sum) { // expects: {Unit, Unit}, from_sys  [] 1.0, 0.0
	let list = system[desired.from.given_type];
	if (system in visited) return [false, product, sum];

	for (let i = 0; i < list.length; i++) {
		if(list[i].to.given_name === desired.to.given_name)
			return [true, product * list[i].factor, sum*list[i].factor + list[i].shift];
	}
	visited.push(desired.from.system);
	for (let i = 0; i < list.length; i++) {
		var result = baseunit_converter(desired, list[i].to.system, visited, list[i].factor * product, list[i].shift + (sum*list[i].factor));
		if (result[0]) return result;
	}
	return [false, product, sum];
}

function convertUnit(desired,value){
    const visited = [];
    let factor = baseunit_converter(desired,desired.from.system,visited,1.0,0);
    if(visited.length > 0) {
        // Define a new path.
        var from_to_to = new UnitConversions(desired.to, desired.from, factor[2], factor[1]);
        desired.from.system.length.push(from_to_to);
        var to_to_from = new UnitConversions(desired.from, desired.to, -factor[2]*(1/factor[1]), 1 / factor[1]);
        desired.to.system.length.push(to_to_from);
    }else{
        console.log("Path exists already.");
    }
    return value * factor[1] + factor[2];
}

function convertComp(to_compound, from_compound, value) {	
    let conversion;
    // Check if a conversion already exists for this compound unit.
	if (from_compound.system[from_compound.given_type] !== undefined) {
		for (let i = 0; i < from_compound.system[from_compound.given_type].length; i++) {
			conversion = from_compound.system[from_compound.given_type][i].to;
			if (conversion.given_name === to_compound.given_name) {				
				console.log("Path exists already.");

				return  [from_compound.system[from_compound.given_type][i].convert(value),from_compound.system[from_compound.given_type][i]];
			}
		}
	} else from_compound.system[from_compound.given_type] = [];	
	console.log("Path does not yet exist...adding.");
    var compResult = new CompoundUnitConversions(to_compound, from_compound);   // Create the new conversion that is to be found if one does not exist.
	for (var i = 0; i < to_compound.unitpower_list.length; i++) {
		for (var j = 0; j < from_compound.unitpower_list.length; j++) {
			if  (to_compound.unitpower_list[i].unit.given_type === from_compound.unitpower_list[j].unit.given_type) {
				if (to_compound.unitpower_list[i].power === from_compound.unitpower_list[j].power) {
					found = true;
					let desired = new UnitPair(to_compound.unitpower_list[i].unit, from_compound.unitpower_list[j].unit);
                    let currentPower = to_compound.unitpower_list[i].power;
                    if(to_compound.unitpower_list[i].unit.given_name !== from_compound.unitpower_list[j].unit.given_name){
                        let result = baseunit_converter(desired, from_compound.unitpower_list[j].unit.system, [], 1.0, 0.0);
                        compResult.conversions.push([new UnitConversions(desired.to,desired.from,result[2],result[1]),currentPower]);
                        if (!result[0]) {
                            console.log("Error: convertComp(): base unit conversion failure! Converting "+desired.from.given_name+" to "+desired.to.given_name);
                            return [0,undefined];
                        }
                    }
				}
			}
		}
		if (!found) {
			console.log("Error: convertComp(): could not find base unit in from compound.");
			return [0,undefined];
		}
	}
	from_compound.system[from_compound.given_type].push(compResult);
	if (to_compound.system[to_compound.given_type] === undefined) 
		to_compound.system[to_compound.given_type] = [];
	convertComp(from_compound,to_compound,value)
	return [compResult.convert(value), compResult];
}
/* Parsing code */

// baseUnits and compoundUnits are supposed to be "maps" of unit abbreviation to units
function getNextValue(expression,systems,baseUnits,compoundUnits){
    let quantity = getNextNumber(expression);   // Returns a string.
    if(quantity.charAt(0) === '('){
        let newVal = solve(quantity.substring(1,quantity.length-1),systems,baseUnits,compoundUnits);
        removeParen(expression);
        return newVal;
    }
    let compound = getAbstractCompound(expression,baseUnits,compoundUnits);// Actually returns a unit power list.
    return new Value(quantity,compound);
}

function removeParen(expression){
    let newString = "";
    let parenCount = 0;
    for(let i = 0; i < expression.val.length; i++){
        if(expression.val[i] === "("){
            parenCount++;
            newString += expression.val[i];
        }else if(expression.val[i] === ")"){
            parenCount--;
            newString += expression.val[i];
        }
        if(parenCoun === 0){
            newString += expression.val[i];
            expression.val = expression.val.substring(newString.length,expression.val.length);
            return 0;
        }
    }
    console.log("ERROR: Non matching parenthesis");
    return 1;
}

function getNextNumber(expression){
    let newString = parseFloat(expression.val).toString();
    expression.val = expression.val.substring(newString.length,expression.val.length);
    let i = 0; 
    return newString;
}

function doOp(value1, op, value2){
    if(op === "+"){
        value1.add(value2);
    }else if(op === "-"){
        value1.subtract(value2);
    }else if(op === "*"){
        value1.multiply(value2);
    }else if(op === "/"){
        value1.divide(value2);
    }else if(op === "^"){
        value.pow(value2.quantity);
    }
    // Result stored in value1.


}

function getAbstractCompound(expression,baseUnits,compoundUnits){
    let unit;
    let div;
    let unitPowerList = [];
    while(true){
        unit = getUnit(expression,baseUnits,compoundUnits);
        if(unit !== ""){
            div = unit.split("^");
            if(baseUnits[div[0]] !== undefined){
                unitPowerList.push(new UnitPower(baseUnits[div[0]],parseFloat(div[1])));
            }else if(compountUnits[div[0]] !== undefined){
                unitPowerList.push(new UnitPower(compoundUnits[div[0]],parseFloat(div[1])));
            }
        }else{
            break;
        }
    }
    return unitPowerList;
}

function getUnit(expression, baseUnits, compoundUnits){
    // Unit prefix followed by ^ and a float
    let newUnit = getWord(expression);
    let power = getPower(expression);
    if(baseUnits[newUnit] !== undefined || compoundUnits[newUnit] !== undefined){
        return newUnit+power;
    }else{
        return "";
    }
}

function getWord(expression){
    let newString = "";
    let c;
    for(let i = 0; i < expression.val.length; i++){
        c = expression.val[i];
        if(c.toLowerCase() != c.toUpperCase()){
            newString += c;
        }else{
            break;
        }
    }
    expression.val = expression.val.substring(newString.length,expression.val.length);
    return newString;
}

function getPower(expression){
    let newString = "";
    if(expression.val[0] === "^" ){
        newString += "^";       
    }else{
        return "";
    }
    expression.val = expression.val.substring(newString.length,expression.val.length);
    newString += getNextNumber(expression);
    return newString;
}

function getOp(expression){
    if(expression.val === "" || expression.val === undefined){
        return "";
    }
    if(expression.val[0] === "+" || expression.val[0] === "-" || expression.val[0] === "*" || expression.val[0] === "/" || expression.val[0] === "^"){
        let newString = expression.val[0];
        expression.val = expression.val.substring(newString.length,expression.val.length);
        return newString;
    }else{
        return "";
    }

}

function precidence(op){
    if(op === "+"){
        return 1;
    }else if(op === "-"){
        return 2;
    }else if(op === "*"){
        return 3;
    }else if(op === "/"){
        return 4;
    }else if(op === "^"){
        return 5;
    }else{
        return 0;
    }



}

function solve(expression, systems, baseUnits, compoundUnits){
    let val1;
    let op1;
    let val2;
    let op2;
    if(expression.val != ""){
        console.log(expression.val);
        val1 = getNextValue(expression,systems,baseUnits,compoundUnits);
        console.log("Value 1: " + val1.quantity);
        console.log(val1.units);
        op1 = getOp(expression);
        console.log("Op1: "+op1);
        val2 = getNextValue(expression,systems,baseUnits,compoundUnits);
        console.log("Value 2: " + val2.quantity);
        console.log(val2.units);
        op2 = getOp(expression);    
        console.log("Op2: "+op2);
        if( val2 === undefined || val2.quantity === "" || val2.quantity === null){
            return val1;
        }
        if(precidence(op1) >= precidence(op2)){
            doOp(val1,op1,val2);
            if(op2 === undefined || op2 === "" || op2 === null){
                return val1;
            }
            doOp(val1,op2,solve(expression,systems,baseUnits,compoundUnits));
        }else if(precidence(op1) < precidence(op2)){
            doOp(val2, op2, solve(expression,systems,baseUnits,compoundUnits));
            doOp(val1,op1,val2);
        }    
    }
            return val1;
}



/* TEST CODE FOR BASE UNIT CONVERTER */

    const baseunits = new UnitMap();
    const compoundunits = new UnitMap();
    const systems1 = new SystemMap();

    var metric = new System("Metric",[],[],[],[],[],[]);
    systems1.add(metric);
    var imperial = new System("Imperial",[],[],[],[],[],[]);
    systems1.add(imperial);
    var smootric = new System("Smootric",[],[],[],[],[],[]);
    systems1.add(smootric);
    var feathers = new System("feathers",[],[],[],[],[],[]);
    systems1.add(feathers);

    var meter = new BaseUnit("meter", "m", "The length of a meter stick", "length", metric);
    baseunits.add(meter);
    var foot = new BaseUnit("foot","ft","Less smelly, but about as long as a large human foot.","length",imperial);
    baseunits.add(foot);
    var smoot = new BaseUnit("smoot","smt","replace 'f' with 'sm' and you get a smoot.","length",smootric);
    baseunits.add(smoot);
    var flock = new BaseUnit("flock","fl","I don't even know.","length",feathers);
    baseunits.add(flock);
    var celsius = new BaseUnit("celsius","dC","A unit of temperature in the metric system","temperature",metric);
    baseunits.add(celsius);
    var fahrenheit = new BaseUnit("fahrenheit","dF","A unit of temperature in the imperial system","temperature",imperial);
    baseunits.add(fahrenheit);
    var warmth = new BaseUnit("warmth","dW","A unit of temperature in the feathers system","temperature",feathers);
    baseunits.add(warmth);
    var secondM = new BaseUnit("second","s", "THE unit of time","time",metric);
    baseunits.add(secondM);
    var secondI = new BaseUnit("second","s", "THE unit of time","time",imperial);
    var kilogram = new BaseUnit("kilogram","kg","The metric unit of mass","mass",metric);
    baseunits.add(kilogram);
    var slug = new BaseUnit("slug","slug","The imperial unit of mass","mass", imperial);
    baseunits.add(slug);

    var metertofoot = new UnitConversions(foot,meter, 0, 3.28084);
    var foottometer = new UnitConversions(meter,foot, 0, 1.0/3.28084);
    var foottosmoot = new UnitConversions(smoot,foot, 0, 42.0);
    var foottoflock = new UnitConversions(flock,foot, 0, 23.5);
    var flocktofoot = new UnitConversions(foot,flock, 0, 1/23.5);
    var smoottofoot = new UnitConversions(foot,smoot, 0, 1/42.0);
    var celsiustofahrenheit = new UnitConversions(fahrenheit,celsius,32.0,9.0/5.0);
    var fahrenheittowarmth = new UnitConversions(warmth,fahrenheittowarmth,12.0,3.0/5.0);
    var kilogramtoslug = new UnitConversions(slug,kilogram,0,1.0/14.59390);
    var slugtokilogram = new UnitConversions(kilogram,slug,0,14.59390);

    metric.length.push(metertofoot);
    metric.mass.push(kilogramtoslug);
    metric.temperature.push(celsiustofahrenheit);
    imperial.temperature.push(fahrenheittowarmth);
    imperial.length.push(foottometer);
    imperial.length.push(foottosmoot);
    imperial.length.push(foottoflock);
    imperial.mass.push(slugtokilogram);
    feathers.length.push(flocktofoot);
    smootric.length.push(smoottofoot);
    

    let vis = [];
    var pair = new UnitPair(smoot,meter);


    console.log("Answer: "+convertUnit(pair,3));    // Convert 3 meters into smoots.
    // The new path should exist when the second call is made.
    console.log("Answer: "+convertUnit(pair,4));    // Convert 4 meters into smoots.(should use new path.)

    console.log("Answer: "+convertUnit(new UnitPair(meter,smoot),413.38584))    // Convert 413.38584 smoots into meters, should be 3 meters.

    console.log("Answer: "+convertUnit(new UnitPair(meter,flock),100));

    console.log("12 celsius to fahrenheit");
    console.log("Answer: "+convertUnit(new UnitPair(fahrenheit,celsius),12));
    console.log("10 celsius to warmth");
    console.log("Answer: "+convertUnit(new UnitPair(warmth,celsius),10));
    /* COMPOUND UNIT CONVERSION TESTING */

    var newton = new CompoundUnit("Newton", "N", "A unit of force", "force", [new UnitPower(kilogram, 1),new UnitPower(meter, 1),new UnitPower(secondM, -2)], metric)
    var poundforce = new CompoundUnit("poundforce","lbf","The imperial unit of force","force",[new UnitPower(slug, 1),new UnitPower(foot, 1),new UnitPower(secondI, -2)], imperial);
    var velocity = new CompoundUnit("velocity","v","a speed usually with an associated direction.",[new UnitPower(meter,1),new UnitPower(secondM,-1)], metric);
    console.log("from 10 newton to poundforce");
    console.log(convertComp(poundforce, newton, 10)[0]);
    console.log("from 2.2480899554 poundforce to newton");
    console.log(convertComp(newton,poundforce, 2.2480899554)[0]);
    let testx = new Expression("145.6kg^1*32.5kg^1+15kg^2-12kg^1*2kg^1");
    let ans = solve(testx,systems1, baseunits, compoundunits);
    console.log(ans.quantity);
    console.log(ans.units);

//unitTest();
    

/* END OF TEST CODE */



/*factor = baseunit_converter(pair,metric,vis,1.0,0.0);
var metertosmoot = new UnitConversions(smoot,meter,factor[2],factor[1]);
metric.length.push(metertosmoot)
var smoottometer = new UnitConversions(meter,smoot,-factor[2],1/factor[1]);
smootric.length.push(smoottometer);
console.log(factor[1]);
*/






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
