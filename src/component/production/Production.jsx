import React, { useEffect, useState } from "react";
import { Breadcrumb, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useTable } from "react-table";
import { GearFill, InfoCircleFill, TrashFill } from "react-bootstrap-icons";
import { PencilSquare } from "react-bootstrap-icons";
import axiosInstance from "../../axiosConfig";
import StartProduction from "./StartProduction";
import { toast } from "react-toastify";
import moment from "moment";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import {  useNavigate } from "react-router-dom"; /*Added by mahendra*/
const Production = () => {
  const [orders, setOrders] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  useEffect(() => {
    axiosInstance.get("/api/production-details").then((res) => {
      setOrders(res.data);
    });
  }, [show]);
  const deleteProduct = async (orderId, productId) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Production",
      text: "Are you sure you want to delete this order from Production?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/orders/${orderId}/products/${productId}`)
        .then((res) => {
          toast.success(res.data.message);
          setOrders((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
        });
    }
  };
  const handleShow = (row) => {
    setSelectedOrder(row);
    setShow(true);
  };

  const renderTooltip = (props, value) => {
    return (
      <Tooltip id="cell-tooltip" {...props}>
        {value.map((item) => (
          <>
            <span>
              {item.status} {moment(item.updatedAt).format("DD-MM-YYYY")}
            </span>
            <br />
          </>
        ))}
      </Tooltip>
    );
  };

  const updateProduction = (row) => {
    setSelectedOrder(row);
    setShow(true);
  };

  // BOC by mahendra 
  let navigate = useNavigate();
  const goToDashboard = () => {
    navigate("/"); // Navigate to the home page or dashboard
  };
  // EOC by mahendra

  const columns = React.useMemo(
    () => [
      {
        Header: "Invoice No",
        accessor: "invoiceNo",
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Product Name",
        accessor: "productName",
      },
      {
        Header: "Product Category",
        accessor: "productCategory",
      },
      {
        Header: "Production Type",
        accessor: "chooseType",
        Cell: ({ row }) => {
          return (
            row.original.production &&
            (row.original.production?.chooseType === "outsource" ? (
              "OutSource"
            ) : row.original.production?.chooseType === "inHouse" ? (
              row.original.production.selectMachine ? (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      {row.original.production.selectMachine.toUpperCase()}
                    </Tooltip>
                  }
                >
                  <span>InHouse</span>
                </OverlayTrigger>
              ) : (
                "InHouse"
              )
            ) : (
              "Sheet Production"
            ))
          );
        },
      },
      {
        Header: "Size",
        accessor: "size",
      },
      {
        Header: "QTY",
        accessor: "qty",
      },
      {
        Header: "GSM",
        accessor: "gsm",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
        minWidth: 100,
        Cell: ({ row }) => {
          const currentDate = new Date().setHours(0, 0, 0, 0);
          const dueDate = new Date(row.original.production?.dueDate).setHours(
            0,
            0,
            0,
            0
          );
          const check =
            currentDate == dueDate
              ? "today"
              : currentDate > dueDate
              ? "pass"
              : "wait";
          return (
            <span
              style={{
                backgroundColor:
                  check === "today"
                    ? "#FFFF80"
                    : check === "pass"
                    ? "red"
                    : "none",
                borderRadius: "5px",
                padding: "1px",
              }}
            >
              {row.original.production?.dueDate}
            </span>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        minWidth: 110,
        Cell: ({ row }) => (
          <>
            {row.original.status[row.original.status.length - 1].status} {""}
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) => renderTooltip(props, row.original.status)}
            >
              <InfoCircleFill />
            </OverlayTrigger>
          </>
        ),
      },
      {
        Header: "Sales Executive",
        accessor: "salesExecutive",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div style={{ cursor: "pointer" }}>
            {!row.original?.production && (
              <GearFill onClick={() => handleShow(row.original)} 
              title="Create Production"
              className="mx-2"/>
            )}
            {row.original.status[row.original.status.length - 1].status ===
              "Printing" && (
              <PencilSquare
                onClick={() => updateProduction(row.original)}
                title="Update Production"
                className="mx-2"
              />
            )}
            {row.original.status[row.original.status.length - 1].status !==
              "Created" && <TrashFill
              onClick={() =>
                deleteProduct(row.original.orderId, row.original.productId)
              }
            />}
          </div>
        ),
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: orders });
  return (
    <div className="m-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item onClick={goToDashboard} style={{ cursor: 'pointer' }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Production</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="table-scrollable">
        <Table {...getTableProps()} striped bordered hover>
          <thead>
            {headerGroups?.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, _i) => (
                  <th
                    key={_i}
                    {...column.getHeaderProps({
                      style: { minWidth: column.minWidth, width: column.width },
                    })}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows?.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row?.cells?.map((cell, _i) => {
                    return (
                      <td {...cell.getCellProps()} key={_i}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <StartProduction
        show={show}
        setShow={setShow}
        productId={selectedOrder.productId}
        orderId={selectedOrder.orderId}
        details={selectedOrder}
        productionData={selectedOrder?.production}
      />
    </div>
  );
};

export default Production;
