// src/pages/InvoicePrint.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toWords } from "number-to-words";
import { useReactToPrint } from "react-to-print";
import { useAppContext } from "../context/AppContext"; // ✅ use context

const InvoicePrint = () => {
  const { id } = useParams();
  const { baseUrl } = useAppContext();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`${baseUrl}/invoices/mono/${id}`);
        const data = await response.json();
        if (data.success) setInvoice(data.data);
        else alert("Invoice not found");
      } catch {
        alert("Error fetching invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, baseUrl]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Invoice",
    pageStyle: `
      @page { size: A4; margin: 5mm; }
      @media print {
        html, body {
          margin: 0;
          padding: 24px;
          -webkit-print-color-adjust: exact !important;
        }
        .no-print { display: none !important; }
      }
    `,
  });

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="bg-white p-4 sm:p-6 text-xs sm:text-sm">
      <div className="no-print text-right mb-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🖨️ Print Invoice
        </button>
      </div>

      <div ref={componentRef} className="border border-black p-4">
        <div className="text-center font-bold text-lg mb-4 text-blue-700">
          T A X &nbsp; I N V O I C E
        </div>

        {/* Company Info */}
        <div className="flex justify-between border-b border-black pb-2 mb-2">
          <div>
            <p className="font-bold text-md">SHINE INFOSOLUTIONS</p>
            <p>GSTIN: 09FTJPS4577P1ZD</p>
            <p>87a, Bankati chak, Raiganj road, Gorakhpur, 273001</p>
            <p>Mobile: 7054284786, 9140427414</p>
            <p>Email: info@shineinfosolutions.in</p>
          </div>
          <div>
            <p><b>Invoice #:</b> {invoice.invoiceNumber}</p>
            <p><b>Invoice Date:</b> {invoice.invoiceDate?.split("T")[0]}</p>
            <p><b>Due Date:</b> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><b>GST:</b> {invoice.customerGST}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-b border-black pb-2 mb-2">
          <p><b>Customer:</b> {invoice.customerName}</p>
          <p><b>Phone:</b> {invoice.customerPhone}</p>
          <p><b>Email:</b> {invoice.customerEmail}</p>
          <p><b>Address:</b> {invoice.customerAddress}</p>
        </div>

        {/* Product Table */}
        <table className="w-full border border-black text-xs mb-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Item</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Discount %</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.productDetails?.map((p, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1">{p.description}</td>
                <td className="border px-2 py-1">{p.unit}</td>
                <td className="border px-2 py-1 text-center">{p.quantity}</td>
                <td className="border px-2 py-1 text-right">₹{p.price}</td>
                <td className="border px-2 py-1 text-right">{p.discountPercentage || 0}%</td>
                <td className="border px-2 py-1 text-right">₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right font-semibold mb-2">
          <p>GST %: {invoice.amountDetails.gstPercentage}%</p>
          <p>Discount on Total: ₹{invoice.amountDetails.discountOnTotal}</p>
          <p className="text-lg">Total: ₹{invoice.amountDetails.totalAmount}</p>
        </div>

        {/* Amount in Words */}
        <div className="border-t border-black pt-2 text-right text-sm italic">
          Amount in words: INR {capitalizeWords(toWords(invoice.amountDetails.totalAmount))} only
        </div>

        {/* Footer */}
        <div className="border-t border-black mt-4 pt-4 text-right">
          <p>For <strong>SHINE INFOSOLUTIONS</strong></p>
          <p className="italic mt-6">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
