import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { BaseUnits } from '../../../api/base/base.js';
import { compoundUnits } from '../../../api/compound/compound.js';

import './list.html';

Template.list.onCreated(function listOnCreated() {
  Meteor.subscribe('BaseUnits');
  Meteor.subscribe('CompoundUnits');
});

Template.list.helpers({
  baseUnitsList() {
    return BaseUnits.find();
  },

  compoundUnitsList() {
    return compoundUnits.find();
  },
});
