import React, { useEffect, useState } from "react";
import { Breadcrumb, Tooltip } from "react-bootstrap";
import { GearFill, InfoCircleFill, TrashFill } from "react-bootstrap-icons";
import { PencilSquare } from "react-bootstrap-icons";
import axiosInstance from "../../axiosConfig";
import StartProduction from "./StartProduction";
import { toast } from "react-toastify";
import moment from "moment";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { useNavigate } from "react-router-dom"; /*Added by mahendra*/
import { AgGridReact } from "ag-grid-react"; /*Added by mahendra*/
import "./Production.css"
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

  // const renderTooltip = (props, value) => {
  //   return (
  //     <Tooltip id="cell-tooltip" {...props}>
  //       {value.map((item) => (
  //         <>
  //           <span>
  //             {item.status} {moment(item.updatedAt).format("DD-MM-YYYY")}
  //           </span>
  //           <br />
  //         </>
  //       ))}
  //     </Tooltip>
  //   );
  // };

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

  const ActionButtonRenderer = (props) => {
    return (
      <div style={{cursor: 'pointer'}}>
        {!props.data?.production && (
          <GearFill
            onClick={() => handleShow(props.data)}
            title="Create Production"
            className="mx-2"
          />
        )}

        {props.data.status[props.data.status.length - 1].status ===
          "Printing" && (
          <PencilSquare
            onClick={() => updateProduction(props.data)}
            title="Update Production"
            className="mx-2"
          />
        )}

        {props.data.status[props.data.status.length - 1].status !==
          "Created" && (
          <TrashFill
            onClick={() =>
              deleteProduct(props.data.orderId, props.data.productId)
            }
          />
        )}
      </div>
    );
  };

  const StatusCellRenderer = ({ data }) => {
    if (data && data.status) {
      return (
        <div>
          <span>{data.status[data.status.length - 1].status}</span>
          <InfoCircleFill
            style={{ marginLeft: '5px', cursor: 'pointer', color: '#000914' }}
          />
        </div>
      );
    }
    return null;
  };

  const DueDateRenderer = (props) => {
      const currentDate = new Date().setHours(0, 0, 0, 0);
        const dueDate = new Date(props.data.production?.dueDate).setHours(
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
            {props.data.production?.dueDate}
          </span>
        );
     
  };

 const ProductiontypeRenderer  = (props) => { 
    return(
      <div>
     
      </div>
      )
  };

  const columns = [
    {
      headerName: "Invoice No",
      field: "invoiceNo",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Invoice Number",
    },
    {
      headerName: "Customer Name",
      field: "customerName",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Customer Name",
    },
    {
      headerName: "Product Name",
      field: "productName",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Product Name",
    },
    {
      headerName: "Product Category",
      field: "productCategory",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Product Category",
    },
    {
      headerName: "Production Type",
      field: "chooseType",
      minWidth: 155,
      tooltipValueGetter: (params) => {
        if (params.data && params.data.production) {
          const { chooseType, selectMachine } = params.data.production;
    
          if (chooseType === "outsource") {
            return "OutSource";
          } else if (chooseType === "inHouse") {
            return selectMachine
              ? `InHouse - Machine: ${selectMachine.toUpperCase()}`
              : "InHouse";
          } else if (chooseType === "sheetProduction") {
            return "Sheet Production";
          }
        }
        return "No Production Type Specified";
      },
      tooltipComponentParams: {
        html: true, // Allow HTML in tooltip text
      },
      // cellRenderer: ProductiontypeRenderer,
      cellRenderer: (params) => {
        if (params.data && params.data.production) {
          const { chooseType, selectMachine } = params.data.production;
    
          if (chooseType === "outsource") {
            return "OutSource";
          } else if (chooseType === "inHouse") {
            return selectMachine ? `InHouse (${selectMachine.toUpperCase()})` : "InHouse";
          } else if (chooseType === "sheetProduction") {
            return "Sheet Production";
          }
        }
       
      },

    },
    {
      headerName: "Size",
      field: "size",
      minWidth: 100,
      tooltipValueGetter: (params) => params.value || "No Size Specified",
    },
    {
      headerName: "QTY",
      field: "qty",
      minWidth: 80,
      tooltipValueGetter: (params) => params.value || "No Quantity Specified",
    },
    {
      headerName: "GSM",
      field: "gsm",
      minWidth: 80,
      tooltipValueGetter: (params) => params.value || "No GSM Specified",
    },
    {
      headerName: "Amount",
      field: "amount",
      minWidth: 100,
      tooltipValueGetter: (params) => params.value ? `Amount: ${params.value}` : "No Amount Specified",
    },
    {
      headerName: "Due Date",
      field: "production.dueDate", // Note the nested field path
      minWidth: 100,
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
        inRangeFloatingFilterDateFormat: 'yyyy-MM-dd'
      },
      // Keep the existing cell renderer for color-coding
      cellRenderer: DueDateRenderer,
      valueGetter: (params) => {
        // Ensure we can retrieve the date even with nested structure
        return params.data.production?.dueDate;
      },
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '',
    },
    {
      headerName: "Status",
      field: "status",
      minWidth: 110,
      tooltipValueGetter: (params) => {
        if (params.data && params.data.status) {
          return params.data.status
            .map(
              (item) =>
                `${item.status} - ${moment(item.updatedAt).format(
                  "DD-MM-YYYY"
                )}\n`
            )
            .join(""); // Join all statuses with line breaks
        }
        return "";
      },
      tooltipComponentParams: {
        html: true, // Allow HTML in tooltip text
      },
     
      cellRenderer: StatusCellRenderer, // Use the React component directly

    },
    {
      headerName: "Sales Executive",
      field: "salesExecutive",
      minWidth: 155,
      tooltipValueGetter: (params) => params.value || "No Sales Executive Assigned",
    },
    {
      headerName: "Actions",
      minWidth: 40,
      maxWidth:100,
      pinned: "right",
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: ActionButtonRenderer,
      
    },
  ];

  //boc my mahendra
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
  //eoc by mahendra
  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({ columns, data: orders });
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
          <Breadcrumb.Item
            onClick={goToDashboard}
            style={{ cursor: "pointer" }}
          >
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Production</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {/* <div className="table-scrollable">
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
      </div> */}
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
          domLayout="normal"  // Adjusts height dynamically
        />
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
