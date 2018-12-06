import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { conversions } from '../../../api/conversion/conversion.js';

import './add-conversion.html';

Template.add_conversion.onCreated(function addOnCreated() {
  Meteor.subscribe('conversions');
  Meteor.subscribe('Systems');
});

/* eslint-disable no-unused-vars */

Template.add_conversion.helpers({
  conversionsCollection() {
    return conversions;
  },
});
