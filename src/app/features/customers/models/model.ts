import { HttpParams } from "@angular/common/http";

export interface CustomerModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  document: string;
  loyaltyPoints?: number;
  registeredAt?: string;
  archivedAt?: string;
  promotionNotificationsAllowed: boolean;
  archived?: boolean;
  address?: CustomerAddressModel;
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
  sort: string = 'REGISTERED_AT';

  firstName?: string;
  email?: string;

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
      if(this.firstName){
        params = params.set('firstName', this.firstName);
      }

      const [property, direction = 'ASC'] = this.sort?.split(',') || [];
      if (property) {
        params = params
          .set('sortByProperty', property)
          .set('sortDirection', direction);
      }

      return params;
  }
}
