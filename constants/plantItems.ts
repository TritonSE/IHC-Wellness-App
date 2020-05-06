export interface IStoreItem {
  img: string;
  name: string;
  price: number;
}

export const plantHeaders: IStoreItem[] = [
  {
    img: 'terracotta.png',
    name: 'sunflower',
    price: 1.25,
  },
  {
    img: 'terracotta.png',
    name: 'daisy',
    price: 1.25,
  },
];

export const plantBodyItems: IStoreItem[] = [
  {
    img: 'terracotta.png',
    name: 'long',
    price: 1.25,
  },
  {
    img: 'terracotta.png',
    name: 'short',
    price: 1.25,
  },
];

export const plantFooters: IStoreItem[] = [
  {
    img: 'terracotta.png',
    name: 'terracotta',
    price: 1.25,
  },
  {
    img: 'terracotta.png',
    name: 'clay',
    price: 1.25,
  },
];
