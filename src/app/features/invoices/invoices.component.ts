import { Component } from '@angular/core';


interface InvoiceItem {
  item: string;
  amount: number;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent {
availableItems = [
    'Income Tax Filing',
    'GST Filing',
    'Business Registration',
    'Consulting',
    'Audit Service',
    'PAN Application'
  ];

  items: InvoiceItem[] = [{ item: '', amount: 0 }]; // Start with one row

  discount = 0;
  referralBonus = 0;

  get itemsTotal(): number {
    return this.items.reduce((total, i) => total + (i.amount || 0), 0);
  }

  get finalAmount(): number {
    return this.itemsTotal - this.discount + this.referralBonus;
  }

  addItem() {
    this.items.push({ item: '', amount: 0 });
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  saveInvoice() {
    const invoiceData = {
      items: this.items,
      itemsTotal: this.itemsTotal,
      discount: this.discount,
      referralBonus: this.referralBonus,
      finalAmount: this.finalAmount
    };
    console.log('Invoice Saved:', invoiceData);
    alert('Invoice Saved ✅');
  }
}
