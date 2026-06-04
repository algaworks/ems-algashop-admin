import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';

import { enumToString, sleep } from 'src/app/shared/shared.module';
import { OrdersService } from '../../orders.service';
import { firstValueFrom } from 'rxjs';
import { OrderItemModel, OrderModel, OrderStatus, PaymentMethodType } from '../../models/model';

@Component({
  selector: 'app-order-detail-page',
  templateUrl: './order-detail-page.component.html',
  styleUrl: './order-detail-page.component.css'
})
export class OrderDetailPageComponent implements OnInit {
  order?: OrderModel;
  orderItems?: OrderItemModel[] = [];
  orderCode?: string;
  loading = true;
  menuItems: MenuItem[] = [];

  canShowShippingInfo: boolean = false;
  canShowBillingInfo: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    ) { }

  ngOnInit(): void {
    this.orderCode = this.route.snapshot.params['orderCode'];
    this.loadData();
    this.setupMenus();
  }

  private loadData() {
    this.loading = true;//em caso de refresh
    sleep()
      .then(()=> {
        this.loadOrder();
      });
  }

  private setupMenus() {
    this.menuItems = this.menuItems = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Editar',
            command: () => {
              this.edit();
            }
          }
        ]
      }
    ];
  }

  private edit() {
    if (this.orderCode) {
      this.router.navigate([`/orders/${this.orderCode}/edit`])
    }
  }

  private loadOrder() {
    firstValueFrom(this.ordersService.getOne(this.orderCode!))
      .then(order => {
        this.order = order;
        this.orderItems = order.items;
        this.loading = false;
      })
      .catch(e => {
        console.error(e);
        let message = {
            severity:'error',
            summary: 'Erro de conexão com o servidor',
            detail: 'Não foi possível recuperar o produto',
            boolean: true
        }
        this.messageService.add(message);
      });
  }

  showShippingInfo(){
    this.canShowShippingInfo = true;
  }
  showBillingInfo(){
    this.canShowBillingInfo = true;
  }

  public enumStatusToValue(enumObj: OrderStatus) {
    return enumToString(OrderStatus, enumObj);
  }
  public enumPaymentMethodToValue(enumObj: PaymentMethodType) {
    return enumToString(PaymentMethodType, enumObj);
  }

}
