import React, { useState } from "react";
import { useTable, useGlobalFilter } from "react-table";
import {
  Table,
  Container,
  OverlayTrigger,
  Tooltip,
  Button,
  Breadcrumb,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Vendor = () => {
  const [data, setData] = useState([]);
  const initialVendorState = {
    vendorName: "",
    product: "",
    dueDate: "",
    cost: ""
  };
  
  const [newVendor, setNewVendor] = useState(initialVendorState);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVendorIndex, setCurrentVendorIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!newVendor.vendorName.trim()) errors.vendorName = "Vendor name is required";
    if (!newVendor.product.trim()) errors.product = "Product is required";
    if (!newVendor.dueDate) errors.dueDate = "Due date is required";
    if (!newVendor.cost || isNaN(newVendor.cost) || Number(newVendor.cost) <= 0) {
      errors.cost = "Please enter a valid cost";
    }
    return errors;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Vendor Name",
        accessor: "vendorName",
      },
      {
        Header: "Product",
        accessor: "product",
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString()
      },
      {
        Header: "Cost",
        accessor: "cost",
        Cell: ({ value }) => parseFloat(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row: { original, index } }) => (
          <div className="d-flex gap-2">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit Vendor</Tooltip>}
            >
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => {
                  console.log('Edit clicked for index:', index, 'data:', original);
                  handleEdit(index, original);
                }}
              >
                <PencilSquare />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete Vendor</Tooltip>}
            >
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDelete(index)}
              >
                <Trash />
              </Button>
            </OverlayTrigger>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns,
    data
  });

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows, 
    prepareRow 
  } = tableInstance;

  const handleCreate = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const formattedVendor = {
        ...newVendor,
        cost: parseFloat(newVendor.cost).toFixed(2)
      };

      if (editMode && currentVendorIndex !== null) {
        setData(prevData => {
          const newData = [...prevData];
          newData[currentVendorIndex] = formattedVendor;
          return newData;
        });
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setData(prevData => [...prevData, formattedVendor]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving vendor:', error);
      alert('An error occurred while saving the vendor. Please try again.');
    }
  };

  const handleEdit = (index, rowData) => {
    console.log('handleEdit called with index:', index, 'rowData:', rowData);
    try {
      if (rowData) {
        const editedVendor = {
          vendorName: rowData.vendorName,
          product: rowData.product,
          dueDate: rowData.dueDate,
          cost: rowData.cost.toString()
        };
        
        console.log('Setting edit mode with vendor:', editedVendor);
        setNewVendor(editedVendor);
        setCurrentVendorIndex(index);
        setEditMode(true);
        setShowModal(true);
        setValidationErrors({});
      }
    } catch (error) {
      console.error('Error editing vendor:', error);
      alert('An error occurred while editing the vendor. Please try again.');
    }
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setData(prevData => prevData.filter((_, i) => i !== index));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setNewVendor(initialVendorState);
    setValidationErrors({});
    setCurrentVendorIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const showCreateModal = () => {
    setEditMode(false);
    setCurrentVendorIndex(null);
    setNewVendor(initialVendorState);
    setValidationErrors({});
    setShowModal(true);
  };

  // Modified table rendering to properly handle keys
  const renderTableBody = () => {
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-3">
            No vendors found. Click "Create Vendor" to add one.
          </td>
        </tr>
      );
    }

    return rows.map((row, i) => {
      prepareRow(row);
      return (
        <tr key={`row-${i}`}>
          {row.cells.map((cell, cellIndex) => {
            // Extract the props without the key
            const { key, ...cellProps } = cell.getCellProps();
            return (
              <td key={`cell-${i}-${cellIndex}`} {...cellProps}>
                {cell.render('Cell')}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <Container>
      {showAlert && (
        <Alert variant="success" className="mt-3">
          Vendor successfully {editMode ? 'updated' : 'created'}!
        </Alert>
      )}
      
      <div className="d-flex justify-content-between align-items-center my-3">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Vendors</Breadcrumb.Item>
        </Breadcrumb>
        <Button variant="primary" onClick={showCreateModal}>
          Create Vendor
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          {headerGroups.map((headerGroup, i) => {
            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={`header-${i}`} {...headerGroupProps}>
                {headerGroup.headers.map((column, columnIndex) => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={`header-cell-${i}-${columnIndex}`} {...columnProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {renderTableBody()}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Vendor" : "Create New Vendor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                name="vendorName"
                value={newVendor.vendorName}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.vendorName}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.vendorName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={newVendor.product}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.product}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.product}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newVendor.dueDate}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.dueDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.dueDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                name="cost"
                value={newVendor.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                isInvalid={!!validationErrors.cost}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.cost}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            {editMode ? "Update Vendor" : "Create Vendor"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Vendor;