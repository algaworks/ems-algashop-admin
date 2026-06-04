import { HttpParams } from "@angular/common/http";

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    page: number;
}

export class PageRequest {
    constructor(
        public order?: string,
        public direction?: string,
        public pageNumber: number = 0,
        public recordsPerPage: number = 20,
    ) {

    }

    applyParams(params?: any) {
        if (!params) {
            return;
        }

        if (params.direction) {
            this.direction = params.direction
        }

        if (params.recordsPerPage) {
            this.recordsPerPage = params.recordsPerPage
        }

        if (params.order) {
            this.order = params.order
        }

        if (params.pageNumber) {
            this.pageNumber = params.pageNumber
        }
    }

    applySort(sortField?: string, sortOrder: number = 1) {
        this.order = sortField;
        this.direction = sortOrder == 1 ? 'ASC' : 'DESC';
    }
}

export class ProductFilter {
    order?: string;
    direction?: string;
    page: number = 0;
    size: number = 10;
    sort: string = 'name,ASC';

    enabled?: boolean;
    inventoryStatus?: string;
    hasDiscount?: boolean;
    term?: string;
    categoriesId?: string[];
    priceFrom?: number;
    priceTo?: number;
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

    isEmpty() : boolean {
      if (this.term) {
        return false
      }

      return true;
    }

    isNotEmpty() : boolean {
      return !this.isEmpty();
    }

    toQueryParams() : HttpParams {
        let params = new HttpParams()
            .set('page', this.page)
            .set('size', this.size);

        if(this.term) {
            params = params.set('term', this.term);
        }
        if(this.sort) {
            params = params.set('sort', this.sort);
        }
        if(this.enabled) {
          params = params.set('enabled', this.enabled);
        }
        if(this.hasDiscount) {
          params = params.set('hasDiscount', this.hasDiscount);
        }
        if(this.priceFrom) {
          params = params.set('priceFrom', this.priceFrom);
        }
        if(this.priceTo) {
          params = params.set('priceTo', this.priceTo);
        }
        if(this.categoriesId) {
          params = params.set('categoriesId', this.categoriesId.join(","));
        }

        return params;
    }
}

export interface ProductModel {
    id: number;
    name: string;
    brand: string;
    enabled: boolean;
    regularPrice: number;
    salePrice: number;
    hasDiscount: boolean;
    category: CategoryModel;
    mainImage: ImageModel;
    description: string;
    quantityInStock: number;

    //read only
    addedAt: Date;
    updatedAt: Date;
    inStock: boolean;
    discountPercentageRounded: number;
    slug: string;
    price: number;
}

export interface ImageModel {
    id: number;
    url: string;
}

export interface CategoryModel {
    id: string;
    name: string;
}

export enum ProductInventoryStatus {
    OUT_OF_STOCK = "Sem estoque",
    IN_STOCK = "Com estoque",
}


export class ProductInput {
    constructor(
        public name: string,
        public quantityInStock: number,
        public brand: string,
        public enabled: boolean,
        public regularPrice: number,
        public salePrice: number,
        public description: string,
        public categoryId: number
    ) {}
}

export class UploadRequestInput {
    constructor(
      public fileName: string,
      public contentLength: number
    ) {}
}

export class UploadRequestInputResult {
    constructor(
      public uploadSignedUrl: string,
      public imageId: number
    ) {}
}

export class ProductImagesInput {
    constructor(
        public ids: number[] = []
    ) {}
}


