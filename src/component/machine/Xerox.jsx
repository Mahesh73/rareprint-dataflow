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

const Xerox = ({ data, setData }) => {
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

  const columnDefs = [
    {
      headerName: "Invoice No",
      field: "orderId.invoiceNo",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Customer Name",
      field: "orderId.customerName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Product Name",
      field: "productName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Product Category",
      field: "category",
      sortable: true,
      filter: true,
    },
    { headerName: "Size", field: "size", sortable: true, filter: true },
    { headerName: "GSM", field: "gsm", sortable: true, filter: true },
    { headerName: "Qty", field: "quantity", sortable: true, filter: true },
    { headerName: "Prod Qty", field: "prodQty", sortable: true, filter: true },
    {
      headerName: "Action",
      pinned: "right",
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: (params) => {
        const item = params.data;
        console.log(item);
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
              title="Start Printing"
              style={{ marginRight: "10px" }}
              onClick={() => startPrinting(item._id)}
            />
            <TrashFill
              className="mx-2"
              onClick={() => deleteProduction(item._id)}
            />
            {item.afterPrint === "toyocut" && (
              <UsbMiniFill
                title="Move to Toyocut"
                onClick={() => moveToToyocut(item)}
              />
            )}
            {item.afterPrint === "packaging" && <Truck variant="primary" />}
          </div>
        );
      },
      minWidth: 300,
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    resizable: true,
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
        onGridReady={(params) => setGridApi(params.api)}
      />
    </div>
  );
};

export default Xerox;
