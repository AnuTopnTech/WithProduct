import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base-form/base.service';
import { Observable } from 'rxjs';
import { Products } from './products';


@Injectable({
  providedIn: 'root',
})

export class ProductsService extends BaseService<Products>{
  
 
  constructor(http: HttpClient) {
    super(http);
  }
  getData(pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<ApiResult<Products>> {
    var url = this.getUrl("api/products");
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult<Products>>(url, { params });
  }
  get(id: number): Observable<Products> {
    var url = this.getUrl("api/products/" + id);
    return this.http.get<Products>(url);
  }
  put(item: Products): Observable<Products> {
    var url = this.getUrl("api/products/" + item.id);
    return this.http.put<Products>(url, item);
  }

  post(item: Products): Observable<Products> {
    var url = this.getUrl("api/products");
    return this.http.post<Products>(url, item);
  }
  deleteProduct(id: number): Observable<Products> {
    var url = this.getUrl("api/products/"+ id);
    return this.http.delete<Products>(url);
  }
}
