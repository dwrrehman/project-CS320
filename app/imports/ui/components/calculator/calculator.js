import './calculator.html';
import '../../stylesheets/calculator.css';
import { Template } from 'meteor/templating';
import { Systems } from '../../../api/systems/systems.js'

Template.calculator.helpers({
	SystemsCollection() {
		return Systems.find();
	}
});