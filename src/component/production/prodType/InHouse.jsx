import React from "react";
import { Col, Form, Row } from "react-bootstrap";

const InHouseProd = ({ formData, setFormData, productionData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "selectMachine") {
      formData.selectPaper = "";
    }
  };
  // const handleFileChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     file: e.target.files[0],
  //   });
  // };
  return (
    <Row>
      <Col lg="3">
        <Form.Group controlId="formSelectMachine">
          <Form.Label>Select Machine</Form.Label>
          <Form.Control
            as="select"
            name="selectMachine"
            value={formData.selectMachine}
            onChange={handleChange}
            disabled={productionData}
            required
          >
            <option>Select Machine</option>
            <option value="riso">RISO</option>
            <option value="xerox">XEROX</option>
          </Form.Control>
        </Form.Group>
      </Col>
      {(formData.selectMachine === "riso" ||
        formData.selectMachine === "xerox") && (
        <Col lg="3">
          <Form.Group controlId="formSelectPaper">
            <Form.Label>Select Paper</Form.Label>
            <Form.Control
              as="select"
              name="selectPaper"
              value={formData.selectPaper}
              onChange={handleChange}
              required
            >
              <option>Select Paper</option>
              {formData.selectMachine === "riso" && (
                <>
                  <option value="envelop_model">Envelop Model</option>
                  <option value="paper">Paper</option>
                </>
              )}
              {formData.selectMachine === "xerox" && (
                <>
                  <option value="sticker">Sticker</option>
                  <option value="op">OP</option>
                </>
              )}
            </Form.Control>
          </Form.Group>
        </Col>
      )}
      {formData.selectMachine === "riso" &&
        formData.selectPaper === "envelop_model" && (
          <Col lg="3">
            <Form.Group controlId="formSelectEnvelopSize">
              <Form.Label>Select Envelop Size</Form.Label>
              <Form.Control
                as="select"
                name="envelopSize"
                value={formData.envelopSize}
                onChange={handleChange}
                required
              >
                <option>Select Envelop Model Size</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </Form.Control>
            </Form.Group>
          </Col>
        )}
      {formData.selectMachine === "riso" &&
        formData.selectPaper === "paper" && (
          <Col lg="2">
            <Form.Group controlId="formSelectPaperSize">
              <Form.Label>Paper Size</Form.Label>
              <Form.Control
                as="select"
                name="paperSize"
                value={formData.paperSize}
                onChange={handleChange}
                required
              >
                <option>Paper Size</option>
                <option value="A4">A4</option>
                <option value="A6">A6</option>
                <option value="A8">A8</option>
              </Form.Control>
            </Form.Group>
          </Col>
        )}
      {formData.selectMachine && (
        <Col lg="3">
          <Form.Group controlId="formDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              placeholder="Enter Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </Form.Group>
        </Col>
      )}
      {formData.selectMachine && (
        <Col lg="3">
          <Form.Group controlId="formProductionQty">
            <Form.Label>Production Quantity</Form.Label>
            <Form.Control
              type="number"
              name="prodQty"
              placeholder="Production Quantity"
              value={formData.prodQty}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      )}
      {formData.selectMachine && (
        <Col lg="3">
          <Form.Group controlId="formSelectAfterPrint">
            <Form.Label>After Print</Form.Label>
            <Form.Control
              as="select"
              name="afterPrint"
              value={formData.afterPrint}
              onChange={handleChange}
              required
            >
              <option>Select After Print</option>
              {formData.selectMachine === "riso" && (
                <>
                  <option value="binding">Binding</option>
                  <option value="packaging">Packaging</option>
                </>
              )}
              {formData.selectMachine === "xerox" && (
                <>
                  <option value="manual">Manual Cutting</option>
                  <option value="toyocut">Toyocut Cutting</option>
                  <option value="packaging">Packaging</option>
                </>
              )}
            </Form.Control>
          </Form.Group>
        </Col>
      )}
      {/* {((formData.selectMachine &&
              formData.selectPaper &&
              formData.envelopSize) ||
              formData.selectPaper === "sticker" ||
              formData.selectPaper === "op") && (
              <Col lg="3">
                <Form.Group controlId="formFile">
                  <Form.Label>Attach Design</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            )} */}
    </Row>
  );
};

export default InHouseProd;
