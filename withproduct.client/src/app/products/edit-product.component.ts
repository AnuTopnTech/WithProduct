import { Component, OnInit } from '@angular/core';
import { Products } from './products';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ProductsService } from './products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {

  name?: string;
  form!: FormGroup;
  product?: Products;
  id?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private productsService: ProductsService) {
    
  }
  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      image: new FormControl(''),
    });
    this.loadData();
  }
  loadData() {

    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {

      var url = environment.baseUrl + 'api/products/' + this.id;
      this.productsService.get(this.id).subscribe({
        next: (result) => {
          this.product = result;
          this.name = "Edit - " + this.product.title;

          this.form.patchValue(this.product);
        },
        error: (error) => console.error(error)
      });
    } else {
      this.name = "Add a new Product";
    }
  }
  onSubmit() {
    var product = (this.id) ? this.product : <Products>{};
    if (product) {
      product.title = this.form.controls['title'].value;
      product.category = this.form.controls['category'].value;
      product.quantity = +this.form.controls['quantity'].value;
      product.price = +this.form.controls['price'].value;
      product.image = this.form.controls['image'].value;

      if (this.id) {
        var url = environment.baseUrl + 'api/products/' + product.id;
        this.productsService
          .put(product)
          .subscribe({
            next: (result) => {
              console.log("Products " + product!.id + " has been updated.");
            
              this.router.navigate(['/products']);
            },
            error: (error) => console.error(error)
          });
      } else {
        var url = environment.baseUrl + 'api/products';
        this.productsService.post( product).subscribe({
          next: (result) => {
            console.log("Products " + result.id + " has been Added.");
            // go back to cities view
            this.router.navigate(['/products']);
          },
          error: (error) => console.error(error)
        });
        }
      }
  }
}
