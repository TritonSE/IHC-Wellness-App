// NOTE: plant names with whitespace or punctuation must be in quotation marks
// Daisy is a valid key without quotes but 'Wild Rose' requires quotes
export const PlantImages = Object.freeze({
  // HEADERS
  // Daisy: require('app/assets/images/Plant_Header.png'),
  Fern: require('app/assets/images/cartoon_top.png'),
  Carnation: require("app/assets/images/_top_carnation.png"),
  Sunflower: require("app/assets/images/_top_sunflower.png"),
  redRose: require("app/assets/images/_top_red_rose.png"),

  // BODIES
  Body: require("app/assets/images/Plant_Body.png"),
  // Body: require('app/assets/images/_mid_stem.png'),
  "Long Body": require("app/assets/images/Plant_Body_Long.png"),
  Stem: require("app/assets/images/cartoon_stem.png"),

  // FOOTERS
  Clay: require("app/assets/images/cartoon_pot.png"),
  Terracotta: require("app/assets/images/terracotta.png"),
  linedVase: require("app/assets/images/_bottom_lined.png"),
  redPot: require("app/assets/images/_bottom_red.png"),
  standardPot: require("app/assets/images/_bottom_pot.png")
});

export interface IStoreItem {
  name: string;
  price: number;
}

// NOTE: name field in each item MUST match a key in PlantImages
// Name mismatches mean item will not get rendered, duplicate names cause duplicate render
export const PlantHeaders: ReadonlyArray<IStoreItem> = [
  /*
  {
    name: 'Daisy',
    price: 1.25,
  },
  */
  {
    name: "Sunflower",
    price: 1.25
  },

  {
    name: "Carnation",
    price: 1.25
  },
  {
    name: "redRose",
    price: 1.25
  }
];

export const PlantBodies: ReadonlyArray<IStoreItem> = [
  {
    name: "Body",
    price: 1.25
  },
  {
    name: "Long Body",
    price: 2.5
  },
  {
    name: "Stem",
    price: 1.25
  }
];

export const PlantFooters: ReadonlyArray<IStoreItem> = [
  {
    name: "Clay",
    price: 1.25
  },
  {
    name: "Terracotta",
    price: 1.25
  },
  {
    name: "linedVase",
    price: 1.25
  },
  {
    name: "redPot",
    price: 1.25
  },
  {
    name: "standardPot",
    price: 1.25
  }
];
