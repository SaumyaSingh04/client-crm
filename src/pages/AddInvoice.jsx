// src/pages/InvoiceNewForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const InvoiceNewForm = () => {
  const { id } = useParams();
  const { baseUrl } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerGST: "",
    invoiceDate: "",
    dueDate: "",
    customerName: "",
    invoiceNumber: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    dispatchThrough: "",
    customerAadhar: "",
    productDetails: [],
    amountDetails: {
      gstPercentage: 9,
      discountOnTotal: 0,
      totalAmount: 0,
    },
  });

  const [rows, setRows] = useState([
    {
      description: "",
      unit: "",
      quantity: "",
      price: "",
      discountPercentage: "",
      amount: "",
    },
  ]);

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/invoices/mono/${id}`).then((res) => {
        const data = res.data.data;
        setFormData(data);
        setRows(data.productDetails);
      });
    } else {
      axios.get(`${baseUrl}/invoices/next-invoice-number`).then((res) => {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: res.data.nextInvoiceNumber,
        }));
      });
    }
  }, [id, baseUrl]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    const quantity = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].price) || 0;
    const discount = parseFloat(updated[index].discountPercentage) || 0;
    const amount = price * quantity * (1 - discount / 100);
    updated[index].amount = amount.toFixed(2);
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        description: "",
        unit: "",
        quantity: "",
        price: "",
        discountPercentage: "",
        amount: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseAmount = rows.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    const gstRate = parseFloat(formData.amountDetails.gstPercentage) || 0;
    const discount = parseFloat(formData.amountDetails.discountOnTotal) || 0;
    const totalAmount = baseAmount * (1 + gstRate / 100) - discount;

    const payload = {
      ...formData,
      productDetails: rows,
      amountDetails: {
        ...formData.amountDetails,
        totalAmount: totalAmount.toFixed(2),
      },
    };

    if (id) {
      await axios.put(`${baseUrl}/invoices/update/${id}`, payload);
    } else {
      await axios.post(`${baseUrl}/invoices/create`, payload);
    }

    navigate("/InvoiceNewList");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold">{id ? "Update" : "Create"} Invoice</h2>

      {/* Basic Fields */}
      <input name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} />
      <input name="customerGST" placeholder="Customer GST" value={formData.customerGST} onChange={handleChange} />
      <input name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} />
      <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
      <input name="customerAddress" placeholder="Address" value={formData.customerAddress} onChange={handleChange} />
      <input name="customerPhone" placeholder="Phone" value={formData.customerPhone} onChange={handleChange} />
      <input name="customerEmail" placeholder="Email" value={formData.customerEmail} onChange={handleChange} />
      <input name="customerAadhar" placeholder="Aadhar" value={formData.customerAadhar} onChange={handleChange} />

      {/* Product Table */}
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th>Description</th><th>Unit</th><th>Qty</th><th>Price</th><th>Discount %</th><th>Amount</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td><input value={row.description} onChange={(e) => handleRowChange(i, "description", e.target.value)} /></td>
              <td><input value={row.unit} onChange={(e) => handleRowChange(i, "unit", e.target.value)} /></td>
              <td><input type="number" value={row.quantity} onChange={(e) => handleRowChange(i, "quantity", e.target.value)} /></td>
              <td><input type="number" value={row.price} onChange={(e) => handleRowChange(i, "price", e.target.value)} /></td>
              <td><input type="number" value={row.discountPercentage} onChange={(e) => handleRowChange(i, "discountPercentage", e.target.value)} /></td>
              <td>{row.amount}</td>
              <td><button type="button" onClick={() => removeRow(i)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow}>+ Add Item</button>

      {/* Amount Section */}
      <input type="number" placeholder="GST %" value={formData.amountDetails.gstPercentage} onChange={(e) => setFormData({ ...formData, amountDetails: { ...formData.amountDetails, gstPercentage: e.target.value } })} />
      <input type="number" placeholder="Discount on Total" value={formData.amountDetails.discountOnTotal} onChange={(e) => setFormData({ ...formData, amountDetails: { ...formData.amountDetails, discountOnTotal: e.target.value } })} />

      <button type="submit">{id ? "Update" : "Create"} Invoice</button>
    </form>
  );
};

export default InvoiceNewForm;
