import { HttpParams } from "@angular/common/http";

export interface OrderModel {
  id: number;
  code: string;
  customerId: string;
  shipping: PersonalInfo;
  billing: PersonalInfo;
  email: string;
  phone: string;
  totalItems: number;
  totalAmount: number;
  status: OrderStatus;
  placedAt: Date;
  updatedAt: Date;
  deliveredAt: Date;
  canceledAt: Date;
  paidAt: Date;
  refundedAt: Date;
  paymentMethod: PaymentMethodType;
  items: OrderItemModel[];
}
export interface OrderItemModel {
  productId: string
  name: string
  regularPrice: number
  salePrice: number
  hasDiscount: boolean
  quantity: number
  totalAmount: number
}

export class OrderFilter {
  order?: string;
  direction?: string;
  page: number = 0;
  size: number = 10;
  sort: string = 'code,ASC';

  status?: any;
  placedAtFrom?: Date;
  placedAtTo?: Date;
  totalAmountFrom?: number;
  totalAmountTo?: number;
  paymentMethod?: any;
  orderCode?: string;
  customerId?: string;

  constructor(data?: {}) {
    // this.applyParams(data);
  }

  applyParams(params?: any) {
      Object.assign(this, params);

      if(params?.status){
        this.status = params.status;
      }
      if(params?.paymentMethod){
        this.paymentMethod = params.paymentMethod;
      }
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
      if(this.status){
        params = params.set('status', this.status);
      }
      if(this.placedAtFrom){
        const formattedDate = new Date(this.placedAtFrom).toISOString();
        params = params.set('placedAtFrom', formattedDate);
      }
      if(this.placedAtTo){
        const formattedDate = new Date(this.placedAtTo).toISOString();
        params = params.set('placedAtTo', formattedDate);
      }
      if(this.totalAmountFrom){
        params = params.set('totalAmountFrom', this.totalAmountFrom);
      }
      if(this.totalAmountTo){
        params = params.set('totalAmountTo', this.totalAmountTo);
      }
      if(this.paymentMethod){
        params = params.set('paymentMethod', this.paymentMethod);
      }
      if(this.orderCode){
        params = params.set('code', this.orderCode);
      }

      return params;
  }
}

export enum OrderStatus {
  RECEIVED = "Received",
  APPROVED = "Approved",
  INVOICED = "Invoiced",
  READY = "Ready",
  PAID = "Paid",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLING = "Cancelling",
  CANCELED = "Canceled",
  REFUNDED = "Refunded",
}
export enum PaymentMethodType {
  PIX = "Pix",
  CREDIT_CARD = "Credit card",
  GATEWAY_BALANCE = "Gateway Balance"
}

export interface CustomerModel {
  id: number;
  fullName: string;
}

export interface PersonalInfo {
  fullName: string
  document: string
  phone: string
  address: AddressModel
}

export interface AddressModel {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}