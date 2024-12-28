import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig"

const Outsource = ({ formData, setFormData }) => {
  // const vendorList = [
  //   {
  //     name: "SOFTLINK DIGITAL",
  //     city: "NAGPUR",
  //   },
  //   {
  //     name: "FRIENDS CARD",
  //     city: "NAGPUR",
  //   },
  //   {
  //     name: "SRM ADVERTISEMENT",
  //     city: "NAGPUR",
  //   },
  //   {
  //     name: "SANGAM NOVELTIES",
  //     city: "DELHI",
  //   },
  //   {
  //     name: "JINDAL NOVELTIES",
  //     city: "DELHI",
  //   },
  //   {
  //     name: "SN PRINTERS",
  //     city: "CHANDRAPUR",
  //   },
  //   {
  //     name: "JANKI ENTERPRISES",
  //     city: "NAGPUR",
  //   },
  //   {
  //     name: "JAVED PRINTERS",
  //     city: "NAGPUR",
  //   },
  //   {
  //     name: "MOHURLE PRINTERS",
  //     city: "CHANDRAPUR",
  //   },
  // ];
  const [vendorList, setVendorList] = useState([]);
  useEffect(() => {
    // Fetch the list of vendors from the API
    axiosInstance.get("/api/vendor")
      .then((response) => {
        // Assuming the response contains an array of vendors with name and city
        console.log(response);
        setVendorList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vendor list", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(name === 'selectVendor'){
      setFormData({
        ...formData,
        selectVendor: value,
      })
    }
  };
  return (
    <>
      <Row>
        <Col lg="3">
          <Form.Group controlId="formSelectVendor">
            <Form.Label>Select Vendor</Form.Label>
            <Form.Control
              as="select"
              name="selectVendor"
              value={formData.selectVendor}
              onChange={handleChange}
              required
            >
              <option>Select Vendor</option>
              {vendorList.map((item, i) => {
                return (
                  <option value={item.name} key={i}>
                    {item.name} {item.city}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col lg="3">
          <Form.Group controlId="formCost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="text"
              name="cost"
              placeholder="Enter Cost"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col lg="3">
          <Form.Group controlId="formExtraCharges">
            <Form.Label>Extra Charges</Form.Label>
            <Form.Control
              type="text"
              name="extraCharges"
              placeholder="Enter Extra Charges"
              value={formData.extraCharges}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg="3">
          <Form.Group controlId="formDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              placeholder="Enter Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group as={Col} controlId="formOtherDetails">
            <Form.Label>Other Details</Form.Label>
            <Form.Control
              type="textarea"
              name="otherDetails"
              placeholder="Enter Other Details"
              value={formData.otherDetails}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        {/* <Col lg="3">
          <Form.Group controlId="formFile">
            <Form.Label>Attach Design</Form.Label>
            <Form.Control type="file" name="file" onChange={handleFileChange} />
          </Form.Group>
        </Col> */}
      </Row>
    </>
  );
};

export default Outsource;
