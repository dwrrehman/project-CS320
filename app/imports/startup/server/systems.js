import { _ } from 'meteor/underscore';
import { Systems } from '../../api/systems/systems.js';

/**
 * A list of Systems to pre-fill the Collection.
 * @type {*[]}
 */
const systemSeeds = [
  {
    name: 'Metric',
  },
  {
    name: 'Imperial',
  },
];

/**
 * Initialize the Systems collection if empty with seed data.
 */
if (Systems.find().count() === 0) {
  _.each(systemSeeds, function seedSystems(system) {
    Systems.insert(system);
  });
}
