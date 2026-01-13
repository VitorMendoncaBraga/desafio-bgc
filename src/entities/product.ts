
export type Categories =
    | 'books'
    | 'fashion'
    | 'kitchen'
    | 'home'
    | 'appliances'
    | 'electronics'
    | 'sports'
    | 'videogames'
    | 'furniture'
    | 'pet-products';

interface IProduct {
    id: string,
    category: Categories
    dataScraping: string,
    image: string,
    link: string,
    price: string,
    ranking: number
    title: string
}

export class Product {
  private Id: string;
  private Category: Categories;
  private DataScraping: string;
  private Image: string;
  private Link: string;
  private Price: string;
  private Ranking: number;
  private Title: string;

  constructor(data: IProduct) {
    this.Id = data.id;
    this.Category = data.category;
    this.DataScraping = data.dataScraping;
    this.Image = data.image;
    this.Link = data.link;
    this.Price = data.price;
    this.Ranking = data.ranking;
    this.Title = data.title;
  }

  // Getters
  get id(): string {
    return this.Id;
  }

  get category(): Categories {
    return this.Category;
  }

  get dataScraping(): string {
    return this.DataScraping;
  }

  get image(): string {
    return this.Image;
  }

  get link(): string {
    return this.Link;
  }

  get price(): string {
    return this.Price;
  }

  get ranking(): number {
    return this.Ranking;
  }

  get title(): string {
    return this.Title;
  }

}