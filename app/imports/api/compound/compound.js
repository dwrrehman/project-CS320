import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const compoundUnits = new Mongo.Collection('CompoundUnits');
compoundUnits.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
});

export const CompoundUnitsSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    autoform: {
      placeholder: 'Name',
    },
  },
  abbreviation: {
    label: 'Abbreviation',
    type: String,
    autoform: {
      placeholder: 'Abbreviation',
    },
  },
  description: {
    label: 'Description',
    type: String,
    autoform: {
      placeholder: 'Description',
    },
  },
  type: {
    label: 'Type',
    type: String,
    autoform: {
      placeholder: 'Type',
    },
  },
  system: {
    label: 'System',
    type: String,
    autoform: {
      placeholder: 'System Name',
    },
  },
  units: {
    label: 'Units',
    type: String,
    autoform: {
      placeholder: 'Unit combination',
    },
  },
});

compoundUnits.attachSchema(CompoundUnitsSchema);

if (Meteor.isServer) {
  Meteor.publish('CompoundUnits', function compoundUnitsPublication() {
    return compoundUnits.find();
  });
}