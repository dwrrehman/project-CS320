import { _ } from 'meteor/underscore';
import { BaseUnits } from '../../api/base/base.js';

/**
 * A list of BaseUnits to pre-fill the Collection.
 * @type {*[]}
 */
const baseSeeds = [
  {
    name: 'Meter',
    abbreviation: 'm',
    description: 'Standard SI unit of length',
    type: 'length',
    conversion: {
      factor: 3.28084,
      shift: 0,
      to: 'Feet',
      from: 'Meter',
    },
    system: 'Metric',
  },
  {
    name: 'Foot',
    abbreviation: 'ft',
    description: 'Standard Imperial unit of length',
    type: 'length',
    conversion: {
      factor: 0.3048,
      shift: 0,
      to: 'Meter',
      from: 'Foot',
    },
    system: 'Imperial',
  },
];

/**
 * Initialize the BaseUnits collection if empty with seed data.
 */
if (BaseUnits.find().count() === 0) {
  _.each(baseSeeds, function seedBaseUnits(baseunit) {
    BaseUnits.insert(baseunit);
  });
}
