import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { BaseUnits } from '../../../api/base/base.js';

import './add.html';

Template.add.onCreated(function addOnCreated() {
  Meteor.subscribe('BaseUnits');
});

/* eslint-disable no-unused-vars */

/**
 * After successful addition of a new Contacts document, go to List page.
 * See: https://github.com/aldeed/meteor-autoform#callbackshooks
 */
AutoForm.hooks({
  AddBaseUnitForm: {
    /**
     * After successful form submission, go to App.home.
     * @param formType The form.
     * @param result The result of form submission.
     */
    onSuccess: function onSuccess(formType, result) {
      FlowRouter.go('App.home');
    },
  },
});

Template.add.helpers({
  baseUnitsCollection() {
    return BaseUnits;
  },
});
