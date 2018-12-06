import { Meteor } from 'meteor/meteor';
import { Systems } from '../imports/api/systems/systems.js';
import { BaseUnits } from '../imports/api/base/base.js';
import { compoundUnits } from '../imports/api/compound/compound.js';
import { conversions } from '../imports/api/conversion/conversion.js';
/* eslint-disable max-len,no-use-before-define,no-param-reassign,no-restricted-globals,camelcase */
// this file contains the algorithmic javascritpt code for the project, as well as some of the view-switching code.

const conversion_precision = 5;// digits past the decimal point.

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
      this[system.givenName] = system;
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
  constructor(givenName, abbreviation, description, GivenType, UnitpowerList, system, baseUnits) {
    this.givenName = givenName; // String
    this.abbreviation = abbreviation; // String
    this.description = description; // String
    if (Array.isArray(UnitpowerList)) {
      this.UnitpowerList = UnitpowerList; // list of UnitPower Objects
    } else if (typeof (UnitpowerList) === 'object') {
      const keys = Object.keys(UnitpowerList.powMap);
      let key;
      const newunitpowers = [];
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        newunitpowers.push(new UnitPower(UnitpowerList.unitMap[key], UnitpowerList.powMap[key]));
      }
      this.UnitpowerList = newunitpowers;
    } else if (typeof (UnitpowerList) === 'string') {
      this.UnitpowerList = getAbstractCompound(new Expression(UnitpowerList), baseUnits); // Don't panic
      // getAbstractCompound actually returns a unit power list.
    }
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
    if (this.powMap[unitPower.unit.abbreviation] === undefined) {
      this.powMap[unitPower.unit.abbreviation] = unitPower.power;
      this.unitMap[unitPower.unit.abbreviation] = unitPower.unit;
    } else {
      this.powMap[unitPower.unit.abbreviation] += unitPower.power;
      if (this.powMap[unitPower.unit.abbreviation] === 0) {
        delete this.powMap[unitPower.unit.abbreviation];
        delete this.unitMap[unitPower.unit.abbreviation];
      }
    }
  }

  combine(abstract) {
    const keys = Object.keys(abstract.powMap);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      this.add(new UnitPower(abstract.unitMap[key], abstract.powMap[key]));
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
        return false;
      }
    }
    return true;
  }

  toString() {
    let str = '';
    const keys = Object.keys(this.powMap);
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      str += (`${key}^${this.powMap[key]}`);
    }
    return str;
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
    this.conversions = []; // This should be an array of [UnitConversions, float] where the float is a power.
    this.to = to; // To and from should be compound units.
    this.from = from;
    this.invalid = false;
    this.isShift = false;
  }

  convert(value) {
    let total = value;
    for (let i = 0; i < this.conversions.length; i++) {
      total *= this.conversions[i][0].factor ** (this.conversions[i][1]);
      if (this.conversions[i][0].shift !== 0) {
        this.isShift = true;
        if (this.conversions.length > 1 || this.conversions[0][1] !== 1) {
          this.invalid = true;
        }
      }
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
    this.convMap = {};
    this.givenName = givenName; // String
    this.length = length; // List of UnitConversions
    this.mass = mass; // List of UnitConversions
    this.time = time; // List of UnitConversions
    this.charge = charge; // List of UnitConversions
    this.temperature = temperature; // List of UnitConversions
    this.brightness = brightness; // List of UnitConversions
  }

  add(conversion, type) {
    if (this[type] === undefined) {
      this[type] = [];
    }
    this[type].push(conversion);
  }
}

