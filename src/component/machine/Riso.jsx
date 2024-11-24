import React from "react";
import { Container, Table } from "react-bootstrap";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import "./Riso.css";
import { Button } from "react-bootstrap"; // Import Button from react-bootstrap

const Riso = ({ data, setData }) => {
  const navigate = useNavigate();
  const startPrinting = async (orderId, productId, printedQty, qty) => {
    let { value: quantity } = await Swal.fire({
      // title: "Start Printing",
      text: "Enter the quantity to print",
      imageUrl: "http://localhost:5000/uploads/1729419550254-envelope.jpg",
      imageHeight: 250,
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
        placeholder: "Enter quantity",
      },
      showCancelButton: true,
      confirmButtonText: "Save & Print",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (
          !value ||
          value <= 0 ||
          parseInt(value > qty) ||
          printedQty + parseInt(value) > qty
        ) {
          return "You need to enter a valid quantity!";
        }
      },
    });
    if (printedQty > 0) {
      quantity = printedQty + parseInt(quantity);
    }
    let status = "";
    if (quantity < qty) {
      status = "Printing Inprogress";
    } else if (quantity !== qty) {
      status = "Printing Inprogress";
    } else if (quantity === qty) {
      status = "Printing Completed";
    } else {
      status = "Printing Completed";
    }

    if (quantity) {
      // try {
      //   axiosInstance
      //     .post("/api/production/machine/printQty", {
      //       productId,
      //       orderId,
      //       quantity,
      //       machine: "RISO",
      //       status,
      //     })
      //     .then((res) => {
      //       toast.success(res.data.message);
      //       setTimeout(() => {
      //         if (status === "Printing Completed") {
      //           moveToPackaging(orderId, productId, quantity);
      //         } else {
      //           window.location.reload();
      //         }
      //       }, 1000);
      //     })
      //     .catch((err) => {
      //       toast.error(err.response.data.message);
      //     });
      // } catch (error) {
      //   toast.error("An error occurred!");
      // }
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  };
  const deleteProduction = async (risoId) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/riso/${risoId}`)
        .then((res) => {
          toast.success(res.data.message);
          setData((prev) => prev.filter((item) => item._id !== risoId));
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    }
  };
  const moveToPackaging = async (orderId, productId, quantity) => {
    try {
      const response = await axiosInstance.put(
        "/api/production/moveToPackaging",
        {
          orderId,
          productId,
          quantity,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/packaging");
        console.log("Product moved to packaging:", response.data);
      } else {
        console.error("Failed to move product to packaging.");
      }
    } catch (error) {
      console.error("Error moving product to packaging:", error);
    }
  };

  return (
    <Container>
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
          <th>Printed Qty</th>
          <th>Prod Qty</th>
          <th>Created Date</th>
          <th style={{ minWidth: "125px" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.orderId?.invoiceNo}</td>
              <td>{item.orderId?.customerName}</td>
              <td>{item.productName}</td>
              <td>{item.category}</td>
              <td>{item.size}</td>
              <td>{item.gsm}</td>
              <td>{item.quantity}</td>
              <td>{item.printedQty}</td>
              <td>{item.prodQty}</td>
              <td style={{minWidth: '125px'}}>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td style={{ cursor: "pointer" }}>
                 <div style={{ display: "flex", alignItems: "center" }}>
                <PrinterFill
                  title="Start Printing"
                  style={{ marginRight: '10px' }}
                  onClick={() =>
                    startPrinting(
                      item.orderId,
                      item.productId,
                      item.printedQty,
                      item.quantity
                    )
                  }
                />
                <TrashFill
                  className="mx-2"
                  style={{ marginRight: '10px' }}
                  onClick={() => deleteProduction(item._id)}
                />
                <Button variant="primary" className="mx-2 button-dispatch"> Dispatch</Button>
              </div>

              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    <div className="print-container">
      <img src="http://localhost:5000/uploads/1729419550254-envelope.jpg"
       className="print-image"
       alt="Print Image" />
    </div>
    </Container>
  );
};

export default Riso;
