// NOTE: plant names with whitespace or punctuation must be in quotation marks
// Daisy is a valid key without quotes but 'Wild Rose' requires quotes
export const PlantImages = Object.freeze({
  // HEADERS
  Daisy: require('app/assets/images/Plant_Header.png'),
  Sunflower: require('app/assets/images/cartoon_top.png'),

  // BODIES
  Body: require('app/assets/images/Plant_Body.png'),
  'Long Body': require('app/assets/images/Plant_Body_Long.png'),
  Stem: require('app/assets/images/cartoon_stem.png'),

  // FOOTERS
  Clay: require('app/assets/images/cartoon_pot.png'),
  Terracotta: require('app/assets/images/terracotta.png'),
});

export interface IStoreItem {
  name: string;
  price: number;
}

// NOTE: name field in each item MUST match a key in PlantImages
// Name mismatches mean item will not get rendered, duplicate names cause duplicate render
export const PlantHeaders: ReadonlyArray<IStoreItem> = [
  {
    name: 'Daisy',
    price: 1.25,
  },
  {
    name: 'Sunflower',
    price: 1.25,
  },
];

export const PlantBodies: ReadonlyArray<IStoreItem> = [
  {
    name: 'Body',
    price: 1.25,
  },
  {
    name: 'Long Body',
    price: 2.50,
  },
  {
    name: 'Stem',
    price: 1.25,
  },
];

export const PlantFooters: ReadonlyArray<IStoreItem> = [
  {
    name: 'Clay',
    price: 1.25,
  },
  {
    name: 'Terracotta',
    price: 1.25,
  },
];
