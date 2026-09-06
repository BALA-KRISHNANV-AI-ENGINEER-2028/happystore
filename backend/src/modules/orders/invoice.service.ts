import { Injectable } from '@nestjs/common';

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shopName: string;
  shopAddress: string;
  placedAt: Date;
  items: Array<{ name: string; price: number; quantity: number; unit?: string }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  total: number;
  paymentMethod: string;
}

@Injectable()
export class InvoiceService {
  generateInvoiceHtml(data: InvoiceData): string {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.unit ? `(${item.unit})` : ''}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${data.orderId}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 20px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); font-size: 14px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; color: #16a34a; }
          .table { width: 100%; border-collapse: collapse; text-align: left; margin-top: 20px; }
          .summary { margin-top: 30px; text-align: right; }
          .summary table { margin-left: auto; width: 300px; }
          .summary td { padding: 5px 10px; }
          .total { font-size: 18px; font-weight: bold; color: #16a34a; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="brand">Happy Store</div>
              <p style="margin: 5px 0; color: #666;">Discover Local. Shop Smarter.</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #333;">INVOICE</h2>
              <p style="margin: 5px 0; color: #666;">Order #${data.orderId}</p>
              <p style="margin: 0; color: #888;">Date: ${new Date(data.placedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="width: 50%; vertical-align: top;">
                <strong>Billed To:</strong><br>
                ${data.customerName}<br>
                ${data.customerEmail}
              </td>
              <td style="width: 50%; vertical-align: top; text-align: right;">
                <strong>Merchant:</strong><br>
                ${data.shopName}<br>
                ${data.shopAddress}
              </td>
            </tr>
          </table>

          <table class="table">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="summary">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td>$${data.subtotal.toFixed(2)}</td>
              </tr>
              ${data.discount ? `<tr><td>Discount:</td><td>-$${data.discount.toFixed(2)}</td></tr>` : ''}
              <tr>
                <td>Delivery Fee:</td>
                <td>$${data.deliveryFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (8%):</td>
                <td>$${data.tax.toFixed(2)}</td>
              </tr>
              <tr class="total">
                <td>Total:</td>
                <td>$${data.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
            Thank you for supporting local businesses with Happy Store! Payment Method: <strong>${data.paymentMethod}</strong>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
