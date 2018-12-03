import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from "meteor/meteor";
import { BaseUnits } from '../base/base';

SimpleSchema.extendOptions(['autoform']);

const Systems = new Mongo.Collection('Systems');

const SystemsSchema = new SimpleSchema({
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
    type: String,
    optional: false,
    autoform: {
      placeholder: 'Length',
    },
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

if (Meteor.isServer) {
  Meteor.publish('Systems', function systemsPublication() {
    return Systems.find();
  });
}
