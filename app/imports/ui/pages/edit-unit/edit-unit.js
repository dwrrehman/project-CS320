import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { BaseUnits } from '../../../api/base/base.js';
import { Systems } from '../../../api/systems/systems.js';

import './edit-unit.html';

Template.edit_unit.onCreated(function addOnCreated() {
  Meteor.subscribe('BaseUnits');
  Meteor.subscribe('Systems');
});


/* eslint-disable no-unused-vars */

Template.edit_unit.helpers({
  baseUnitsCollection() {
    return BaseUnits;
  },
  systemsCollection() {
    return Systems.find();
  },
  getUnit() {
    return BaseUnits.findOne(FlowRouter.getParam('_id'));
  },
});

Template.edit_unit.events({
  'submit .edit_unit'(event) {
    event.preventDefault();

    const name = event.target.unit_name.value;
    const abbr = event.target.unit_abbrev.value;
    const desc = event.target.description_text.value;
    const type = event.target.type.value;
    const system = event.target.to_system.value;

    BaseUnits.update({ _id: FlowRouter.getParam('_id') }, {
      $set: {
        name: name,
        abbreviation: abbr,
        description: desc,
        type: type,
        system: system,
      },

    });

    FlowRouter.go('App.list');
  },
});
