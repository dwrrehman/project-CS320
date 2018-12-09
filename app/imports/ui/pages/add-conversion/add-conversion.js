import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { conversions } from '../../../api/conversion/conversion.js';
import { Systems } from '../../../api/systems/systems.js';
import { BaseUnits } from '../../../api/base/base';
import { compoundUnits } from '../../../api/compound/compound';
import { Base } from '../../../../client/base';
import './add-conversion.html';
import { baseunits, compoundunits } from '../../../../client/base';

Template.add_conversion.onCreated(function addOnCreated() {
  Meteor.subscribe('Conversion');
  Meteor.subscribe('Systems');
  Meteor.subscribe('BaseUnits');
  Meteor.subscribe('CompoundUnits');
});

/* eslint-disable no-unused-vars */

Template.add_conversion.helpers({
  conversionsCollection() {
    return conversions;
  },
  systemsCollection() {
    return Systems.find();
  },
  baseUnitsCollection(){
    BaseUnits.find();
  },
  compoundUnitsCollection(){
    return compoundUnits.find();
  },
  unitsCollection(){
    return compoundUnits.find().fetch().concat(BaseUnits.find().fetch());
  },
});

Template.add_conversion.events({
  'submit .new_conversion'(event) {
    event.preventDefault();

    const to = event.target.to_unit.value;
    const from = event.target.from_unit.value;
    let factor = event.target.factor.value;
    let shift = event.target.shift_amount.value;
    let baseflag = false;
    let compoundflag = false;
    let failure = false;
    if (baseunits[to] === undefined) {
      if (compoundunits[to] === undefined) {
        alert(`Invalid unit name: ${to}`);
        failure = true;
      } else {
        compoundflag = true;
      }
    } else {
      baseflag = true;
    }
    if (!failure) {
      if (baseunits[from] === undefined) {
        if (compoundunits[from] === undefined) {
          alert(`Invalid unit name: ${from}`);
        } else if (!compoundflag) {
          compoundflag = false;
          failure = true;
          alert('Conversions can not be defined between compound and base units.');
        }
      } else if (!baseflag) {
        failure = true;
        baseflag = false;
        alert('Conversions can not be defined between compound and base units.');
      }
    }
    if (from === to) {
      alert('Defining a conversion of a unit to itself is redundant');
      failure = true;
    }
    if (compoundflag){
      if (compoundunits[to].GivenType !== compoundunits[from].GivenType){
        alert('You are defining a conversion between units that have different types!');
        failure = true;
      }
    }else if (baseflag){
      if (baseunits[to].GivenType !== baseunits[from].GivenType){
        alert('You are defining a conversion between units that have different types!');
        failure = true;
      }
    }
    factor = Base.Solve(factor).quantity;
    shift = Base.Solve(shift).quantity;
    console.log(factor);
    console.log(shift);
    if (!failure) {
      conversions.insert({
        toUnit: to,
        fromUnit: from,
        factor: factor,
        shift: shift,
      });
      alert('Added Conversion.');
      FlowRouter.go('App.home');
    }
  },
});
