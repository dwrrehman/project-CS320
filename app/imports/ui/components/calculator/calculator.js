import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js';
import '../../../../client/base.js';

import './calculator.html';
import '../../stylesheets/calculator.css';

Template.calculator.onCreated(function addOnCreated() {
  Meteor.subscribe('Systems');
});

Template.calculator.helpers({
  systemsCollection() {
    return Systems.find();
  },
  receive(string) {
    let displayString = '';

    if (string.length === 1) {
      displayString += string;
    } else {
      if (string === 'clear') {
        displayString = '';
      } else {
        displayString = '';
      }
    }
    return displayString;
  },
});

Template.calculator.events({
  'click .clearbutton'(event) {
    console.log('SUCCESS');
  },
});