class Expression {
  constructor(expr) {
    this.val = expr.replace(/\s/g, '');
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
      this.quantity += val.quantity;
    } else {
      console.log('Error: Addition of two different units. Value.add();');
      alert('Error: Addition of two different units.');
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
      this.units.add(new UnitPower(val.units.unitMap[key], val.units.powMap[key]));
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

  toString() {
    const units = this.units.toString();
    return this.quantity + units;
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
  let shiftFlag = false;
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
            if (result[2] !== 0) {
              shiftFlag = true;
            }
            if (!result[0] || (shiftFlag && compResult.conversions.length > 1)) {
              console.log(`Error: convertComp(): base unit conversion failure! Converting ${desired.from.givenName} to ${desired.to.givenName}`);
              alert(`Error: convertComp(): base unit conversion failure! Converting ${desired.from.givenName} to ${desired.to.givenName}`);
              return [0, undefined];
            }
          }
        }
      }
    }
    if (!found) {
      console.log('Error: convertComp(): could not find base unit in from compound.');
      alert('Error: convertComp(): could not find base unit in from compound.');
      return [0, undefined];
    }
  }
  FromCompound.system[FromCompound.GivenType].push(compResult);
  if (ToCompound.system[ToCompound.GivenType] === undefined) ToCompound.system[ToCompound.GivenType] = [];
  convertComp(FromCompound, ToCompound, value);
  return [compResult.convert(value), compResult];
}

function getAbstractConversion(systems, desiredSystemName, abstractCompound) {
  let conversion = 1;
  let shift = 0;
  const keys = Object.keys(abstractCompound.powMap);
  let key;
  let currentPower;
  let currentUnit;
  let currentToUnit;
  let currentSystem;
  let currentBaseConversion;
  let currentCompoundConversion;
  let intermediateAbstract;
  let intermediateConversion;
  const newUnitPowerList = [];
  const desiredSystem = systems[desiredSystemName];
  let akeys;
  let akey;
  if (keys.length === 0) {
    return [1, 0, new AbstractCompound([])];
  }
  if (desiredSystem === undefined) {
    console.log('There isnt a system with that name????');
    return [1, undefined];
  }
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    currentPower = abstractCompound.powMap[key];
    currentUnit = abstractCompound.unitMap[key];
    currentSystem = currentUnit.system;
    if (currentUnit.GivenType === undefined || currentUnit.GivenType === '') {
      console.log('Current unit has no type????');
      return [1, 0, undefined];
    } if (desiredSystem[currentUnit.GivenType] === undefined || desiredSystem[currentUnit.GivenType].length === 0) {
      console.log('Given Type....-----...???!');
      console.log(currentUnit.GivenType);
      if (currentUnit.UnitpowerList === undefined) {
        console.log('The desired system has no conversions for that type????');
        console.log(currentUnit.givenName);
        return [1, 0, undefined];
      }
      console.log('No direct conversion, attempting basic conversion.');
      intermediateAbstract = new AbstractCompound(currentUnit.UnitpowerList);
      console.log('New Abstract.');
      console.log(intermediateAbstract);
      intermediateConversion = getAbstractConversion(systems, desiredSystemName, intermediateAbstract);
      console.log(intermediateConversion);
      conversion *= intermediateConversion[0];
      shift += intermediateConversion[1];
      akeys = Object.keys(intermediateConversion[2].powMap);
      for (let j = 0; j < akeys.length; j++) {
        akey = akeys[j];
        newUnitPowerList.push(new UnitPower(intermediateConversion[2].unitMap[akey], intermediateConversion[2].powMap[akey]));
      }
      continue;
    }
    currentToUnit = desiredSystem[currentUnit.GivenType][0].from;
    if (currentUnit.UnitpowerList === undefined) { // Means currentUnit is a base unit
      currentBaseConversion = BaseunitConverter(new UnitPair(currentToUnit, currentUnit), currentSystem, [], 1.0, 0);
      if (!currentBaseConversion[1]) {
        console.log('Failed to find a baseconversion.');
        return [1, 0, undefined];
      }
      newUnitPowerList.push(new UnitPower(currentToUnit, currentPower));
      if (currentBaseConversion[2] !== 0) {
        if (keys.length > 1 || currentPower > 1) {
          console.log('Shifty business going on in getAbstractConversion');
          return [1, 0, undefined];
        }
        return [currentBaseConversion[1], currentBaseConversion[2], new AbstractCompound(newUnitPowerList)];
      }
      conversion *= currentBaseConversion[1];
      shift += currentBaseConversion[2];
    } else { // Means currentUnit is a compound unit
      currentCompoundConversion = convertComp(currentToUnit, currentUnit, 1.0);
      if (currentCompoundConversion.invalid || (currentCompoundConversion.isShift && keys.length > 0)) {
        console.log('Compound conversion with a shift, oh dear......');
        return [1, 0, undefined];
      }
      if (!currentCompoundConversion.isShift) {
        conversion *= currentCompoundConversion[0];
      } else {
        conversion *= currentCompoundConversion[1].conversions[0].factor;
        shift += currentCompoundConversion.conversions[0].shift;
      }
      newUnitPowerList.push(new UnitPower(currentToUnit, currentPower));
    }
  }
  return [conversion, shift, new AbstractCompound(newUnitPowerList)];
}

