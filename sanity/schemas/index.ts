import type { SchemaTypeDefinition } from 'sanity';
import { brandType } from './brand';
import { vehicleModelType } from './vehicleModel';
import { productType } from './product';
import { bookingType } from './booking';

export const schemaTypes: SchemaTypeDefinition[] = [
  brandType,
  vehicleModelType,
  productType,
  bookingType,
];
