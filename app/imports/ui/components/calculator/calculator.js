import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js';

import { Base } from '../../../../client/base.js';
import './calculator.html';
import '../../stylesheets/calculator.css';

Template.calculator.onCreated(function addOnCreated(){
  Base.Init();
});


Template.calculator.onRendered = function() {
  if (!Base.shown_welcome_message) {
    const message = 'Welcome to the Calculation Utility.';
    var el = this.find("#calculator_display");
    if (el) el.innerText = message;
    Base.shown_welcome_message = true;
  }
  Base.Init();
};

Template.calculator.helpers({
  systemsCollection() {
    return Systems.find();
  },
});

Template.calculator.events({
	'keydown #calculator_display'(event) {
		if (event.keyCode == 13) {
      Base.Init(); /// this is bad, but tbh its the only thing that works right now, to populate the local database.
      event.preventDefault(); // Prevent the text box from recieving a new line.
			let input = document.getElementById('calculator_display').innerText;
  		let desiredsystem = document.getElementById('to_system').value;
  		console.log("Received Input: " + input);
  		console.log("Received Desired System: " + desiredsystem);
  		var t = Base.Solve(input, desiredsystem);
  		if (t) {
  		  document.getElementById('calculator_display').innerText = t.toString();
      }
  		else alert("Invalid input format!");
		}
	},

  'click .clearbutton'(event) {
    Base.Init(); /// this is bad, but tbh its the only thing that works right now, to populate the local database.
    document.getElementById('calculator_display').innerText = '';
  },

  'click #addsystem_button'(event) {    
    var system_name = prompt('Please Provide the System Name: ');
    if (system_name) { 
        Systems.insert({name: system_name});
        alert('Successfully added system.');
    }  
  },

  'click #equals_button'(event) {
      Base.Init(); /// this is bad, but tbh its the only thing that works right now, to populate the local database.
  	  let input = document.getElementById('calculator_display').innerText;
  	  let desiredsystem = document.getElementById('to_system').value;
  	  console.log("Received Input: " + input);
  	  console.log("Received Desired System: " + desiredsystem);
  	  var t = Base.Solve(input, desiredsystem)  	  
  	  if (t) document.getElementById('calculator_display').innerText = t.toString();
  	  else alert("Invalid input format!");
  },

  'click #0button'(event) {
  	  document.getElementById('calculator_display').innerText += '0';
  },
  'click #1button'(event) {
  	  document.getElementById('calculator_display').innerText += '1';
  },
  'click #2button'(event) {
  	  document.getElementById('calculator_display').innerText += '2';
  },
  'click #3button'(event) {
  	  document.getElementById('calculator_display').innerText += '3';
  },
  'click #4button'(event) {
  	  document.getElementById('calculator_display').innerText += '4';
  },
  'click #5button'(event) {
  	  document.getElementById('calculator_display').innerText += '5';
  },
  'click #6button'(event) {
  	  document.getElementById('calculator_display').innerText += '6';
  },
  'click #7button'(event) {
  	  document.getElementById('calculator_display').innerText += '7';
  },
  'click #8button'(event) {
  	  document.getElementById('calculator_display').innerText += '8';
  },
  'click #9button'(event) {
  	  document.getElementById('calculator_display').innerText += '9';
  },
  'click #dotbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '.';
  },





  'click #addbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '+';
  },
  'click #subbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '-';
  },
  'click #mulbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '*';
  },
  'click #divbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '/';
  },
  'click #expbutton'(event) {
  	  document.getElementById('calculator_display').innerText += '^';
  },
  'click #op1button'(event) {
  	  document.getElementById('calculator_display').innerText += '(';
  },
  'click #cl1button'(event) {
  	  document.getElementById('calculator_display').innerText += ')';
  },
  'click #op2button'(event) {
  	  document.getElementById('calculator_display').innerText += '[';
  },
  'click #cl2button'(event) {
  	  document.getElementById('calculator_display').innerText += ']';
  },
  'click #op3button'(event) {
  	  document.getElementById('calculator_display').innerText += '<';
  },
  'click #cl3button'(event) {
  	  document.getElementById('calculator_display').innerText += '>';
  },
  'click #ebutton'(event) {
  	  document.getElementById('calculator_display').innerText += '{Pi}';
  },
  'click #pibutton'(event) {
  	  document.getElementById('calculator_display').innerText += '{e}';
  },



  'click #mbutton'(event) {
  	  document.getElementById('calculator_display').innerText += 'm';
  },
  'click #sbutton'(event) {
  	  document.getElementById('calculator_display').innerText += 's';
  },
  'click #kgbutton'(event) {
  	  document.getElementById('calculator_display').innerText += 'kg';
  },
  'click #Nbutton'(event) {
  	  document.getElementById('calculator_display').innerText += 'N';
  },


});











