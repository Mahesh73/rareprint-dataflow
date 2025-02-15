import React, { useState } from "react";
import {
  PrinterFill,
  TrashFill,
  Truck,
  UsbMiniFill,
} from "react-bootstrap-icons";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Xerox = ({ data, setData }) => {
  const navigate = useNavigate();

  const [gridApi, setGridApi] = useState(null);

  const deleteProduction = async (risoId) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/xerox/${risoId}`)
        .then((res) => {
          toast.success(res.data.message);
          setData((prev) => prev.filter((item) => item._id !== risoId));
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    }
  };

  const startPrinting = () => {
    // Logic for starting printing (not implemented in the original code)
  };

  const moveToToyocut = (item) => {
    Swal.fire({
      title: "Do you want to move to Toyocut this order?",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .post("/api/toyocut", item)
          .then((res) => {
            toast.success(res.data.message);
            setData((prev) => prev.filter((val) => val._id !== item._id));
          })
          .catch((error) => console.error("Error:", error));
      }
    });
  };

  const moveToPackaging = (orderId, productId) => {
    Swal.fire({
      title: `Do you move to Packaging  this order?`,
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .put("/api/production/moveToPackaging", {
            orderId,
            productId,
            machine: "XEROX",
          })
          .then((res) => {
            toast.success(res.data.message);
            navigate("/packaging");
          })
          .catch((error) => console.error("Error:", error));
      }
    });
  };

  const columnDefs = [
    {
      headerName: "Invoice No",
      field: "orderId.invoiceNo",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Invoice Number",
    },
    {
      headerName: "Customer Name",
      field: "orderId.customerName",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Customer Name",
    },
    {
      headerName: "Product Name",
      field: "productName",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Product Name",
    },
    {
      headerName: "Product Category",
      field: "category",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Product category",
    },
    {
      headerName: "Size",
      field: "size",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Size Specified",
    },
    {
      headerName: "GSM",
      field: "gsm",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No GSM Specified",
    },
    {
      headerName: "Qty",
      field: "quantity",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Qty Specified",
    },
    {
      headerName: "Prod Qty",
      field: "prodQty",
      sortable: true,
      filter: true,
      tooltipValueGetter: (params) => params.value || "No Prod Qty Specified",
    },
    {
      headerName: "Action",
      pinned: "right",
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: (params) => {
        const item = params.data;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              cursor: "pointer",
            }}
          >
            <PrinterFill
              title="Print"
              style={{ marginRight: "10px" }}
              onClick={() => startPrinting(item._id)}
            />
            <TrashFill
              title="Delete"
              className="mx-2"
              onClick={() => deleteProduction(item._id)}
            />
            {item.afterPrint === "toyocut" && (
              <UsbMiniFill
                title="Move to Toyocut"
                onClick={() => moveToToyocut(item)}
              />
            )}
            {item.afterPrint === "packaging" && (
              <Truck
                title="Move to Packaging"
                variant="primary"
                onClick={() =>
                  moveToPackaging(item.orderId._id, item.productId)
                }
              />
            )}
          </div>
        );
      },
      width: 100,
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    resizable: true,
  };

  const gridOptions = {
    enableBrowserTooltips: true, // Enable browser tooltips globally
    tooltipShowDelay: 500, // Set a delay for the tooltip
  };

  return (
    <div
      className={"ag-theme-quartz"}
      style={{ width: "100%", height: "75vh" }}
    >
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

export default Xerox;
