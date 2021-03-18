import {ProductModelserver} from './product.model';

export interface CartModelServer{
  total: number;
  data: [{
    product: ProductModelserver,
    numInCart: number
  }];

}

export interface CartModelPublic {
  total: number;
  prodData: [
    {
      id: number,
      incart: number
    }
  ];

}
