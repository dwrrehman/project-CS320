import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { conversions } from '../../../api/conversion/conversion.js';
import { Systems } from '../../../api/systems/systems.js';

import './add-conversion.html';

Template.add_conversion.onCreated(function addOnCreated() {
  Meteor.subscribe('Conversion');
  Meteor.subscribe('Systems');
});

/* eslint-disable no-unused-vars */

Template.add_conversion.helpers({
  conversionsCollection() {
    return conversions;
  },
  systemsCollection() {
    return Systems.find();
  },
});

Template.add_conversion.events({
  'submit .new_conversion'(event) {
    event.preventDefault();

    const type = event.target.type.value;
    const system = event.target.system.value;
    const to = event.target.to_unit.value;
    const from = event.target.from_unit.value;
    const factor = event.target.factor.value;
    const shift = event.target.shift_amount.value;

    conversions.insert({
      type: type,
      system: system,
      toUnit: to,
      fromUnit: from,
      factor: factor,
      shift: shift,
    });

    FlowRouter.go('App.home');
  },
});
