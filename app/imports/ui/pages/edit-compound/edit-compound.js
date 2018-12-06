import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { compoundUnits } from '../../../api/compound/compound.js';
import { Systems } from '../../../api/systems/systems.js';

import './edit-compound.html';

Template.edit_compound.onCreated(function addOnCreated() {
  Meteor.subscribe('CompoundUnits');
  Meteor.subscribe('Systems');
});


/* eslint-disable no-unused-vars */

Template.edit_compound.helpers({
  compoundUnitsCollection() {
    return compoundUnits;
  },
  systemsCollection() {
    return Systems.find();
  },
  getUnit() {
    return compoundUnits.findOne(FlowRouter.getParam('_id'));
  },
});

Template.edit_compound.events({
  'submit .edit_compound'(event) {
    event.preventDefault();

    const name = event.target.unit_name.value;
    const abbr = event.target.unit_abbrev.value;
    const desc = event.target.description_text.value;
    const type = event.target.type.value;
    const system = event.target.to_system.value;
    const units = event.target.units.value;

    compoundUnits.update({ _id: FlowRouter.getParam('_id') }, {
      $set: {
        name: name,
        abbreviation: abbr,
        description: desc,
        type: type,
        system: system,
        units: units,
      },

    });

    FlowRouter.go('App.list');
  },
});
