import React, { useEffect, useState } from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { PrinterFill, TrashFill, Truck } from "react-bootstrap-icons";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

const OutSource = () => {
  const [outsource, setOutsource] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    axiosInstance.get("/api/outsource").then((res) => {
      setOutsource(res.data);
    });
  }, [show]);

  const deleteVendor = async (outsourceID) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/outsource/${outsourceID}`)
        .then((res) => {
          toast.success(res.data.message);
          setOutsource((prev) => prev.filter((item) => item._id !== outsourceID));
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
    {
      headerName: "Vendor Name",
      field: "vendorName",
      minWidth: 150,
      tooltipValueGetter: (params) =>
        params.value || "No Vendor Name specified",
    },
    {
      headerName: "Category",
      field: "category",
      tooltipValueGetter: (params) => params.value || "No Category specified",
      minWidth: 150,
    },
    {
      headerName: "Cost",
      field: "cost",
      tooltipValueGetter: (params) =>
        params.value ? `Cost: ${params.value}` : "No Cost specified",
      minWidth: 80,
    },
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
      tooltipValueGetter: (params) =>
        params.value
          ? `Created Date & Time At: ${new Date(
              params.value
            ).toLocaleDateString()} ${new Date(
              params.value
            ).toLocaleTimeString()}`
          : "No Creation Date specified",
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
      tooltipValueGetter: (params) =>
        params.value
          ? `Due Date: ${new Date(params.value).toLocaleDateString()}`
          : "No Due Date specified",
    },
    {
      headerName: "Extra Charges",
      field: "extraCharges",
      minWidth: 150,
      tooltipValueGetter: (params) =>
        params.value ? `Extra Charges: ${params.value}` : "No Extra Charges",
    },
    {
      headerName: "GSM",
      field: "gsm",
      minWidth: 80,
      tooltipValueGetter: (params) => params.value || "No GSM specified",
    },
    {
      headerName: "Order ID",
      field: "orderId",
      minWidth: 150,
      tooltipValueGetter: (params) => params.value || "No Order ID specified",
    },
    {
      headerName: "Other Details",
      field: "otherDetails",
      minWidth: 150,
      tooltipValueGetter: (params) =>
        params.value || "No Other Details specified",
    },
    {
      headerName: "Product ID",
      field: "productId",
      minWidth: 150,
      tooltipValueGetter: (params) => params.value || "No Product ID specified",
    },
    {
      headerName: "Product Name",
      field: "productName",
      minWidth: 150,
      tooltipValueGetter: (params) =>
        params.value || "No Product Name specified",
    },
    {
      headerName: "Quantity",
      field: "quantity",
      minWidth: 80,
      tooltipValueGetter: (params) =>
        params.value ? `Quantity: ${params.value}` : "No Quantity specified",
    },
    {
      headerName: "Size",
      field: "size",
      minWidth: 80,
      tooltipValueGetter: (params) => params.value || "No Size specified",
    },
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
      tooltipValueGetter: (params) =>
        params.value
          ? `Updated Date & Time At: ${new Date(
              params.value
            ).toLocaleDateString()} ${new Date(
              params.value
            ).toLocaleTimeString()}`
          : "No Update Date specified",
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

  const gridOptions = {
    enableBrowserTooltips: true, // Enable browser tooltips globally
    tooltipShowDelay: 500, // Set a delay for the tooltip
  };

  return (
    <div className="m-3">
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
          rowData={outsource}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default OutSource;
