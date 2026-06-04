import { HttpParams } from "@angular/common/http";

export interface CustomerModel {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date;
  document: string;
  allowPromotionNotifications: boolean;
  address: CustomerAddressModel;
}
export interface CustomerAddressModel {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;

}
export class CustomerFilter {
  order?: string;
  direction?: string;
  page: number = 0;
  size: number = 10;
  sort: string = 'fullName,ASC';

  email?: string;
  document?: string;

  constructor(data?: {}) {
    // this.applyParams(data);
  }

  applyParams(params?: any) {
      Object.assign(this, params);
  }

  applyPage(params?: any) {
      if (!params) {
          return;
      }

      if (params.direction) {
          this.direction = params.direction
      }

      if (params.size) {
          this.size = params.size
      }

      if (params.order) {
          this.order = params.order
      }

      if (params.page) {
          this.page = params.page
      }
  }

  toQueryParams() : HttpParams {
      let params = new HttpParams()
          .set('page', this.page)
          .set('size', this.size);

      if(this.sort) {
          params = params.set('sort', this.sort);
      }

      if(this.email){
        params = params.set('email', this.email);
      }
      if(this.document){
        params = params.set('document', this.document);
      }

      return params;
  }
}

export class CustomerInput {
  constructor(
      public fullName: string,
      public email: string,
      public phone: string,
      public bornOn: Date,
      public document: string,
      public allowPromotionNotifications: boolean,
      public address: CustomerAddressInput,
  ) {}
}

export class CustomerAddressInput {
  constructor(
    public street: string,
    public number: string,
    public complement: string,
    public neighborhood: string,
    public city: string,
    public state: string,
    public zipCode: string,
) {}
}
