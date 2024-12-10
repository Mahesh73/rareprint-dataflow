import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import "./OrderForm.css";
import { toast } from "react-toastify";
import { PencilSquare, Plus, TrashFill } from "react-bootstrap-icons";
import AddProduct from "./AddProduct";
import axiosInstance from "../../axiosConfig";
import productList from "../../assets/productList.json";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { confirmationDialog } from "../../common/ConfirmationDialog";
const Order = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [advanceDate, setAdvanceDate] = useState("");
  const [advanceType, setAdvanceType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [formData, setFormData] = useState({
    customerName: "",
    customerNo: "",
    customerAdd: "",
    invoiceNo: "",
    date: "",
    product: "",
    category: "",
    advance: "",
    salesExecutive: "",
    paymentMethod: "",
    description: "",
    designName: "",
    leadSource: "",
    code: "",
    courierCharges: 0,
  });
  let navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      const date = moment(
        location.state.rowData.date,
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      ).format("YYYY-MM-DD");
      location.state.rowData.date = date;
      setFormData(location.state.rowData);
      setProducts(location.state.rowData.product);
      setPaymentMethod(location.state.rowData.paymentMethod);
      const advance = JSON.parse(location.state.rowData.advance);
      setAdvanceAmount(advance.advanceAmount);
      setAdvanceDate(advance.advanceDate);
      setAdvanceType(advance.advanceType);
    }
  }, [location.state]);
  const leadSources = ["Website", "Referral", "Social Media"];
  const advanceTypeList = ["GST", "Non-GST", "Cash"];
  const [edit, setEdit] = useState(false);

  const createOrder = (res) => {
    const response = Object.keys(res)
      .filter((item) => item !== "category")
      .reduce((acc, key) => {
        return Object.assign(acc, {
          [key]: res[key],
        });
      }, {});


    try {
      if (location.state) {
        axiosInstance
          .put(`/api/orders/${location.state.rowData._id}`, response)
          .then((result) => {
            toast.success(result.data.message);
            navigate(`/`);
          })
          .catch((err) => toast.error(err.response.data.message));
      } else {
        axiosInstance
          .post("/api/orders", response, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((result) => {
            toast.success(result.data.message);
            navigate(`/`);
          })
          .catch((err) => toast.error(err.response.data.message));
      }
    } catch (error) {
      toast.error("An error occurred!");
    }
  };


 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const advance = {
      advanceAmount,
      advanceDate,
      advanceType,
    };


    formData["advance"] =
      paymentMethod === "Advance" ? JSON.stringify(advance) : "0";
    formData["paymentMethod"] = paymentMethod;
    formData["product"] = products;
    createOrder(formData);
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (e.target.name === "product") {
      setSelectedProduct(productList[e.target.value]);
      formData.category = "";
      setFormData({
        ...formData,
        code: "",
        product: value,
      });
    }
  };

  const handleShowModal = () => {
    const productDetail = productList[formData.product].find(
      (item) => item.code === formData.category
    );
    setProductDetails(productDetail);
    setEdit(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      ...formData,
      product: "",
      category: "",
      code: "",
    });
  }
  const handleProductData = (data) => {
    data.code = formData.category;
    setProducts([data, ...products]);
    setFormData({
      ...formData,
      product: "",
      category: "",
      code: "",
    });
  };
  const checkProduct = (val) => {
    setFormData({
      ...formData,
      code: val,
    });
    const search = Object.entries(productList).find(([key, value]) =>
      value.find((item) => item.code === val.toUpperCase())
    );
    if (search) {
      const [productName, obj] = search;
      setSelectedProduct(obj);
      const cat = obj.find((item) => item.code === val.toUpperCase());
      setFormData({
        ...formData,
        product: productName,
        category: cat.code,
        code: val,
      });
    }
  };
  const editProduct = (product, index) => {
    setShowModal(true);
    setEdit(true);
    setFormData({
      ...formData,
      product: product.productName,
    });
    const productDetail = productList[product.productName].find(
      (item) => item.code === products[index].code
    );
    productDetail.index = index;
    setProductDetails(productDetail);
  };

  const deleteProduct = async (index) => {
    const isConfirmed = await confirmationDialog({
      title: "Delete Product",
      text: "Are you sure you want to delete this product?",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (isConfirmed) {
      const newProduct = products.filter((item, i) => i !== index);
      setProducts(newProduct);
      toast.success("Product removed successfully");
    }
  };

  // BOC by mahendra
  const goToDashboard = () => {
    navigate("/"); // Navigate to the home page or dashboard
  };
  // EOC by mahendra

  return (
    <div className="order-container">
      <Breadcrumb>
        <Breadcrumb.Item onClick={goToDashboard} style={{ cursor: 'pointer' }}>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {location.state ? "Edit Order" : "Create Order"}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formCustomerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Col lg="3">
            <Form.Group as={Col} controlId="formCustomerNo">
              <Form.Label>Customer Number</Form.Label>
              <Form.Control
                type="number"
                name="customerNo"
                placeholder="Enter customer number"
                value={formData.customerNo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Form.Group as={Col} controlId="formCustomerAdd">
            <Form.Label>Customer Address</Form.Label>
            <Form.Control
              type="text"
              name="customerAdd"
              placeholder="Enter customer address"
              value={formData.customerAdd}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Col lg="3">
            <Form.Group as={Col} controlId="formInvoiceNo">
              <Form.Label>Invoice No</Form.Label>
              <Form.Control
                type="text"
                name="invoiceNo"
                placeholder="Enter invoice number"
                value={formData.invoiceNo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col lg="3">
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formLeadSource">
              <Form.Label>Lead Source</Form.Label>
              <Form.Control
                as="select"
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                required
              >
                <option value="">Select lead source</option>
                {leadSources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Form.Group as={Col} controlId="formDesignName">
            <Form.Label>Design Name</Form.Label>
            <Form.Control
              type="text"
              name="designName"
              placeholder="Enter design name"
              value={formData.designName}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <div style={{ display: "flex", gap: "10px" }}>
            <Col>
              <Form.Group controlId="formProductCode">
                <Form.Label>Product Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) => checkProduct(e.target.value)}
                  placeholder="Enter product code (Optional)"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formProduct">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                >
                  <option value="">Choose a product name</option>
                  {Object.keys(productList).map((product, index) => (
                    <option
                      key={index}
                      value={product}
                      style={{ maxHeight: "300px" }}
                    >
                      {product}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="formCategory">
                <Form.Label>Product Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!formData.product}
                >
                  <option value="">Choose a product category</option>
                  {selectedProduct.map((product, index) => (
                    <option
                      key={index}
                      value={product.code}
                      style={{ maxHeight: "300px" }}
                    >
                      {product.category} ({product.size}) {product.gsm} GSM
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col lg="3">
              <Button
                variant="primary"
                style={{ marginTop: "31px" }}
                onClick={handleShowModal}
                // disabled={formData.product === "" || formData.category === ""}
                disabled={!formData.product || !formData.category}
              >
                <Plus />
              </Button>
            </Col>
          </div>
          {showModal && (
            <AddProduct
              setShowModal={setShowModal}
              showModal={showModal}
              productData={handleProductData}
              productName={formData.product}
              code={formData.category}
              productDetail={productDetails}
              products={products}
              setProducts={setProducts}
              edit={edit}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Row>
        {products?.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Size</th>
                <th>GSM</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.size}</td>
                  <td>{product.gsm}</td>
                  <td>{product.quantity}</td>
                  <td>{product.amount}</td>
                  <td style={{ cursor: "pointer" }}>
                    <>
                      <PencilSquare
                        onClick={() => editProduct(product, index)}
                        className="mx-2"
                      />
                      <TrashFill onClick={() => deleteProduct(index)} />
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Row className="mb-3">
          <Col lg={6}>
            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <InputGroup>
                <Form.Check
                  inline
                  label="Advance"
                  type="radio"
                  name="paymentMethod"
                  value="Advance"
                  checked={paymentMethod === "Advance"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                />
                <Form.Check
                  inline
                  label="Cash on Delivery (COD)"
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group controlId="formCourierCharges">
              <Form.Label>Courier Charges</Form.Label>
              <Form.Control
                type="number"
                name="courierCharges"
                placeholder="Enter Courier Charges"
                value={formData.courierCharges}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formSalesExecutive">
              <Form.Label>Sales Executive Name</Form.Label>
              <Form.Control
                type="text"
                name="salesExecutive"
                placeholder="Enter sales executive name"
                value={formData.salesExecutive}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {paymentMethod === "Advance" && (
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formAdvanceAmount">
                <Form.Label>Advance Amount</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={advanceAmount}
                  name="advanceAmount"
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="Enter advance amount"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formAdvanceDate">
                <Form.Label>Advance Date</Form.Label>
                <Form.Control
                  type="date"
                  name="advanceDate"
                  value={advanceDate}
                  onChange={(e) => setAdvanceDate(e.target.value)}
                  placeholder="Enter advance date"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} controlId="formAdvanceType">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Control
                  as="select"
                  name="advanceType"
                  value={advanceType}
                  onChange={(e) => setAdvanceType(e.target.value)}
                  required
                >
                  <option value="">Select Payment Mode</option>
                  {advanceTypeList.map((source, index) => (
                    <option key={index} value={source}>
                      {source}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        )}
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Enter any additional information"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        {location.state ? (
          <Button variant="primary" type="submit" disabled={!products.length}>
            Update Order
          </Button>
        ) : (
          <Button variant="primary" type="submit" disabled={!products.length}>
            Submit Order
          </Button>
        )}
      </Form>
    </div>
  );
};

export default Order;
