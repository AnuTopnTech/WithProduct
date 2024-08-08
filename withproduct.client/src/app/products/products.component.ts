import { Component, OnInit, ViewChild } from '@angular/core';
import { Products } from './products';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductsService } from './products.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'quantity', 'title', 'category', 'price', 'image',
  'actions'];
  public products!: MatTableDataSource<Products>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string ="title";
  public defaultSortOrder: "asc" | "desc" = "asc";

  defaultFilterColumn: string ="title";
  filterQuery?: string;

  filterTextChanged: Subject<string> = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.loadData();
  }
  onFilterTextChanged(filterText: string) {
    if (!this.filterTextChanged.observed) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }

  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }
  getData(event: PageEvent) {
    var sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultSortColumn;
    var sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;
    var filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      : null;
    var filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;
    this.productsService.getData(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery).subscribe( result => {
      //console.log(result);
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.products = new MatTableDataSource<Products>(result.data);
       
      },
       error => console.error('Error fetching Products', error)

    );
  }
  deleteProduct(id: number) {
    if (confirm('Are sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).pipe(tap(response => console.log("Delete response"))).
        subscribe(() => {
        this.loadData();

      },
        (error: any) => console.error('Error deleting product', error)
      );
    }

  }
}
