// this file contains the algorithmic javascritpt code for the project, as well as some of the view-switching code.


const conversion_precision = 5;// digits past the decimal point.


/*

	Need to define the following Classes (refer to class diagram for details)
	-Expression | a string, supposed to be a valid mathematical
	expression, and its corresponding solution.
	-Value | a double with an associated unit.
	-Unit | ...
*/


const bin_variables = [];
const bin_constants = [];


// --------------------------- converter code: ---------------------------------

class UnitMap {
  add(unit) {
    if (this[unit.abbreviation] === undefined) {
      this[unit.abbreviation] = unit;
    } else {
      console.log('Unit with that abbreviation already exists.');

      console.log(this[unit.abbreviation]);
    }
  }
}

class SystemMap {
  add(system) {
    if (this[system.givenName] === undefined) {
      this[system.abbreviation] = system;
    } else {
      console.log('System with that name already exists.');

      console.log(this[system.givenName]);
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
  constructor(givenName, abbreviation, description, GivenType, UnitpowerList, system) {
    this.givenName = givenName; // String
    this.abbreviation = abbreviation; // String
    this.description = description; // String
    this.UnitpowerList = UnitpowerList; // list of UnitPower Objects
    this.GivenType = GivenType; // String
    this.system = system; // Actual system object.
  }
}

class AbstractCompound { // Allows for easy arithmetic with any combination of units.
  constructor(unitpowerlist) {
    this.powMap = {};
    this.unitMap = {};
    for (let i = 0; i < unitpowerlist.length; i++) {
      this.powMap[unitpowerlist[i].unit.abbreviation] = unitpowerlist[i].power;
      this.unitMap[unitpowerlist[i].unit.abbreviation] = unitpowerlist[i].unit;
    }
  }

  add(unitPower) {
    if (this.powMap[unitPower.unit] === undefined) {
      this.powMap[unitPower.unit] = unitPower.power;
    } else {
      this.powMap[unitPower.unit] += unitPower.power;
      if (this.powMap[unitPower.unit] === 0) {
        delete this.powMap[unitPower.unit];
      }
    }
  }

  equals(abstr) {
    const pow = abstr.powMap;
    const unitNames = Object.keys(pow);
    if (unitNames.length !== Object.keys(this.powMap).length) {
      return false;
    }
    let name;
    for (let i = 0; i < unitNames.length; i++) {
      name = unitNames[i];
      if (pow[name] !== this.powMap[name]) {
        console.log(`${pow[name]} !== ${this.powMap[name]}`);
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
  constructor(to, from, shift, factor) {
    this.factor = factor;
    this.shift = shift;
    this.to = to;
    this.from = from;
  }
}

class CompoundUnitConversions {
  constructor(to, from) {
    this.conversions = []; // This should be an array of [UnitConversions, int] where the int is a power.
    this.to = to; // To and from should be compound units.
    this.from = from;
  }

  convert(value) {
    let total = value;
    for (let i = 0; i < this.conversions.length; i++) {
      total *= this.conversions[i][0].factor ** (this.conversions[i][1]);
    }
    return total;
  }
}


class BaseUnit {
  constructor(givenName, abbreviation, description, GivenType, system) {
    this.givenName = givenName; // String
    this.abbreviation = abbreviation; // String
    this.description = description; // String
    this.GivenType = GivenType; // String
    this.system = system; // Actual system object
  }
}


class System {
  constructor(givenName, length, mass, time, charge, temperature, brightness) {
    this.givenName = givenName; // String
    this.length = length; // List of UnitConversions
    this.mass = mass; // List of UnitConversions
    this.time = time; // List of UnitConversions
    this.charge = charge; // List of UnitConversions
    this.temperature = temperature; // List of UnitConversions
    this.brightness = brightness; // List of UnitConversions
  }
}

class Expression {
  constructor(expr) {
    this.val = expr;
  }
}

class Value {
  constructor(quantity, compound) {
    if (typeof (quantity) === 'string') {
      this.quantity = parseFloat(quantity);
    } else {
      this.quantity = quantity;
    }
    if (Array.isArray(compound)) {
      this.units = new AbstractCompound(compound);
    } else {
      this.units = compound;
    }
  }

  add(val) {
    if (this.units.equals(val.units)) {
      console.log(val.quantity);
      console.log(this.quantity);
      this.quantity += val.quantity;
    } else {
      console.log('Error: Addition of two different units. Value.add();');
      console.log(val.quantity);
      console.log(this.quantity);
      console.log(this.units.powMap);
      console.log(val.units.powMap);
    }
  }

  subtract(val) {
    this.add(new Value(-val.quantity, val.units));
  }

  multiply(val) {
    this.quantity *= val.quantity;
    const keys = Object.keys(val.units.powMap);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      this.units.add(new UnitPower(key, val.units.powMap[key]));
    }
  }

  divide(val) {
    this.quantity /= val.quantity;
    const keys = Object.keys(val.units.powMap);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      this.units.add(new UnitPower(key, -val.units[key]));
    }
  }

  pow(power) {
    this.quantity = this.quantity ** power;
    const keys = Object.keys(this.units.powMap);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      this.units.powMap[key] *= power;
      if (this.units.powMap[key] === 0) {
        delete this.units.powMap[key];
      }
    }
  }
}


function BaseunitConverter(desired, system, visited, product, sum) { // expects: {Unit, Unit}, FromSys  [] 1.0, 0.0
  const list = system[desired.from.GivenType];
  if (system in visited) return [false, product, sum];

  for (let i = 0; i < list.length; i++) {
    if (list[i].to.givenName === desired.to.givenName) {
      return [true, product * list[i].factor, sum * list[i].factor + list[i].shift];
    }
  }
  visited.push(desired.from.system);
  for (let i = 0; i < list.length; i++) {
    const result = BaseunitConverter(desired, list[i].to.system, visited, list[i].factor * product, list[i].shift + (sum * list[i].factor));
    if (result[0]) return result;
  }
  return [false, product, sum];
}

function convertUnit(desired, value) {
  const visited = [];
  const factor = BaseunitConverter(desired, desired.from.system, visited, 1.0, 0);
  if (visited.length > 0) {
    // Define a new path.
    const FromToTo = new UnitConversions(desired.to, desired.from, factor[2], factor[1]);
    desired.from.system.length.push(FromToTo);
    const ToToFrom = new UnitConversions(desired.from, desired.to, -factor[2] * (1 / factor[1]), 1 / factor[1]);
    desired.to.system.length.push(ToToFrom);
  } else {
    console.log('Path exists already.');
  }
  return value * factor[1] + factor[2];
}

function convertComp(ToCompound, FromCompound, value) {
  let conversion;
  let found;
  // Check if a conversion already exists for this compound unit.
  if (FromCompound.system[FromCompound.GivenType] !== undefined) {
    for (let i = 0; i < FromCompound.system[FromCompound.GivenType].length; i++) {
      conversion = FromCompound.system[FromCompound.GivenType][i].to;
      if (conversion.givenName === ToCompound.givenName) {
        console.log('Path exists already.');

        return [FromCompound.system[FromCompound.GivenType][i].convert(value),
          FromCompound.system[FromCompound.GivenType][i]];
      }
    }
  } else FromCompound.system[FromCompound.GivenType] = [];
  console.log('Path does not yet exist...adding.');
  const compResult = new CompoundUnitConversions(ToCompound, FromCompound); // Create the new conversion that is to be found if one does not exist.
  for (let i = 0; i < ToCompound.UnitpowerList.length; i++) {
    for (let j = 0; j < FromCompound.UnitpowerList.length; j++) {
      if (ToCompound.UnitpowerList[i].unit.GivenType === FromCompound.UnitpowerList[j].unit.GivenType) {
        if (ToCompound.UnitpowerList[i].power === FromCompound.UnitpowerList[j].power) {
          found = true;
          const desired = new UnitPair(ToCompound.UnitpowerList[i].unit, FromCompound.UnitpowerList[j].unit);
          const currentPower = ToCompound.UnitpowerList[i].power;
          if (ToCompound.UnitpowerList[i].unit.givenName !== FromCompound.UnitpowerList[j].unit.givenName) {
            const result = BaseunitConverter(desired, FromCompound.UnitpowerList[j].unit.system, [], 1.0, 0.0);
            compResult.conversions.push([new UnitConversions(desired.to, desired.from, result[2], result[1]), currentPower]);
            if (!result[0]) {
              console.log(`Error: convertComp(): base unit conversion failure! Converting ${desired.from.givenName} to ${desired.to.givenName}`);
              return [0, undefined];
            }
          }
        }
      }
    }
    if (!found) {
      console.log('Error: convertComp(): could not find base unit in from compound.');
      return [0, undefined];
    }
  }
  FromCompound.system[FromCompound.GivenType].push(compResult);
  if (ToCompound.system[ToCompound.GivenType] === undefined) ToCompound.system[ToCompound.GivenType] = [];
  convertComp(FromCompound, ToCompound, value);
  return [compResult.convert(value), compResult];
}
/* Parsing code */

// baseUnits and compoundUnits are supposed to be "maps" of unit abbreviation to units
function getNextValue(expression, systems, baseUnits, compoundUnits) {
  if (expression.val.charAt(0) === '(') {
    const quantity = removeParen(expression);
    const newString = new Expression(quantity.substring(1, quantity.length - 2));
    const newVal = solve(newString, systems, baseUnits, compoundUnits);
    return newVal;
  }
  const quantity = getNextNumber(expression); // Returns a string.
  const compound = getAbstractCompound(expression, baseUnits, compoundUnits);// Actually returns a unit power list.
  return new Value(quantity, compound);
}

function removeParen(expression) {
  let newString = '';
  let parenCount = 0;
  for (let i = 0; i < expression.val.length; i++) {
    if (expression.val[i] === '(') {
      parenCount++;
      newString += expression.val[i];
    } else if (expression.val[i] === ')') {
      parenCount--;
      newString += expression.val[i];
    } else {
      newString += expression.val[i];
    }
    if (parenCount === 0) {
      newString += expression.val[i];
      expression.val = expression.val.substring(newString.length - 1, expression.val.length);
      return newString;
    }
  }
  console.log('ERROR: Non matching parenthesis');
  return 1;
}

function getNextNumber(expression) {
  const newString = parseFloat(expression.val).toString();
  expression.val = expression.val.substring(newString.length, expression.val.length);
  const i = 0;
  return newString;
}

function doOp(value1, op, value2) {
  if (op === '+') {
    value1.add(value2);
  } else if (op === '-') {
    value1.subtract(value2);
  } else if (op === '*') {
    value1.multiply(value2);
  } else if (op === '/') {
    value1.divide(value2);
  } else if (op === '^') {
    value1.pow(value2.quantity);
  }
  // Result stored in value1.
}

function getAbstractCompound(expression, baseUnits, compoundUnits) {
  let unit;
  let div;
  const unitPowerList = [];
  while (true) {
    unit = getUnit(expression, baseUnits, compoundUnits);
    if (unit !== '') {
      div = unit.split('^');
      if (baseUnits[div[0]] !== undefined) {
        unitPowerList.push(new UnitPower(baseUnits[div[0]], parseFloat(div[1])));
      } else if (compountUnits[div[0]] !== undefined) {
        unitPowerList.push(new UnitPower(compoundUnits[div[0]], parseFloat(div[1])));
      }
    } else {
      break;
    }
  }
  return unitPowerList;
}

function getUnit(expression, baseUnits, compoundUnits) {
  // Unit prefix followed by ^ and a float
  const newUnit = getWord(expression);
  if (newUnit === undefined || newUnit === '') {
    return '';
  }
  const power = getPower(expression);
  if (baseUnits[newUnit] !== undefined || compoundUnits[newUnit] !== undefined) {
    return newUnit + power;
  }
  return '';
}

function getWord(expression) {
  let newString = '';
  let c;
  for (let i = 0; i < expression.val.length; i++) {
    c = expression.val[i];
    if (c.toLowerCase() != c.toUpperCase()) {
      newString += c;
    } else {
      break;
    }
  }
  expression.val = expression.val.substring(newString.length, expression.val.length);
  return newString;
}

function getPower(expression) {
  let newString = '';
  if (expression.val[0] === '^') {
    newString += '^';
  } else {
    return '';
  }
  expression.val = expression.val.substring(newString.length, expression.val.length);
  newString += getNextNumber(expression);
  return newString;
}

function getOp(expression) {
  if (expression.val === '' || expression.val === undefined) {
    return '';
  }
  if (expression.val[0] === '+' || expression.val[0] === '-' || expression.val[0] === '*' || expression.val[0] === '/' || expression.val[0] === '^') {
    const newString = expression.val[0];
    expression.val = expression.val.substring(newString.length, expression.val.length);
    return newString;
  }
  return '';
}

function precidence(op) {
  if (op === '+') {
    return 1;
  } if (op === '-') {
    return 2;
  } if (op === '*') {
    return 3;
  } if (op === '/') {
    return 4;
  } if (op === '^') {
    return 5;
  }
  return 0;
}

function solve(expression, systems, baseUnits, compoundUnits) {
  let val1;
  let op1;
  let val2;
  let op2;
  if (expression.val !== undefined && expression.val !== '' && expression.val !== null) {
    val1 = getNextValue(expression, systems, baseUnits, compoundUnits);
    op1 = getOp(expression);
    val2 = getNextValue(expression, systems, baseUnits, compoundUnits);
    op2 = getOp(expression);
    if (val1 === undefined || isNaN(val1.quantity) || val1.quantity === null) {
      console.log('What??? nothing is defined');
      return undefined;
    }
    if (val2 === undefined || isNaN(val2.quantity) || val2.quantity === null) {
      return val1;
    }
    if (precidence(op1) >= precidence(op2)) {
      doOp(val1, op1, val2);
      if (op2 === undefined || op2 === '' || op2 === null) {
        return val1;
      }
      doOp(val1, op2, solve(expression, systems, baseUnits, compoundUnits));
    } else if (precidence(op1) < precidence(op2)) {
      doOp(val2, op2, solve(expression, systems, baseUnits, compoundUnits));
      doOp(val1, op1, val2);
    }
  }
  return val1;
}


/* TEST CODE FOR BASE UNIT CONVERTER */

const baseunits = new UnitMap();
const compoundunits = new UnitMap();
const systems1 = new SystemMap();

const metric = new System('Metric', [], [], [], [], [], []);
systems1.add(metric);
const imperial = new System('Imperial', [], [], [], [], [], []);
systems1.add(imperial);
const smootric = new System('Smootric', [], [], [], [], [], []);
systems1.add(smootric);
const feathers = new System('feathers', [], [], [], [], [], []);
systems1.add(feathers);

const meter = new BaseUnit('meter', 'm', 'The length of a meter stick', 'length', metric);
baseunits.add(meter);
const foot = new BaseUnit('foot', 'ft', 'Less smelly, but about as long as a large human foot.', 'length', imperial);
baseunits.add(foot);
const smoot = new BaseUnit('smoot', 'smt', "replace 'f' with 'sm' and you get a smoot.", 'length', smootric);
baseunits.add(smoot);
const flock = new BaseUnit('flock', 'fl', "I don't even know.", 'length', feathers);
baseunits.add(flock);
const celsius = new BaseUnit('celsius', 'dC', 'A unit of temperature in the metric system', 'temperature', metric);
baseunits.add(celsius);
const fahrenheit = new BaseUnit('fahrenheit', 'dF', 'A unit of temperature in the imperial system', 'temperature', imperial);
baseunits.add(fahrenheit);
const warmth = new BaseUnit('warmth', 'dW', 'A unit of temperature in the feathers system', 'temperature', feathers);
baseunits.add(warmth);
const secondM = new BaseUnit('second', 's', 'THE unit of time', 'time', metric);
baseunits.add(secondM);
const secondI = new BaseUnit('second', 's', 'THE unit of time', 'time', imperial);
const kilogram = new BaseUnit('kilogram', 'kg', 'The metric unit of mass', 'mass', metric);
baseunits.add(kilogram);
const slug = new BaseUnit('slug', 'slug', 'The imperial unit of mass', 'mass', imperial);
baseunits.add(slug);

const metertofoot = new UnitConversions(foot, meter, 0, 3.28084);
const foottometer = new UnitConversions(meter, foot, 0, 1.0 / 3.28084);
const foottosmoot = new UnitConversions(smoot, foot, 0, 42.0);
const foottoflock = new UnitConversions(flock, foot, 0, 23.5);
const flocktofoot = new UnitConversions(foot, flock, 0, 1 / 23.5);
const smoottofoot = new UnitConversions(foot, smoot, 0, 1 / 42.0);
const celsiustofahrenheit = new UnitConversions(fahrenheit, celsius, 32.0, 9.0 / 5.0);
var fahrenheittowarmth = new UnitConversions(warmth, fahrenheittowarmth, 12.0, 3.0 / 5.0);
const kilogramtoslug = new UnitConversions(slug, kilogram, 0, 1.0 / 14.59390);
const slugtokilogram = new UnitConversions(kilogram, slug, 0, 14.59390);

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


const vis = [];
const pair = new UnitPair(smoot, meter);


console.log(`Answer: ${convertUnit(pair, 3)}`); // Convert 3 meters into smoots.
// The new path should exist when the second call is made.
console.log(`Answer: ${convertUnit(pair, 4)}`); // Convert 4 meters into smoots.(should use new path.)

console.log(`Answer: ${convertUnit(new UnitPair(meter, smoot), 413.38584)}`); // Convert 413.38584 smoots into meters, should be 3 meters.

console.log(`Answer: ${convertUnit(new UnitPair(meter, flock), 100)}`);

console.log('12 celsius to fahrenheit');
console.log(`Answer: ${convertUnit(new UnitPair(fahrenheit, celsius), 12)}`);
console.log('10 celsius to warmth');
console.log(`Answer: ${convertUnit(new UnitPair(warmth, celsius), 10)}`);
/* COMPOUND UNIT CONVERSION TESTING */

const newton = new CompoundUnit('Newton', 'N', 'A unit of force', 'force', [new UnitPower(kilogram, 1), new UnitPower(meter, 1), new UnitPower(secondM, -2)], metric);
const poundforce = new CompoundUnit('poundforce', 'lbf', 'The imperial unit of force', 'force', [new UnitPower(slug, 1), new UnitPower(foot, 1), new UnitPower(secondI, -2)], imperial);
const velocity = new CompoundUnit('velocity', 'v', 'a speed usually with an associated direction.', [new UnitPower(meter, 1), new UnitPower(secondM, -1)], metric);
console.log('from 10 newton to poundforce');
console.log(convertComp(poundforce, newton, 10)[0]);
console.log('from 2.2480899554 poundforce to newton');
console.log(convertComp(newton, poundforce, 2.2480899554)[0]);
/* Solving Tests */
const test1 = new Expression('(5kg^1)^3*(15*16+12)');
const ans1 = solve(test1, systems1, baseunits, compoundunits);
console.log(ans1.quantity);
console.log(ans1.units);
const test2 = new Expression('5kg^1^3*252');
const ans2 = solve(test2, systems1, baseunits, compoundunits);
console.log(ans2.quantity);
console.log(ans2.units);
const test3 = new Expression('5kg^1^3*(252*(16m^-3+5m^-3)-7m^-3)');
const ans3 = solve(test3, systems1, baseunits, compoundunits);
console.log(ans3.quantity);
console.log(ans3.units);
const test4 = new Expression('5kg^1^3*(252*(((16m^-3+5m^-3)))-7m^-3)');
const ans4 = solve(test4, systems1, baseunits, compoundunits);
console.log(ans4.quantity);
console.log(ans4.units);

// unitTest();


/* END OF TEST CODE */


/* factor = baseunit_converter(pair,metric,vis,1.0,0.0);
var metertosmoot = new UnitConversions(smoot,meter,factor[2],factor[1]);
metric.length.push(metertosmoot)
var smoottometer = new UnitConversions(meter,smoot,-factor[2],1/factor[1]);
smootric.length.push(smoottometer);
console.log(factor[1]);
*/


// variables and constants: bins :

// a ds that could be a var or a const.
function bin(givenName, given_data) {
  this.givenName = givenName;
  this.given_data = given_data;
}


// adders:

function add_variable(givenName, given_data) {
  if (givenName === undefined && given_data === undefined) return;
  bin_variables.push(bin(givenName, given_data));
}

function add_constant(givenName, given_data) {
  if (givenName === undefined && given_data === undefined) return;
  bin_constants.push(bin(givenName, given_data));
}


// / calcilator stuff:


let display_string = '';

function receive(string) {
  if (string == 'store') {
    const bin_type = prompt('Specify the bin type: (variable/constant)', 'variable');
    const givenName = prompt('Specify the name of the bin: ');

    const raw_data = document.getElementById('calculator_display').innerText;
    const num_data = Number(raw_data);
    if (isNaN(num_data)) {
      alert(`cannot store: ${raw_data}`);
      return;
    }

    if (bin_type == 'variable') {
      add_variable(givenName, num_data);
      alert('Stored Successfully');
    } else if (bin_type == 'constant') {
      add_constant(givenName, num_data);
      alert('Stored Successfully');
    } else {
      alert(`cannot use bin type: ${bin_type}`);
    }
    return;
  }

  if (string == 'load') {
    console.log('found load');
  }

  if (string.length == 1) {
    display_string += string;
  } else if (string == 'clear') {
    display_string = '';
  } else {
    display_string = '';
  }
  document.getElementById('calculator_display').innerText = display_string;
}


// / ------------------- main.html code: ---------------------------------


function convert() {
  let result = null;
  let input = document.getElementById('converter_input').value;

  input = input.replace(/,/g, '');

  if (input == '' || input == null) {
    document.getElementById('converter_result').value = null;
    return;
  }

  // temp dummy code :
  result = Number(input) * Number(input);

  // get the units the user picked.
  const from = document.getElementById('from_unit').value;
  const to = document.getElementById('to_unit').value;

  // do conversion;

  if (isNaN(result) || result == null || result == undefined) {
    document.getElementById('converter_result').value = null;
    return;
  }

  result = result.toFixed(conversion_precision);
  result = Number(result);

  document.getElementById('converter_result').value = `${result} ${to}`;
}


// / --------- add.html code: --------------          [OLD and invalid now]

function validate(formula) {
  const result = true;
  return result;
}

function store_new_unit() {

}

function submit_new_unit() {
  const formula = document.getElementById('formula').text;
  // unimplemented
  if (validate(formula)) {
    store_new_unit();

    alert('Successfully added new unit.');

    displaymode = convert_displaymode;
    draw();
  } else {
    alert('error in parsing defintition!');
  }
}
