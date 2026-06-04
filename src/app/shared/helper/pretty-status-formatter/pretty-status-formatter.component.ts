import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pretty-status-formatter',
  templateUrl: './pretty-status-formatter.component.html',
  styleUrls: ['./pretty-status-formatter.component.css']
})
export class PrettyStatusFormatterComponent implements OnInit {

  @Input() status? : string = '';

  @Input() female? : boolean = false;

  formattedStatus : string = '';

  constructor() { }

  ngOnInit(): void {
  }

  getStatusColorClass() : string {
    if (this.status == 'ACTIVE') {
      this.formattedStatus = this.female ? 'Ativa' : 'Ativo';
      return 'status-success';
    }
    if (this.status == 'INACTIVE') {
      this.formattedStatus = this.female ? 'Inativa' : 'Inativo';
      return 'status-danger';
    }
    if (this.status == 'PENDING_SETUP') {
      this.formattedStatus = 'Configuração pendente'
      return 'status-warning';
    }

    if (this.status == 'PAID') {
      this.formattedStatus = this.female ? 'Paga' : 'Pago';
      return 'status-success';
    }
    if (this.status == 'PENDING') {
      this.formattedStatus = 'Pendente'
      return 'status-warning';
    }
    if (this.status == 'PARTIALLY_PAID') {
      this.formattedStatus = this.female ? 'Parcialmente paga' : 'Parcialmente pago';
      return 'status-warning';
    }
    if (this.status == 'CANCELLED') {
      this.formattedStatus = this.female ? 'Cancelada' : 'Cancelado';
      return 'status-danger';
    }
    if (this.status == 'REFUNDED') {
      this.formattedStatus = this.female ? 'Reembolsada' : 'Reembolsado'
      return 'status-danger';
    }

    if (this.status == 'ENROLLED') {
      this.formattedStatus = this.female ? 'Matriculado' : 'Matriculado'
      return 'status-success';
    } 

    if (this.status == 'ISSUED') {
      this.formattedStatus = this.female ? 'Emitida' : 'Emitido'
      return 'status-success';
    } 

    if (this.status == 'UNPUBLISHED') {
      this.formattedStatus = 'Não publicado'
      return 'status-warning';
    } 

    if (this.status == 'PUBLISHED') {
      this.formattedStatus = 'Publicado'
      return 'status-success';
    }

    return this.status || '-';
  }

}