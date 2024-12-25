import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import { AgGridReact } from "ag-grid-react";
import { Container } from "react-bootstrap";


const Packaging = () => {
  const [packagingOrders, setPackagingOrders] = useState([]);
  const columnDefs =  [
    { headerName: "Invoice No", field: "invoiceNo", sortable: true, filter: true },
    { headerName: "Customer Name", field: "customerName", sortable: true, filter: true },
    { headerName: "Product Name", field: "productName", sortable: true, filter: true },
    { headerName: "Product Category", field: "productCategory", sortable: true, filter: true },
    { headerName: "Quantity", field: "quantity", sortable: true, filter: true },
    { headerName: "Status", field: "packagingStatus", sortable: true, filter: true },
  ];

  useEffect(() => {
    // Fetch packaging orders data from the backend
    const fetchPackagingOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/packaging");
        setPackagingOrders(response.data);
      } catch (error) {
        console.error("Error fetching packaging orders:", error);
      }
    };

    fetchPackagingOrders();
  }, []);

  const defaultColDef = {
    flex: 1,
    filter: true,
    filterParams: {
      buttons: ["reset", "apply"], // This adds clear/reset functionality to all filters
    },
  };

  return (
    <Container style={{ maxWidth: "2000px", padding: "0 20px" }}>
    <div className="ag-theme-quartz" style={{ width: "100%", height: "80vh" }}>
      <h2>Packaging Orders</h2>
      <AgGridReact
        rowData={packagingOrders}
        columnDefs={columnDefs}
        pagination={true}
        defaultColDef={defaultColDef}
        paginationPageSize={10}
      />
    </div>
    </Container>
  );
};

export default Packaging;
