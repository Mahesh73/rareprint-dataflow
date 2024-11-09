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

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value || undefined)}
        placeholder="Search orders..."
        className="search-input"
      />
    </span>
  );
};

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

  const renderTooltip = (props, value, courierCharges) => {
    const advance = JSON.parse(value);
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
    setShowDetails(product);
    setShowModal(true);
  };

  const editProduct = (row) => {
    navigate("/order", { state: { rowData: row, edit: true } });
  };

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Customer No",
        accessor: "customerNo",
      },
      {
        Header: "Customer Add",
        accessor: "customerAdd",
      },
      {
        Header: "Invoice No",
        accessor: "invoiceNo",
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Updated Date",
        accessor: "updatedAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Sales Executive",
        accessor: "salesExecutive",
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: ({ row }) => {
          return row.original.paymentMethod === "Advance" ? (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) =>
                renderTooltip(
                  props,
                  row.original.advance,
                  row.original.courierCharges
                )
              }
            >
              <span>{row.original.paymentMethod}</span>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>
                  Courier Charges - {row.original.courierCharges}
                </Tooltip>
              }
            >
              <span>{row.original.paymentMethod}</span>
            </OverlayTrigger>
          );
        },
      },
      {
        Header: "Actions",
        minWidth: 100,
        Cell: ({ row }) => (
          <div style={{ cursor: "pointer" }}>
            {row.original.product?.length && <EyeFill
              onClick={() => handleShowModal(row.original.product)}
              className="mx-2"
            />}
            <PencilSquare
              onClick={() => editProduct(row.original)}
              className="mx-2"
            />
            <TrashFill onClick={() => deleteCell(row.original._id)} />
          </div>
        ),
      },
    ],
    []
  );

  // Create a table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable({ columns, data: orders }, useGlobalFilter, useSortBy);

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
          <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
            className="mt-3"
          />
          <Button onClick={() => navigate("/order")}>Create Order</Button>
        </div>
      </div>
      <div className="table-scrollable">
        <Table {...getTableProps()} striped bordered hover className="table">
          <thead style={{ position: "sticky", top: 0 }}>
            {headerGroups.map((headerGroup, i) => (
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
