import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryModel, ProductInput, ProductModel } from 'src/app/core/models';
import { ProductsService } from '../../products.service';
import { firstValueFrom } from 'rxjs';

type ProductInputControls = { [key in keyof ProductInput]: AbstractControl}
type ProductInputFormGroup = FormGroup & {value: ProductInput, control: ProductInputControls}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  form?: ProductInputFormGroup;
  @Input() productId?: number;
  saving = false;
  categories: CategoryModel[] = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.configureForm();
    this.loadData();
  }

  isEditing() : boolean {
    return !!this.productId
  }

  save() {
    this.saving = true;

    let input = this.generateInput();

    if (this.isEditing()) {
        firstValueFrom(this.productsService.update(this.productId!, input))
          .then(() => {
            this.saving = false;
            this.displaySuccessMessage();
            this.router.navigate([`/products/${this.productId}`]);
          }).catch((e) => {
            console.error(e);
            this.saving = false;
            this.displayErrorMessage(e);
          })
    } else {
      firstValueFrom(this.productsService.create(input))
        .then((product) => {
          this.saving = false;
          this.displaySuccessMessage();
          this.router.navigate([`/products/${product.id}`]);
        }).catch((e) => {
          console.error(e);
          this.saving = false;
          this.displayErrorMessage(e);
        })
    }

  }

  isFormInvalid() {
    return this.form!.invalid;
  }

  private configureForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      quantityInStock: new FormControl(null, [Validators.required]),
      enabled: new FormControl(false, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      regularPrice: new FormControl(null, [Validators.required]),
      salePrice: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      category: new FormControl<object | null>(null, [Validators.required]),
    }) as ProductInputFormGroup;

  }

  private loadData() {
    firstValueFrom(this.productsService.getCategories())
      .then((categoriesPage)=> {
        this.categories = categoriesPage.content;
        if (this.isEditing()) {
          firstValueFrom(this.productsService.getOne(this.productId!))
            .then((product)=> {
              this.form!.patchValue(this.parsePatchData(product));
            });
        }
      });
  }

  private parsePatchData(product: ProductModel) {
    return product; //todo - caso tenha Enums, é bom usar um parse nesse método
  }

  private generateInput() : ProductInput {
    return new ProductInput(
      this.form!.controls.name.value,
      this.form!.controls.quantityInStock.value,
      this.form!.controls.brand.value,
      this.form!.controls.enabled.value,
      this.form!.controls.regularPrice.value,
      this.form!.controls.salePrice.value,
      this.form!.controls.description.value,
      this.form!.controls.category?.value?.id,
    );
  }

  private displaySuccessMessage() {
    let message = {
      severity:'success',
      summary: 'Success',
      detail:  this.isEditing() ? 'Product updated' : 'Product registered',
      boolean: true
    }
    this.messageService.add(message);
  }

  private displayErrorMessage(e: Error) {
    let message = {
      severity:'error',
      summary: 'Connection error with the server, please try again.',
      detail: e.message,
      boolean: true
    }
    this.messageService.add(message);
  }
}
