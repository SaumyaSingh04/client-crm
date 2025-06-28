// src/pages/InvoiceNewList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const InvoiceNewList = () => {
  const [invoices, setInvoices] = useState([]);
  const { baseUrl } = useAppContext();
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${baseUrl}/invoices/all`);
      setInvoices(res.data.data.reverse());
    } catch {
      toast.error("Error loading invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete invoice?")) {
      await axios.delete(`${baseUrl}/invoices/delete/${id}`);
      toast.success("Deleted");
      fetchInvoices();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Invoices</h2>
        <Link to="/InvoiceNewForm" className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Invoice
        </Link>
      </div>

      <table className="w-full table-auto border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Invoice #</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id} className="text-center">
              <td className="border p-2">{inv.invoiceNumber}</td>
              <td className="border p-2">{inv.customerName}</td>
              <td className="border p-2">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
              <td className="border p-2">₹ {inv.amountDetails.totalAmount}</td>
              <td className="border p-2 flex justify-center gap-2">
                <Link to={`/InvoiceNewPrint/${inv._id}`} className="text-green-600 underline">View</Link>
                <Link to={`/InvoiceNewForm/${inv._id}`} className="text-blue-600 underline">Edit</Link>
                <button onClick={() => handleDelete(inv._id)} className="text-red-600 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceNewList;
