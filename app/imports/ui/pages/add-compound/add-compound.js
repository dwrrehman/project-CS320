import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { compoundUnits } from '../../../api/compound/compound.js';
import { Systems } from '../../../api/systems/systems.js';

import './add-compound.html';

Template.add_unit.onCreated(function addOnCreated() {
  Meteor.subscribe('CompoundUnits');
  Meteor.subscribe('Systems');
});


/* eslint-disable no-unused-vars */

Template.add_compound.helpers({
  compoundUnitsCollection() {
    return compoundUnits;
  },
  systemsCollection() {
    return Systems.find();
  },
});

Template.add_compound.events({
  'submit .new_compound'(event) {
    event.preventDefault();

    const name = event.target.unit_name.value;
    const abbr = event.target.unit_abbrev.value;
    const desc = event.target.description_text.value;
    const type = event.target.type.value;
    const system = event.target.system.value;
    const units = event.target.units.value;

    compoundUnits.insert({
      name: name,
      abbreviation: abbr,
      description: desc,
      type: type,
      system: system,
      units: units,
    });

    FlowRouter.go('App.home');
  },
});
