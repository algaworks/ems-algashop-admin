import { HttpParams } from "@angular/common/http";

export interface UserModel {
  id: number;
  name: string;
  email: string;
  type: UserType;

  //read only
  createdAt: Date;
  updatedAt: Date;
}

export class UserFilter {
  order?: string;
  direction?: string;
  page: number = 0;
  size: number = 10;
  sort: string = 'name,ASC';

  email?: string;
  type?: any;
  createdAtFrom?: string;
  createdAtTo?: string;

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

      if(this.type){
        params = params.set('type', this.type);
      }

      return params;
  }
}

export class UserInput {
  constructor(
      public name: string,
      public email: string,
      public type: UserType
  ) {}
}

export enum UserType {
  MANAGER = "Manager",
  CUSTOMER = "Customer",
}
