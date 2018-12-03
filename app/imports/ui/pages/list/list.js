import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { BaseUnits } from '../../../api/base/base';

import './list.html';

Template.list.onCreated(function listOnCreated() {
  Meteor.subscribe('BaseUnits');
});

Template.list.helpers({
  baseUnitsList() {
    return BaseUnits.find();
  },
});
