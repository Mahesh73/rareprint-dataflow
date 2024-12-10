import React, { useEffect, useState } from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { PrinterFill, TrashFill, Truck } from "react-bootstrap-icons";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

const OutSource = () => {
  const [vendor, setVendor] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    axiosInstance.get("/api/outsource").then((res) => {
      setVendor(res.data);
      console.log(res.data);
    });
  }, [show]);

  const deleteVendor = async (vendorID) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/outsource/${vendorID}`)
        .then((res) => {
          console.log(res.data.message);
          toast.success(res.data.message);
          setVendor((prev) => prev.filter((item) => item._id !== vendorID));
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const ActionButtonRenderer = (props) => {
    const { _id } = props.data;
    return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%", // Ensure it spans the full cell height
    }}
    >
      <TrashFill
        style={{ marginRight: "10px", cursor: "pointer" }}
        onClick={() => deleteVendor(_id)}
      />
    </div>
    );
  };
  const columns = [
    { headerName: "Vendor Name", field: "vendorName", minWidth: 150 },
    { headerName: "Category", field: "category", minWidth: 150 },
    { headerName: "Cost", field: "cost", minWidth: 80 },
    {
      headerName: "Created At",
      field: "createdAt",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // Ensure consistent date parsing
          const cellDate = cellValue ? new Date(cellValue) : null;

          if (!cellDate) return -1;

          // Reset both dates to midnight for accurate comparison
          const filterDate = new Date(filterLocalDateAtMidnight);
          filterDate.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);

          if (cellDate < filterDate) return -1;
          if (cellDate > filterDate) return 1;
          return 0;
        },
        browserDatePicker: true,
        // Optional: specify input date format if needed
        inRangeFloatingFilterDateFormat: "yyyy-MM-dd",
      },
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleDateString() : "",
      minWidth: 150,
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // Ensure consistent date parsing
          const cellDate = cellValue ? new Date(cellValue) : null;

          if (!cellDate) return -1;

          // Reset both dates to midnight for accurate comparison
          const filterDate = new Date(filterLocalDateAtMidnight);
          filterDate.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);

          if (cellDate < filterDate) return -1;
          if (cellDate > filterDate) return 1;
          return 0;
        },
        browserDatePicker: true,
        // Optional: specify input date format if needed
        inRangeFloatingFilterDateFormat: "yyyy-MM-dd",
      },
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleDateString() : "",
      minWidth: 150,
    },
    { headerName: "Extra Charges", field: "extraCharges", minWidth: 150 },
    { headerName: "GSM", field: "gsm", minWidth: 80 },
    { headerName: "Order ID", field: "orderId", minWidth: 150 },
    { headerName: "Other Details", field: "otherDetails", minWidth: 150 },
    { headerName: "Product ID", field: "productId", minWidth: 150 },
    { headerName: "Product Name", field: "productName", minWidth: 150 },
    { headerName: "Quantity", field: "quantity", minWidth: 80 },
    { headerName: "Size", field: "size", minWidth: 80 },
    {
      headerName: "Updated At",
      field: "updatedAt",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // Ensure consistent date parsing
          const cellDate = cellValue ? new Date(cellValue) : null;

          if (!cellDate) return -1;

          // Reset both dates to midnight for accurate comparison
          const filterDate = new Date(filterLocalDateAtMidnight);
          filterDate.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);

          if (cellDate < filterDate) return -1;
          if (cellDate > filterDate) return 1;
          return 0;
        },
        browserDatePicker: true,
        // Optional: specify input date format if needed
        inRangeFloatingFilterDateFormat: "yyyy-MM-dd",
      },
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleDateString() : "",
      minWidth: 150,
    },
    {
      headerName: "Actions",
      field: "actions",
      pinned: "right",
      filter: false,
      sortable: false,
      resizable: false,
      width: 100,
      cellRenderer: ActionButtonRenderer,
    },
  ];

  const defaultColDef = {
    flex: 1,
    filter: true,
    filterParams: {
      buttons: ["reset", "apply"], // This adds clear/reset functionality to all filters
    },
  };

  let navigate = useNavigate();
  const goToDashboard = () => {
    navigate("/"); // Navigate to the home page or dashboard
  };

  return (
    <Container style={{ maxWidth: "2000px", padding: "0 20px" }}>
      <div className="m-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Breadcrumb>
            <Breadcrumb.Item
              onClick={goToDashboard}
              style={{ cursor: "pointer" }}
            >
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>OutSource</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div
          className={"ag-theme-quartz"}
          style={{ width: "100%", height: "80vh" }}
        >
          <AgGridReact
            rowData={vendor}
            columnDefs={columns}
            defaultColDef={defaultColDef}
           
            pagination={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default OutSource;
