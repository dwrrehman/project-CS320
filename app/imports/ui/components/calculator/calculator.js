import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js';
import { BASE } from '../../../../client/base.js';

import './calculator.html';
import '../../stylesheets/calculator.css';

Template.calculator.onCreated(function addOnCreated() {
  Meteor.subscribe('Systems');
});

Template.calculator.helpers({
  systemsCollection() {
    return Systems.find();
  },
  solve(string) {
  	BASE.solve(string, BASE.systems1, BASE.baseunits, BASE.compoundunits);
  }
});


