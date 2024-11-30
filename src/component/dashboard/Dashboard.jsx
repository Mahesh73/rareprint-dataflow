import React, { useEffect, useState } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import {
  Table,
  Container,
  OverlayTrigger,
  Tooltip,
  Button,
  Breadcrumb,
} from "react-bootstrap";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import { EyeFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosConfig";
import ViewProduct from "./ViewProduct";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { AgGridReact } from "ag-grid-react";

// const GlobalFilter = ({ filter, setFilter }) => {
//   return (
//     <span>
//       <input
//         value={filter || ""}
//         onChange={(e) => setFilter(e.target.value || undefined)}
//         placeholder="Search orders..."
//         className="search-input"
//       />
//     </span>
//   );
// };

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get("/api/orders");
      setOrders(response.data);
      setRows(response.data);
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

  const renderTooltip = (props, value, courierCharges) => {
    const advance = JSON.parse(value);
    console.log(advance);
    return (
      <Tooltip id="cell-tooltip" {...props}>
        <span>Amount - {advance.advanceAmount}</span>
        <br />
        <span>Amount Date - {advance.advanceDate}</span>
        <br />
        <span>Amount type - {advance.advanceType}</span>
        <br />
        <span> Courier Charges - {courierCharges}</span>
      </Tooltip>
    );
  };

  const handleShowModal = (product) => {
    console.log(product);
    setShowDetails(product);
    setShowModal(true);
  };

  const editProduct = (row) => {
    navigate("/order", { state: { rowData: row, edit: true } });
  };

  const ActionButtonRenderer = (props) => {
    return (
      <div>
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

  // Define columns for the table
  const columns = [
    {
      headerName: "Customer Name",
      field: "customerName",
    },
    {
      headerName: "Customer No",
      field: "customerNo",
    },
    {
      headerName: "Customer Add",
      field: "customerAdd",
    },
    {
      headerName: "Invoice No",
      field: "invoiceNo",
    },
    {
      headerName: "Date",
      field: "date",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: "Order Age",
      field: "age",
    },
    {
      headerName: "Updated Date",
      field: "updatedAt",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: "Sales Executive",
      field: "salesExecutive",
    },
    {
      headerName: "Payment Method",
      field: "paymentMethod",
      tooltipValueGetter: (params) => {
        const advance = JSON.parse(params.data.advance);
        const couriercharges = params.data.courierCharges;
        // Use HTML <br /> for line breaks
        if (params.data.paymentMethod == "Advance") {
          return `Amount: ${advance.advanceAmount}\nDate: ${advance.advanceDate}\nType: ${advance.advanceType}\nCourier-Charges: ${couriercharges}`;
        }else {
          return'';
        }
      },
      // Enable the `tooltipComponentParams` to allow HTML rendering in the tooltip
      tooltipComponentParams: {
        html: true, // Allow HTML in tooltip text
      },
    },
    {
      headerName: "Actions",
      minWidth: 100,
      cellRenderer: ActionButtonRenderer,
    },
  ];

  const defaultColDef = {
    flex: 1,
  };

  const gridOptions = {
    enableBrowserTooltips: true, // Enable browser tooltips globally
    tooltipShowDelay: 500, // Set a delay for the tooltip
  };

  return (
    <Container>
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
          {/* <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
            className="mt-3"
          /> */}
          <Button onClick={() => navigate("/order")}>Create Order</Button>
        </div>
      </div>

      {/* <!--ag grid --! */}

      <div
        className={"ag-theme-quartz"}
        style={{ width: "100%",   height: "calc(100vh - 100px)", }}
      >
        <AgGridReact
          rowData={rows}
          pagination={true}
          gridOptions={gridOptions}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          domLayout="autoHeight" // Adjusts height dynamically
        />
      </div>

      {/* <div className="table-scrollable">
        <Table {...getTableProps()} striped bordered hover className="table">
          <thead style={{ position: "sticky", top: 0 }}>
            {headerNameGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, _i) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={_i}
                    style={{ cursor: "pointer", minWidth: column.minWidth }}
                  >
                    {column.render("Header")}{" "}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, _i) => (
                    <td {...cell.getCellProps()} key={_i}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div> */}
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
