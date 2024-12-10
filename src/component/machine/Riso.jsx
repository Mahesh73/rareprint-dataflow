import React from "react";
import { Container } from "react-bootstrap";
import { PrinterFill, TrashFill, Truck } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "./Riso.css";

const Riso = ({ data, setData }) => {
  const navigate = useNavigate();

  // Action Handlers
  const startPrinting = (orderId, productId, printedQty, qty, design) => {
    Swal.fire({
      text: "Do you want to print this design?",
      imageUrl: `http://localhost:5000/uploads/${design}`,
      imageHeight: 250,
      showCancelButton: true,
      confirmButtonText: "Print",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) window.print();
    });
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
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const moveToPackaging = (orderId, productId) => {
    Swal.fire({
      title: "Do you want to dispatch this order?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .put("/api/production/moveToPackaging", { orderId, productId })
          .then((res) => {
            toast.success(res.data.message);
            navigate("/packaging");
          })
          .catch((error) => console.error("Error:", error));
      }
    });
  };

  // Cell Renderer for Actions
  const ActionButtonRenderer = (props) => {
    const { orderId, productId, printedQty, quantity, design, _id } = props.data;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%", // Ensure it spans the full cell height
        }}
      >
        {design && (
          <PrinterFill
            title="Start Printing"
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={() => startPrinting(orderId, productId, printedQty, quantity, design)}
          />
        )}
        <TrashFill
          style={{ marginRight: "10px", cursor: "pointer" }}
          onClick={() => deleteProduction(_id)}
        />
        <Truck
          style={{ cursor: "pointer" }}
          onClick={() => moveToPackaging(orderId, productId)}
        />
      </div>
    );
  };
  

  // Column Definitions
  const columns = [
    { headerName: "Invoice No", field: "orderId.invoiceNo", minWidth: 150 },
    { headerName: "Customer Name", field: "orderId.customerName", minWidth: 150 },
    { headerName: "Product Name", field: "productName", minWidth: 150 },
    { headerName: "Product Category", field: "category", minWidth: 150 },
    { headerName: "Size", field: "size", minWidth: 100 },
    { headerName: "GSM", field: "gsm", minWidth: 100 },
    { headerName: "Qty", field: "quantity", minWidth: 100 },
    {
      headerName: "Created Date",
      field: "createdAt",
      minWidth: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      filter: 'agDateColumnFilter', // Add this to use AG Grid's date filter
      filterParams: {
        // Customize date filter parameters
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // Convert cell value to Date object
          const cellDate = new Date(cellValue);
          
          // Normalize both dates to midnight for accurate comparison
          const filterDate = new Date(filterLocalDateAtMidnight);
          filterDate.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);
    
          // Compare dates
          if (cellDate.getTime() === filterDate.getTime()) {
            return 0; // Dates are equal
          }
          if (cellDate.getTime() < filterDate.getTime()) {
            return -1; // Cell value is before filter date
          }
          return 1; // Cell value is after filter date
        }
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      pinned: "right",
      filter: false,
      sortable: false,
      resizable: false,
      // minWidth: 150,
      cellRenderer: ActionButtonRenderer,
    },
  ];

  const defaultColDef = {
    flex: 1,
    filter: true,
    filterParams: {
      buttons: ['reset', 'apply'] // This adds clear/reset functionality to all filters
    }
  };


  return (
    <Container style={{ maxWidth: "2000px", padding: "0 20px" }}>
      <div className={"ag-theme-quartz"} style={{ width: "100%", height: "75vh" }}>
        <AgGridReact
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
        />
      </div>
    </Container>
  );
};

export default Riso;
