import {colors} from '@angular/cli/utilities/color';

export interface ProductModelserver{
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  author: string;
}
export interface  ServerResponse{
  count: number;
  products: ProductModelserver[];
}
