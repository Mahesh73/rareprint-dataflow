import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Breadcrumb } from "react-bootstrap";
import CreateVendor from "./CreateVendor";
import { AgGridReact } from "ag-grid-react";
import axiosInstance from "../../axiosConfig";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";
import { confirmationDialog } from "../../common/ConfirmationDialog";
import { toast } from "react-toastify";
const Vendor = () => {
  const [show, setShow] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [editVendor, setEditVendor] = useState(null); 
  const gridApiRef = useRef(null); // Reference for AG Grid's API

  const createVendor = () => {
    setEditVendor(null); 
    setShow(true);
  };

  useEffect(() => {
    // Fetch packaging orders data from the backend
    const fetchVendor = async () => {
      try {
        axiosInstance.get("/api/vendor").then((res) => {
          setVendor(res.data);
        });
      } catch (error) {
        console.error("Error fetching packaging orders:", error);
      }
    };

    fetchVendor();
  }, []);

  const defaultColDef = {
    flex: 1,
    filter: true,
    filterParams: {
      buttons: ["reset", "apply"],
    },
  };

  const updateVendor = async (vendorData) => {
    setEditVendor(vendorData); // Set the vendor being edited
    setShow(true);
  }

  const deleteVendor = async (vendorID) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Order",
      text: "Are you sure you want to delete this order?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      axiosInstance
        .delete(`/api/vendor/delete/${vendorID}`)
        .then((res) => {
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
        <PencilSquare 
        style={{ marginRight: "10px", cursor: "pointer" }}
        onClick={() => updateVendor(props.data)}
           />
        <TrashFill
          style={{ marginRight: "10px", cursor: "pointer" }}
          onClick={() => deleteVendor(_id)}
        />
      </div>
    );
  };

  const columnDefs = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    {
      headerName: "Number",
      field: "contactNumber",
      sortable: true,
      filter: true,
    },
    { headerName: "City", field: "city", sortable: true, filter: true },
    { headerName: "Address", field: "address", sortable: true, filter: true },
    {
      headerName: "Actions",
      minWidth: 40,
      maxWidth: 100,
      pinned: "right",
      field: "action",
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: ActionButtonRenderer,
    },
  ];

  return (
    <div className="m-3">
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
          <Breadcrumb.Item active>Vendor</Breadcrumb.Item>
        </Breadcrumb>
        <div className="search-bar">
          <Button onClick={() => createVendor()}>Create Vendor</Button>
        </div>
      </div>

      <div
        className={"ag-theme-quartz"}
        style={{ width: "100%", height: "80vh" }}
      >
        <AgGridReact
          rowData={vendor}
          pagination={true}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={(params) => (gridApiRef.current = params.api)}
        />
      </div>

      {/* {show && <CreateVendor show={show} setShow={setShow}  setVendor={setVendor}/>} */}
      {/* {show && (
        <CreateVendor
          show={show}
          setShow={setShow}
          setVendor={(newVendor) => {
            setVendor((prev) => [...prev, newVendor]);
            gridApiRef.current?.applyTransaction({ add: [newVendor] }); // Add row to grid
          }}
          vendorData={editVendor}
        />
      )} */}
      {show && (
        <CreateVendor
          show={show}
          setShow={setShow}
          setVendor={(newVendor) => {
            if (editVendor) {
              setVendor((prev) =>
                prev.map((item) => (item._id === newVendor._id ? newVendor : item))
              );
            } else {
              setVendor((prev) => [...prev, newVendor]);
            }
          }}
          vendorData={editVendor}
        />
      )}
    </div>
  );
};

export default Vendor;
