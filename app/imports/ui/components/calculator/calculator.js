import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js';

import { Base } from '../../../../client/base.js';
import './calculator.html';
import '../../stylesheets/calculator.css';


Template.calculator.onCreated(function addOnCreated() {
  Meteor.subscribe('Systems');
  Base.Init();
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
  	  let input = document.getElementById('calculator_display').innerText;	
  	  let desiredsystem = document.getElementById('to_system').value;
  	  console.log("Received Input: " + input);
  	  console.log("Received Desired System: " + desiredsystem);
  	  var t = Base.Solve(input, desiredsystem).toString();
  	  if (t)
  	  	document.getElementById('calculator_display').innerText = t; 	  
  	  else console.log("Error:" + t);
  },

  'click .thbutton'(event) {
  	  document.getElementById('calculator_display').innerText += receive('Found');
  },

  'click #0button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('0');
  },
  'click #1button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('1');
  },
  'click #2button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('2');
  },
  'click #3button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('3');
  },
  'click #4button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('4');
  },
  'click #5button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('5');
  },
  'click #6button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('6');
  },
  'click #7button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('7');
  },
  'click #8button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('8');
  },
  'click #9button'(event) {
  	  document.getElementById('calculator_display').innerText += receive('9');
  },
  'click #dotbutton'(event) {
  	  document.getElementById('calculator_display').innerText += receive('.');
  },
});











