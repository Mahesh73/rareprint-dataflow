import React from "react";
import { Button, Table } from "react-bootstrap";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";

const Toyocut = ({ data, setData }) => {
  const deleteProduction = async (id) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/toyocut/${id}`)
        .then((res) => {
          toast.success(res.data.message);
          setData((prev) => prev.filter((item) => item._id !== id));
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    }
  };
  const printingCompleted = async (item) => {
    const isConfirmed = await confirmationDialog({
      title: "Order Completed",
      text: "Are you sure you want to complete printing for this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .post("/api/toyocut", item)
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    }
  };
  const startPrinting = () => {};
  return (
    <Table>
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Customer Name</th>
          <th>Product Name</th>
          <th>Product Category</th>
          <th>Size</th>
          <th>GSM</th>
          <th>Qty</th>
          <th>Prod Qty</th>
          <th style={{ minWidth: "125px" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.orderId?.invoiceNo}</td>
              <td>{item.orderId?.customerName}</td>
              <td>{item.productName}</td>
              <td>{item.category}</td>
              <td>{item.size}</td>
              <td>{item.gsm}</td>
              <td>{item.quantity}</td>
              <td>{item.prodQty}</td>
              <td style={{ cursor: "pointer" }}>
                <PrinterFill
                  title="Start Printing"
                  onClick={() => startPrinting(item._id)}
                />
                <TrashFill
                  className="mx-2"
                  onClick={() => deleteProduction(item._id)}
                />
                {item.afterPrint && (
                  <Button size="sm" onClick={() => printingCompleted(item)}>
                    Printing Completed
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Toyocut;
