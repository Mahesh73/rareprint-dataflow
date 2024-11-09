import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const AddProduct = ({
  setShowModal,
  showModal,
  productData,
  productName,
  productDetail,
  products,
  setProducts,
  edit,
}) => {
  const [modelData, setModelData] = useState({
    quantity: edit ? products[productDetail.index].quantity : 0,
    amount: edit ? products[productDetail.index].amount : 0,
    design: null,
    productDescription: edit
      ? products[productDetail.index].productDescription
      : "",
  });
  const handleCloseModal = () => setShowModal(false);
  const handleAddProduct = () => {
    if (modelData.quantity && modelData.amount) {
      const newProduct = {
        productName,
        category: productDetail.category,
        quantity: modelData.quantity,
        size: productDetail.size,
        gsm: productDetail.gsm,
        amount: modelData.amount,
        productDescription: modelData.productDescription,
        design: modelData.design,
        status: [{ status: "Created", updatedAt: new Date() }],
      };
      productData(newProduct);
      setShowModal(false);
    } else {
      alert("Please fill in all the fields");
    }
  };
  const handleUpdateProduct = () => {
    products[productDetail.index].quantity = modelData.quantity;
    products[productDetail.index].amount = modelData.amount;
    products[productDetail.index].design = modelData.design;
    products[productDetail.index].productDescription =
      modelData.productDescription;
    setProducts(products);
    setShowModal(false);
    console.log(products);
  };
  const handleProductDetails = (e) => {
    const { name, value } = e.target;
    setModelData({
      ...modelData,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    setModelData({
      ...modelData,
      design: e.target.files[0],
    });
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {productName} ({productDetail.category} {productDetail.size} size {""}
          {productDetail.gsm} GSM)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddProduct}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={modelData.quantity}
                onChange={handleProductDetails}
                placeholder="Enter quantity"
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={modelData.amount}
                onChange={handleProductDetails}
                placeholder="Enter Amount"
                required
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} controlId="formDesign">
              <Form.Label>Attach Design</Form.Label>
              <Form.Control
                type="file"
                name="design"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="formProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="productDescription"
                placeholder="Enter any additional information"
                value={modelData.productDescription}
                onChange={handleProductDetails}
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="submit"
          onClick={() => setShowModal(false)}
        >
          Close
        </Button>
        {edit ? (
          <Button variant="primary" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        ) : (
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddProduct;
