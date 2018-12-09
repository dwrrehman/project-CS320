import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const conversions = new Mongo.Collection('Conversion');
conversions.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
});

export const ConversionSchema = new SimpleSchema({
  toUnit: {
    label: 'ToUnit',
    type: String,
    autoform: {
      placeholder: 'To which unit',
    },
  },
  fromUnit: {
    label: 'FromUnit',
    type: String,
    autoform: {
      placeholder: 'From which unit',
    },
  },
  factor: {
    label: 'Factor',
    type: String,
    autoform: {
      placeholder: 'Times',
    },
  },
  shift: {
    label: 'Shift',
    type: String,
    autoform: {
      placeholder: 'Plus',
    },
  },
});

conversions.attachSchema(ConversionSchema);

if (Meteor.isServer) {
  Meteor.publish('Conversion', function conversionPublication() {
    return conversions.find();
  });
}