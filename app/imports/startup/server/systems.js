import { _ } from 'meteor/underscore';
import { Systems } from '../../api/systems/systems.js';

/**
 * A list of Systems to pre-fill the Collection.
 * @type {*[]}
 */
const systemSeeds = [
  {
    name: 'Metric',
    length: 'm',
    mass: 'kg',
    time: 's',
    charge: 'something',
    temperature: 'C',
    brightness: 'something',
  },
  {
    name: 'Imperial',
    length: 'foot',
    mass: 'lbs',
    time: 's',
    charge: 'something',
    temperature: 'F',
    brightness: 'something',
  },
];

/**
 * Initialize the BaseUnits collection if empty with seed data.
 */
if (Systems.find().count() === 0) {
  _.each(systemSeeds, function seedSystems(system) {
    Systems.insert(system);
  });
}
