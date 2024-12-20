import React, { useEffect, useState } from "react";
import { Container, Button, Breadcrumb } from "react-bootstrap";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import { EyeFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosConfig";
import ViewProduct from "./ViewProduct";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { AgGridReact } from "ag-grid-react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get("/api/orders");
      setOrders(response.data);
    };
    fetchOrders();
  }, []);

  const deleteCell = async (id) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `http://localhost:5000/api/orders/${id}`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          setOrders((prev) => prev.filter((item) => item._id !== id));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("An error occurred!");
      }
    }
  };

  const handleShowModal = (product) => {

    setShowDetails(product);
    setShowModal(true);
  };

  const editProduct = (row) => {
    navigate("/order", { state: { rowData: row, edit: true } });
  };

  const ActionButtonRenderer = (props) => {
    return (
      <div style={{ cursor: "pointer" }}>
        {" "}
        <EyeFill
          onClick={() => handleShowModal(props.data.product)}
          className="mx-2"
        />
        <PencilSquare
          onClick={() => editProduct(props.data)}
          className="mx-2"
        />
        <TrashFill onClick={() => deleteCell(props.data._id)} />
      </div>
    );
  };

  const columns = [
    {
      headerName: "Customer Name",
      field: "customerName",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Customer Name provided",
    },
    {
      headerName: "Customer No",
      field: "customerNo",
      minWidth: 135,
      tooltipValueGetter: (params) => params.value || "No Customer No provided",
    },
    {
      headerName: "Customer Address",
      field: "customerAdd",
      minWidth: 165,
      tooltipValueGetter: (params) => params.value || "No Address provided",
    },
    {
      headerName: "Invoice No",
      field: "invoiceNo",
      minWidth: 120,
      tooltipValueGetter: (params) => params.value || "No Invoice No provided",
    },
    {
      headerName: "Date",
      field: "date",
      minWidth: 125,
      filter: 'agDateColumnFilter',
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
        inRangeFloatingFilterDateFormat: 'yyyy-MM-dd'
      },
      // Keep the original valueFormatter if you want to display dates in a specific format
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '',
      tooltipValueGetter: (params) =>
        params.value ? `Date & Time: ${new Date(params.value).toLocaleDateString()} ${new Date(params.value).toLocaleTimeString()}` : "No Date provided",
    },
    {
      headerName: "Order Age",
      field: "age",
      minWidth: 115,
      tooltipValueGetter: (params) => `Order Age: ${params.value || "N/A"}`,
    },
    {
      headerName: "Updated Date",
      field: "updatedAt",
      minWidth: 140,
      filter: 'agDateColumnFilter',
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
        inRangeFloatingFilterDateFormat: 'yyyy-MM-dd'
      },
      // Keep the original valueFormatter if you want to display dates in a specific format
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '',
      tooltipValueGetter: (params) =>
        params.value ? `Updated Date & Time: ${new Date(params.value).toLocaleDateString()} ${new Date(params.value).toLocaleTimeString()}` : "No Updated Date provided",
    },
    {
      headerName: "Sales Executive",
      field: "salesExecutive",
      minWidth: 145,
      tooltipValueGetter: (params) => `Sales Executive: ${params.value || "N/A"}`,
    },
    {
      headerName: "Payment Method",
      field: "paymentMethod",
      minWidth: 160,
      tooltipValueGetter: (params) => {
        const advance = JSON.parse(params.data.advance);
        const couriercharges = params.data.courierCharges;
        if (params.data.paymentMethod == "Advance") {
          return `Amount : ${advance.advanceAmount}\nDate : ${advance.advanceDate}\nType : ${advance.advanceType}\nCourier Charges : ${couriercharges}`;
        } else {
          return "";
        }
      },
      tooltipComponentParams: {
        html: true,
      },
    },
    {
      headerName: "Actions",
      width: 100,
      pinned: "right",
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
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

  const gridOptions = {
    enableBrowserTooltips: true, // Enable browser tooltips globally
    tooltipShowDelay: 500, // Set a delay for the tooltip
  };

  return (
    <Container style={{ maxWidth: "2000px", padding: "0 20px" }}>
     
      <div
      className="m-1"
       style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div className="search-bar">
          <Button onClick={() => navigate("/order")}>Create Order</Button>
        </div>
      </div>

      <div
        className={"ag-theme-quartz"}
        style={{ width: "100%", height: "80vh" }}
      >
        <AgGridReact
          rowData={orders}
          pagination={true}
          gridOptions={gridOptions}
          columnDefs={columns}
          defaultColDef={defaultColDef}
        />
      </div>

      

      {showModal && (
        <ViewProduct
          showModal={showModal}
          setShowModal={setShowModal}
          details={showDetails}
        />
      )}
    </Container>
  );
};

export default Dashboard;
