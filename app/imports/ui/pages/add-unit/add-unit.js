import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { BaseUnits } from '../../../api/base/base.js';
import { Systems } from '../../../api/systems/systems.js';

import './add-unit.html';
import '../../stylesheets/add.css';

Template.add_unit.onCreated(function addOnCreated() {
  Meteor.subscribe('BaseUnits');
  Meteor.subscribe('Systems');
});


/* eslint-disable no-unused-vars */

Template.add_unit.helpers({
  baseUnitsCollection() {
    return BaseUnits;
  },
  systemsCollection() {
    return Systems.find();
  },
});

Template.add_unit.events({
  'submit .new_unit'(event) {
    event.preventDefault();

    const name = event.target.unit_name.value;
    const abbr = event.target.unit_abbrev.value;
    const desc = event.target.description_text.value;
    const type = event.target.type.value;
    const system = event.target.to_system.value;

    BaseUnits.insert({
      name: name,
      abbreviation: abbr,
      description: desc,
      type: type,
      system: system,
    });

    FlowRouter.go('App.home');
  },
});
