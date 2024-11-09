import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { TrashFill } from "react-bootstrap-icons";
import { PencilSquare } from "react-bootstrap-icons";
import { useTable } from "react-table";
import "./Product.css";
const Product = () => {
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [enableEdit, setEnableEdit] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState("");
  const [rate, setRate] = useState(0);
  const [products, setProducts] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [qtyRate, setQtyrate] = useState([]);
  const handleAddProduct = () => {
    if (productName && size && qtyRate?.length) {
      const newProduct = {
        productName,
        size,
        qtyRate,
      };
      setProducts([...products, newProduct]);
      setProductName("");
      setQuantity(0);
      setSize("");
      setRate(0);
      setShowModal(false);
    } else {
      alert("Please fill in all the fields");
    }
    console.log(products);
  };
  const addToList = () => {
    setQtyrate([...qtyRate, { quantity, rate }]);
    setQuantity(0);
    setRate(0);
  };
  const edit = (i) => {
    setQuantity(qtyRate[i].quantity);
    setRate(qtyRate[i].rate);
    setEnableEdit(true);
    setEditRow(i);
  };
  const editfromQty = () => {
    const edit = qtyRate.map((item, index) => {
      if (index === editRow) {
        item.quantity = quantity;
        item.rate = rate;
      }
      return item;
    });
    setQtyrate(edit);
    setQuantity(0);
    setRate(0);
    setEnableEdit(false);
    setEditRow(null);
  };
  const deleteQtyRate = (ind) => {
    const deleteData = qtyRate.filter((item, i) => i !== ind);
    setQtyrate(deleteData);
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Product Name",
        accessor: "productName", // accessor is the "key" in the data
      },
      {
        Header: "Size",
        accessor: "size",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => alert(`Viewing order ${row.original.productName}`)}
          >
            View
          </button>
        ),
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: products });
  const ProductList = () => {
    return (
      <Container className="mt-5">
        <Table {...getTableProps()} striped bordered hover>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    );
  };
  return (
    <div className="product">
      <div className="product-header">
        <h3>Product</h3>
        <Button onClick={handleShowModal} size="sm">Add Product</Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col lg="8">
                <Form.Group as={Col}>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>
              <Form.Group as={Col}>
                <Form.Label>Size</Form.Label>
                <Form.Control
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mt-3">
              <Form.Group as={Col}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter qty"
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Enter rate "
                  required
                />
              </Form.Group>
              <Col lg="2">
                {!enableEdit ? (
                  <Button
                    variant="primary"
                    className="mt-4"
                    size="sm"
                    onClick={addToList}
                  >
                    <Plus size={20} />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="mt-4"
                    size="sm"
                    onClick={editfromQty}
                  >
                    Edit
                  </Button>
                )}
              </Col>
            </Row>
            {qtyRate?.length > 0 && (
              <Row className="m-2">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th style={{ width: "100px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qtyRate.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.quantity}</td>
                          <td>{item.rate}</td>
                          <td>
                            <Button
                              size="sm"
                              className="m-2"
                              onClick={() => edit(index)}
                            >
                              <PencilSquare size={10} />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deleteQtyRate(index)}
                            >
                              <TrashFill size={10} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
      <ProductList />
    </div>
  );
};

export default Product;
