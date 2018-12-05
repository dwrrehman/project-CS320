import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Systems = new Mongo.Collection('Systems');

export const SystemsSchema = new SimpleSchema({
  name: {
    label: 'Name',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Name',
    },
  },
  length: {
    label: 'Length',
    type: Object,
    optional: false,
    blackbox: true,
  },
  mass: {
    label: 'Mass',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Mass',
    },
  },
  time: {
    label: 'Time',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Time',
    },
  },
  charge: {
    label: 'Charge',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Charge',
    },
  },
  temperature: {
    label: 'Temperature',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Temperature',
    },
  },
  brightness: {
    label: 'Brightness',
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Brightnesss',
    },
  },
});

Systems.attachSchema(SystemsSchema);

if (Meteor.isServer) {
  Meteor.publish('Systems', function systemsPublication() {
    return Systems.find();
  });
}
