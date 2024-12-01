import React, { useState , useEffect } from "react";
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
  handleCloseModal
}) => {
  const [modelData, setModelData] = useState({
    quantity: edit ? products[productDetail.index].quantity : 0,
    amount: edit ? products[productDetail.index].amount : 0,
    design: edit ? products[productDetail.index].design : null, 
    productDescription: edit
      ? products[productDetail.index].productDescription
      : "",
  });

  useEffect(() => {
    if (edit) {
      setModelData({
        quantity: products[productDetail.index].quantity,
        amount: products[productDetail.index].amount,
        design: products[productDetail.index].design, 
        productDescription: products[productDetail.index].productDescription,
      });
    }
  }, [edit, productDetail.index, products]);

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
  };
  const handleProductDetails = (e) => {
    const { name, value } = e.target;
    setModelData({
      ...modelData,
      [name]: value,
    });
  };
  // const handleFileChange = (e) => {
  //   setModelData({
  //     ...modelData,
  //     design: e.target.files[0],
  //   });
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the file
    setModelData({
      ...modelData,
      design: file, // Set the file in the state
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
                accept="image/jpeg, image/png, image/webp, image/svg"
              />
              {modelData.design && (
                <small className="d-block mt-2">
                  <strong>Current File: </strong>{modelData.design.name}
                </small>
              )}
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
          onClick={handleCloseModal}
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
