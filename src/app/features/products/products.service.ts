import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Page, ProductFilter, ProductModel, ProductInput, ImageModel, UploadRequestInput, UploadRequestInputResult, ProductImagesInput, CategoryModel } from 'src/app/core/models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private url: string;

    constructor(private http: HttpClient) {
      this.url = `${environment.apiUrl}/api/v1/products`;
    }

    filter(filter: ProductFilter = new ProductFilter()): Observable<Page<ProductModel>> {
        let params = filter.toQueryParams();
        return this.http.get<Page<ProductModel>>(`${this.url}`, { params });
    }

    getOne(productId: number): Observable<ProductModel> {
        return this.http.get<ProductModel>(`${this.url}/${productId}`);
    }

    create(productInput: ProductInput): Observable<ProductModel> {
        return this.http.post<ProductModel>(`${this.url}`, productInput);
    }

    update(productId: number, productInput: ProductInput): Observable<ProductModel> {
        return this.http.put<ProductModel>(`${this.url}/${productId}`, productInput)
    }

    getImages(productId: number) : Observable<ImageModel[]> {
        return this.http.get<ImageModel[]>(`${this.url}/${productId}/images`);
    }

    makeImageAsPrimary(productId: number, imageId: number) : Observable<void> {
        return this.http.put<void>(`${this.url}/${productId}/images/${imageId}/primary`, {});
    }

    deleteImage(productId: number, imageId: number) : Observable<void> {
        return this.http.delete<void>(`${this.url}/${productId}/images/${imageId}`, {});
    }

    requestUpload(productId: number, input: UploadRequestInput) : Observable<UploadRequestInputResult> {
        return this.http.post<UploadRequestInputResult>(`${this.url}/${productId}/images`, input);
    }

    addImageToProduct(productId: number, imageId: number) : Observable<UploadRequestInputResult> {
        return this.http.put<UploadRequestInputResult>(`${this.url}/${productId}/images/${imageId}/permanent`, {});
    }

    getCategories(): Observable<Page<CategoryModel>> {
        return this.http.get<Page<CategoryModel>>(`${environment.apiUrl}/api/v1/categories`);
    }
}
