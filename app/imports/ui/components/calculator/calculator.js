import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js';

import { Base } from '../../../../client/base.js';
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

  'click #equals_button'(event) {
  	  let cat = document.getElementById('calculator_display').innerText;	
  	  console.log(cat);
  	  var t = Base.Solve(cat).toString();
  	  if (t)
  	  	document.getElementById('calculator_display').innerText = t; 	  
  	  else console.log("Error:" + t);
  },
});











