import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const BaseUnits = new Mongo.Collection('BaseUnits');
BaseUnits.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
});

export const BaseUnitsSchema = new SimpleSchema({
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
  },
});

BaseUnits.attachSchema(BaseUnitsSchema);

if (Meteor.isServer) {
  Meteor.publish('BaseUnits', function baseUnitsPublication() {
    return BaseUnits.find();
  });
}
