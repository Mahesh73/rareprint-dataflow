import React, { useState } from "react";
import { PrinterFill, TrashFill, Truck } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Toyocut = ({ data, setData }) => {
  const [gridApi, setGridApi] = useState(null);

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

  const startPrinting = () => {
    // Logic for starting printing (not implemented in the original code)
  };

  const columnDefs = [
    { headerName: "Invoice No", field: "orderId.invoiceNo", sortable: true, filter: true, tooltipValueGetter: (params) => params.value || "No Invoice Number" },
    { headerName: "Customer Name", field: "orderId.customerName", sortable: true, filter: true, tooltipValueGetter: (params) => params.value || "No Customer Name" },
    { headerName: "Product Name", field: "productName", sortable: true, filter: true,tooltipValueGetter: (params) => params.value || "No Product Name" },
    { headerName: "Product Category", field: "category", sortable: true, filter: true,tooltipValueGetter: (params) => params.value || "No Product category" },
    { headerName: "Size", field: "size", sortable: true, filter: true,tooltipValueGetter: (params) => params.value || "No Size Specified" },
    { headerName: "GSM", field: "gsm", sortable: true, filter: true,tooltipValueGetter: (params) => params.value || "No GSM Specified" },
    { headerName: "Qty", field: "quantity", sortable: true, filter: true, tooltipValueGetter: (params) => params.value || "No quantity Specified" },
    { headerName: "Prod Qty", field: "prodQty", sortable: true, filter: true, tooltipValueGetter: (params) => params.value || "No Prod Qty Specified" },
    {
      headerName: "Action",
      pinned: "right",
      width: 100,
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: (params) => {
        const item = params.data;
        return (
          <div  style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", // Ensure it spans the full cell height
          }}>
            <PrinterFill
              title="Start Printing"
              style={{marginRight: "10px", cursor: "pointer" }}
              onClick={() => startPrinting(item._id)}
            />
            <TrashFill
              style={{marginRight: "10px", cursor: "pointer" }}
              onClick={() => deleteProduction(item._id)}
            />
            <Truck
              variant="primary"
              style={{marginRight: "10px", cursor: "pointer" }}
              onClick={() => console.log("Dispatch clicked")}
            />
             
            {item.afterPrint && (
              <Button size="sm" onClick={() => printingCompleted(item)}>
                Printing Completed
              </Button>
            )}
          </div>
        );
      },
     
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
  };

  const gridOptions = {
    enableBrowserTooltips: true, // Enable browser tooltips globally
    tooltipShowDelay: 500, // Set a delay for the tooltip
  };
  return (
    <div className={"ag-theme-quartz"} style={{ width: "100%", height: "75vh" }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        gridOptions={gridOptions}
        onGridReady={(params) => setGridApi(params.api)}
      />
    </div>
  );
};

export default Toyocut;
