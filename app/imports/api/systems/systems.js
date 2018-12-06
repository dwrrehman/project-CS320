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
});

Systems.attachSchema(SystemsSchema);

if (Meteor.isServer) {
  Meteor.publish('Systems', function systemsPublication() {
    return Systems.find();
  });
}
