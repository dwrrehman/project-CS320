import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const BaseUnits = new Mongo.Collection('BaseUnits');

export const BaseUnitsSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Name',
    },
  },
  abbreviation: {
    label: 'Abbreviation',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Abbreviation',
    },
  },
  description: {
    label: 'Description',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Description',
    },
  },
  type: {
    label: 'Type',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Type',
    },
  },
  system: {
    label: 'System',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'System',
    },
  },
});

BaseUnits.attachSchema(BaseUnitsSchema);

if (Meteor.isServer) {
  Meteor.publish('BaseUnits', function baseUnitsPublication() {
    return BaseUnits.find();
  });
}
