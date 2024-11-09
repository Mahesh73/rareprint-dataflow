import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import { Container } from "react-bootstrap";

const Packaging = () => {
  const [packagingOrders, setPackagingOrders] = useState([]);
  useEffect(() => {
    // Fetch packaging orders data from the backend
    const fetchPackagingOrders = async () => {
      try {
        axiosInstance.get("/api/packaging").then(res => {
            setPackagingOrders(res.data);
        })
      } catch (error) {
        console.error("Error fetching packaging orders:", error);
      }
    };

    fetchPackagingOrders();
  }, []);

  return (
    <Container>
      <h2>Packaging Orders</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {packagingOrders?.map((order) => (
            <tr key={order._id}>
              <td>{order?.invoiceNo}</td>
              <td>{order.customerName}</td>
              <td>{order.productName}</td>
              <td>{order.productCategory}</td>
              <td>{order.quantity}</td>
              <td>{order.packagingStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Packaging;
