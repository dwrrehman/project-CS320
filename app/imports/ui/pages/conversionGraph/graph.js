import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { conversions } from '../../../api/conversion/conversion.js';
import { Systems } from '../../../api/systems/systems.js';
import { BaseUnits } from '../../../api/base/base';
import { compoundUnits } from '../../../api/compound/compound';
import { Base } from '../../../../client/base';
import './graph.html';
import '../../stylesheets/graph.css';
import { baseunits, compoundunits } from '../../../../client/base';

Template.list_conversions.onCreated(function addOnCreated() {
  Meteor.subscribe('Conversion');
  Meteor.subscribe('Systems');
  Meteor.subscribe('BaseUnits');
  Meteor.subscribe('CompoundUnits');
});

Template.list_conversions.onRendered(function addOnCreated() {
  const canvas = document.getElementsByClassName('conversionGraph');
  canvas[0].width = window.innerWidth;
  canvas[0].height = window.innerHeight;
});
/* eslint-disable no-unused-vars */

Template.list_conversions.helpers({
  conversionsCollection() {
    return conversions;
  },
  systemsCollection() {
    return Systems.find();
  },
  baseUnitsCollection() {
    BaseUnits.find();
  },
  compoundUnitsCollection() {
    return compoundUnits.find();
  },
  unitsCollection() {
    return compoundUnits.find().fetch().concat(BaseUnits.find().fetch());
  },
});
