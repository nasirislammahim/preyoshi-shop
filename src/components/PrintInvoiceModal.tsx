import React from 'react';
import { Order } from '../types';
import { X, Printer } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface PrintInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, onClose }) => {
  const { settings, formatPrice, t, language } = useShop();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-3 bg-[#FFF9F2] border-b border-stone-200">
          <span className="text-xs font-bold text-stone-700">
            {t('Invoice Preview', 'ইনভয়েস প্রিভিউ')}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('Print / Save PDF', 'প্রিন্ট / PDF সংরক্ষণ')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto print:p-0 font-sans text-stone-900 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-[#7A1238]">
            <div>
              <h1 className="text-2xl font-black tracking-wider text-[#7A1238] font-serif-luxury uppercase">
                PREYOSHI SHOP
              </h1>
              <p className="text-xs font-bold text-[#BE0750] font-bangla">প্রেয়সী শপ</p>
              <p className="text-[10px] text-stone-500 italic mt-0.5">Your Style ♥ Our Priority</p>
              <p className="text-xs text-stone-600 mt-2">
                House 42, Road 11, Block D, Banani, Dhaka-1213
              </p>
              <p className="text-xs text-stone-600">Hotline: +880 1711-234567 • www.preyoshishop.com</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-[#F8E8E9] text-[#7A1238] font-mono font-bold text-sm tracking-wider">
                INVOICE
              </span>
              <p className="text-xs text-stone-500 mt-2 font-mono">
                Order: <span className="font-bold text-stone-800">{order.orderNumber}</span>
              </p>
              <p className="text-xs text-stone-500 font-mono">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
              <p className="text-xs font-semibold text-[#7A1238] mt-1">
                Status: {order.status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-6 my-6 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-500 uppercase text-[10px] tracking-wider mb-1.5">
                Customer Details:
              </h4>
              <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
              <p className="text-stone-700 font-mono">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-stone-600">{order.customerEmail}</p>}
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-500 uppercase text-[10px] tracking-wider mb-1.5">
                Delivery Address:
              </h4>
              <p className="text-stone-800 leading-snug">{order.deliveryAddress}</p>
              <p className="text-stone-600">
                {order.upazila}, {order.district}, {order.division}
              </p>
              <p className="text-stone-500 text-[11px] mt-1">
                Courier: {order.courierName || 'Steadfast Courier'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left my-4 border border-stone-200">
            <thead className="bg-[#FFF9F2] text-stone-700 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Option</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map(item => (
                <tr key={item.id}>
                  <td className="py-2 px-3 font-medium text-stone-800">
                    {item.productNameEn}
                  </td>
                  <td className="py-2 px-3 text-center text-stone-500 text-[11px]">
                    {item.selectedSize || item.selectedColor || '-'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-2 px-3 text-right font-bold font-mono">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end my-4 text-xs">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge:</span>
                <span className="font-mono">৳{order.deliveryCharge.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[#7A1238] pt-2 border-t border-stone-300">
                <span>Grand Total:</span>
                <span className="font-mono">৳{order.grandTotal.toLocaleString()}</span>
              </div>
              <div className="pt-2 text-[11px] text-stone-500 flex justify-between">
                <span>Payment:</span>
                <span className="font-semibold uppercase text-stone-800">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-500">
            <p>Thank you for shopping with PREYOSHI SHOP (প্রেয়সী শপ)!</p>
            <p className="mt-0.5">Brand Designer: Nurtaz Agency • Customer Support Hotline: +880 1711-234567</p>
          </div>
        </div>
      </div>
    </div>
  );
};