/* Parsing code */

// baseUnits and compoundUnits are supposed to be "maps" of unit abbreviation to units
function getNextValue(expression, systems, baseUnits, compoundUnits, desiredSystem) {
  if (expression.val.charAt(0) === '(') {
    const quantity = removeParen(expression);
    const newString = new Expression(quantity.substring(1, quantity.length - 2));
    const newVal = solve(newString, systems, baseUnits, compoundUnits, desiredSystem);
    return newVal;
  }
  const quantity = getNextNumber(expression); // Returns a string.
  const compound = getAbstractCompound(expression, baseUnits, compoundUnits);// Actually returns a unit power list.
  if (desiredSystem !== undefined) {
    // Convert the value to units in the desired system.
  }
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
  alert('ERROR: Non matching parenthesis');
  return 1;
}

function getNextNumber(expression) {
  const newString = parseFloat(expression.val).toString();
  expression.val = expression.val.substring(newString.length, expression.val.length);
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
function getWord(expression) {
  /* this function is used to get a string which consists only of letters. */
  let newString = '';
  let c;
  for (let i = 0; i < expression.val.length; i++) {
    c = expression.val[i];
    if (c.toLowerCase() !== c.toUpperCase()) {
      newString += c;
    } else {
      break;
    }
  }
  expression.val = expression.val.substring(newString.length, expression.val.length);
  return newString;
}
function getUnit(expression, baseUnits, compoundUnits) {
  /*  This function is used to get a unit prefix followed by ^ and a float
  *   from a string which can then be used to produce a value. i.e(kg^2)
  * */
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
function getAbstractCompound(expression, baseUnits, compoundUnits) {
  let unit;
  let div;
  const unitPowerList = [];
  while (true) {
    unit = getUnit(expression, baseUnits, compoundUnits);
    if (unit !== '') {
      div = unit.split('^');
      if (div.length === 1) {
        if (div[0].toUpperCase() !== div[0].toLowerCase()) {
          div.push('1');
        }
      }
      if (baseUnits[div[0]] !== undefined) {
        unitPowerList.push(new UnitPower(baseUnits[div[0]], parseFloat(div[1])));
      } else if (compoundUnits[div[0]] !== undefined) {
        unitPowerList.push(new UnitPower(compoundUnits[div[0]], parseFloat(div[1])));
      }
    } else {
      break;
    }
  }
  // console.log('New unit power lists, wooo');
  // console.log(unitPowerList);
  return unitPowerList;
}


function getPower(expression) {
  /* This function is used to get a ^ followed by a number */
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
  /* This function is used to get a valid unit if it is the first character in expression.val */
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

function solve(expression, systems, baseUnits, compoundUnits, desiredSystemName) {
  let val1;
  let op1;
  let val2;
  let op2;
  let val1NewAbstract;
  let val2NewAbstract;
  let newval;
  let newabstract;
  const expressionSave = expression.val;
  if (expression.val !== undefined && expression.val !== '' && expression.val !== null) {
    val1 = getNextValue(expression, systems, baseUnits, compoundUnits);
    op1 = getOp(expression);
    val2 = getNextValue(expression, systems, baseUnits, compoundUnits);
    op2 = getOp(expression);
    if (val1 === undefined || isNaN(val1.quantity) || val1.quantity === null) {
      console.log('What??? nothing is defined');
      return undefined;
    }
    if (desiredSystemName !== undefined && desiredSystemName !== '') {
      val1NewAbstract = getAbstractConversion(systems, desiredSystemName, val1.units);
      if (val1NewAbstract[2] === undefined) {
        newval = solve(new Expression(expressionSave), systems, baseUnits, compoundUnits);
        newabstract = getAbstractConversion(systems, desiredSystemName, newval.units);
        if (newabstract[2] !== undefined) {
          return new Value(newval.quantity * newabstract[0] + newabstract[1], newabstract[2]);
        }
        return newval;
      }
      val1 = new Value(val1.quantity * val1NewAbstract[0] + val1NewAbstract[1], val1NewAbstract[2]);
      if (val2 === undefined || isNaN(val2.quantity) || val2.quantity === null) {
        return val1;
      }
      val2NewAbstract = getAbstractConversion(systems, desiredSystemName, val2.units);
      if (val2NewAbstract[2] === undefined) {
        newval = solve(new Expression(expressionSave), systems, baseUnits, compoundUnits);
        newabstract = getAbstractConversion(systems, desiredSystemName, newval.units);
        if (newabstract[2] !== undefined) {
          return new Value(newval.quantity * newabstract[0] + newabstract[1], newabstract[2]);
        }
        return newval;
      }
      val2 = new Value(val2.quantity * val2NewAbstract[0] + val2NewAbstract[1], val2NewAbstract[2]);
    }
    if (precidence(op1) >= precidence(op2)) {
      doOp(val1, op1, val2);
      if (op2 === undefined || op2 === '' || op2 === null) {
        return val1;
      }
      doOp(val1, op2, solve(expression, systems, baseUnits, compoundUnits, desiredSystemName));
    } else if (precidence(op1) < precidence(op2)) {
      doOp(val2, op2, solve(expression, systems, baseUnits, compoundUnits, desiredSystemName));
      doOp(val1, op1, val2);
    }
  }
  return val1;
}


/* TEST CODE FOR BASE UNIT CONVERTER */

const baseunits = new UnitMap();
const compoundunits = new UnitMap();
const systems1 = new SystemMap();


// const metric = new System('Metric', [], [], [], [], [], []);
// systems1.add(metric);
// const imperial = new System('Imperial', [], [], [], [], [], []);
// systems1.add(imperial);
// const smootric = new System('Smootric', [], [], [], [], [], []);
// systems1.add(smootric);
// const feathers = new System('feathers', [], [], [], [], [], []);
// systems1.add(feathers);

// const meter = new BaseUnit('meter', 'm', 'The length of a meter stick', 'length', metric);
// baseunits.add(meter);
// const foot = new BaseUnit('foot', 'ft', 'Less smelly, but about as long as a large human foot.', 'length', imperial);
// baseunits.add(foot);
// const smoot = new BaseUnit('smoot', 'smt', "replace 'f' with 'sm' and you get a smoot.", 'length', smootric);
// baseunits.add(smoot);
// const flock = new BaseUnit('flock', 'fl', "I don't even know.", 'length', feathers);
// baseunits.add(flock);
// const celsius = new BaseUnit('celsius', 'dC', 'A unit of temperature in the metric system', 'temperature', metric);
// baseunits.add(celsius);
// const fahrenheit = new BaseUnit('fahrenheit', 'dF', 'A unit of temperature in the imperial system', 'temperature', imperial);
// baseunits.add(fahrenheit);
// const warmth = new BaseUnit('warmth', 'dW', 'A unit of temperature in the feathers system', 'temperature', feathers);
// baseunits.add(warmth);
// const secondM = new BaseUnit('second', 's', 'THE unit of time', 'time', metric);
// baseunits.add(secondM);
// const secondI = new BaseUnit('second', 's', 'THE unit of time', 'time', imperial);
// const kilogram = new BaseUnit('kilogram', 'kg', 'The metric unit of mass', 'mass', metric);
// baseunits.add(kilogram);
// const slug = new BaseUnit('slug', 'slug', 'The imperial unit of mass', 'mass', imperial);
// baseunits.add(slug);

// const metertofoot = new UnitConversions(foot, meter, 0, 3.28084);
// const foottometer = new UnitConversions(meter, foot, 0, 1.0 / 3.28084);
// const foottosmoot = new UnitConversions(smoot, foot, 0, 42.0);
// const foottoflock = new UnitConversions(flock, foot, 0, 23.5);
// const flocktofoot = new UnitConversions(foot, flock, 0, 1 / 23.5);
// const smoottofoot = new UnitConversions(foot, smoot, 0, 1 / 42.0);
// const celsiustofahrenheit = new UnitConversions(fahrenheit, celsius, 32.0, 9.0 / 5.0);
// const fahrenheittowarmth = new UnitConversions(warmth, fahrenheit, 12.0, 3.0 / 5.0);
// const kilogramtoslug = new UnitConversions(slug, kilogram, 0, 1.0 / 14.59390);
// const slugtokilogram = new UnitConversions(kilogram, slug, 0, 14.59390);

// metric.length.push(metertofoot);
// metric.mass.push(kilogramtoslug);
// metric.temperature.push(celsiustofahrenheit);
// imperial.temperature.push(fahrenheittowarmth);
// imperial.length.push(foottometer);
// imperial.length.push(foottosmoot);
// imperial.length.push(foottoflock);
// imperial.mass.push(slugtokilogram);
// feathers.length.push(flocktofoot);
// smootric.length.push(smoottofoot);


// const pair = new UnitPair(smoot, meter);


// console.log(`Answer: ${convertUnit(pair, 3)}`); // Convert 3 meters into smoots.
// // The new path should exist when the second call is made.
// console.log(`Answer: ${convertUnit(pair, 4)}`); // Convert 4 meters into smoots.(should use new path.)

// console.log(`Answer: ${convertUnit(new UnitPair(meter, smoot), 413.38584)}`); // Convert 413.38584 smoots into meters, should be 3 meters.

// console.log(`Answer: ${convertUnit(new UnitPair(meter, flock), 100)}`);

// console.log('12 celsius to fahrenheit');
// console.log(`Answer: ${convertUnit(new UnitPair(fahrenheit, celsius), 12)}`);
// console.log('10 celsius to warmth');
// console.log(`Answer: ${convertUnit(new UnitPair(warmth, celsius), 10)}`);
// /* COMPOUND UNIT CONVERSION TESTING

// const newton = new CompoundUnit('Newton', 'N', 'A unit of force', 'force', [new UnitPower(kilogram, 1), new UnitPower(meter, 1), new UnitPower(secondM, -2)], metric);
// compoundunits.add(newton);
// const poundforce = new CompoundUnit('poundforce', 'lbf', 'The imperial unit of force', 'force', [new UnitPower(slug, 1), new UnitPower(foot, 1), new UnitPower(secondI, -2)], imperial);
// compoundunits.add(poundforce);
// console.log('from 10 newton to poundforce');
// console.log(convertComp(poundforce, newton, 10)[0]);
// console.log('from 2.2480899554 poundforce to newton');
// console.log(convertComp(newton, poundforce, 2.2480899554)[0]);
// /* Solving Tests */
// const test1 = new Expression('(5kg^1)^3*(15*16+12)');
// console.log(`Solving: ${test1.val}`);
// const ans1 = solve(test1, systems1, baseunits, compoundunits);
// console.log(ans1.toString());
// const test2 = new Expression('5kg^1^3*252');
// console.log(`Solving: ${test2.val}`);
// const ans2 = solve(test2, systems1, baseunits, compoundunits);
// console.log(ans2.toString());
// const test3 = new Expression('5kg^1^3*(252*(16m^-3+5m^-3)-7m^-3)');
// console.log(`Solving: ${test3.val}`);
// const ans3 = solve(test3, systems1, baseunits, compoundunits, 'Imperial');
// console.log(ans3.toString());
// const test4 = new Expression('5kg^1^3*(252*(((16m^-3+5m^-3)))-7m^-3)');
// console.log(`Solving: ${test4.val}`);
// const ans4 = solve(test4, systems1, baseunits, compoundunits);
// console.log(ans4.toString());
// const test5 = new Expression('5N^1^3*(252*(((16N^-2+5N^-2)))-7N^-2)');
// console.log(`Solving: ${test5.val}`);
// const ans5 = solve(test5, systems1, baseunits, compoundunits, 'Imperial');
// console.log(ans5.toString());
// const test6 = new Expression('5N*6*12m');
// console.log(`Solving: ${test6.val}`);
// const ans6 = solve(test6, systems1, baseunits, compoundunits, 'Imperial');
// console.log(ans6.toString());
// const test7 = new Expression('5 N  * 6 * 12 m');
// console.log(`Solving: ${test7.val}`);
// const ans7 = solve(test7, systems1, baseunits, compoundunits, 'Imperial');
// console.log(ans7.toString());

// // unitTest();

// /* END OF TEST CODE */
/*
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
    const fahrenheittowarmth = new UnitConversions(warmth, fahrenheit, 12.0, 3.0 / 5.0);
    const kilogramtoslug = new UnitConversions(slug, kilogram, 0, 1.0 / 14.59390);
    const slugtokilogram = new UnitConversions(kilogram, slug, 0, 14.59390);
    const secondMtosecondI = new UnitConversions(secondI, secondM, 0, 1);
    const secondItosecondM = new UnitConversions(secondM, secondI, 0, 1);

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
    imperial.time.push(secondItosecondM);
    metric.time.push(secondMtosecondI);

    const newton = new CompoundUnit('Newton', 'N', 'A unit of force', 'force', [new UnitPower(kilogram, 1), new UnitPower(meter, 1), new UnitPower(secondM, -2)], metric);
    compoundunits.add(newton);
    const poundforce = new CompoundUnit('poundforce', 'lbf', 'The imperial unit of force', 'force', [new UnitPower(slug, 1), new UnitPower(foot, 1), new UnitPower(secondI, -2)], imperial);
    compoundunits.add(poundforce);
    convertComp(poundforce, newton, 1.0);
*/
export const Base = {

  Init() {
    Meteor.subscribe('Conversion');
    Meteor.subscribe('Systems');
    Meteor.subscribe('BaseUnits');
    Meteor.subscribe('CompoundUnits');
    const sys = Systems.find();
    const base = BaseUnits.find();
    const comp = compoundUnits.find();
    const conv = conversions.find();
    let newBase;
    let newSys;
    let newComp;
    let newConv;
    let newConvInv;
    sys.forEach(function (i) {
      newSys = new System(i.name, [], [], [], [], [], []);
      systems1.add(newSys);
    });
    base.forEach(function (i) {
      newBase = new BaseUnit(i.name, i.abbreviation, i.description, i.type, systems1[i.system]);
      baseunits.add(newBase);
    });
    comp.forEach(function (i) {
      newComp = new CompoundUnit(i.name, i.abbreviation, i.description, i.type, i.units, systems1[i.system], baseunits);
      compoundunits.add(newComp);
    });
    conv.forEach(function (i) {
      if (baseunits[i.fromUnit] !== undefined) {
        newConv = new UnitConversions(baseunits[i.toUnit], baseunits[i.fromUnit], parseFloat(i.shift), parseFloat(i.factor));
        newConvInv = new UnitConversions(baseunits[i.fromUnit], baseunits[i.toUnit], -parseFloat(i.shift) / (parseFloat(i.factor)), 1.0 / parseFloat(i.factor));
        systems1[i.system].add(newConv, i.type);
        console.log('Adding inverse too ??!?!?1122');
        console.log(baseunits[i.toUnit].system)
        baseunits[i.toUnit].system.add(newConvInv,i.type);
      } else if (compoundunits[i.fromUnit] !== undefined) {
        convertComp(compoundunits[i.toUnit], compoundunits[i.fromUnit], 1.0);
      } else {
        console.log(`A conversion references an invalid unit: ${i.fromUnit} Or, ${i.toUnit}`);
      }
    });
    console.log('End of init......------------............')
    console.log(systems1);
  },

  Solve(string, systemname) {
    return solve(new Expression(string), systems1, baseunits, compoundunits, systemname);
  },

};
