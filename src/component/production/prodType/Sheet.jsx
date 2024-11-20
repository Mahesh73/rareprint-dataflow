import React , {useEffect}from "react";
import { Col, Form, Row } from "react-bootstrap";

const SheetProduction = ({ formData, setFormData, setIsSheetFieldsFilled }) => {
  const sheetSize = [0.75, 1.5, 2, 3, 6, 12];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //   const handleFileChange = (e) => {
  //     setFormData({
  //       ...formData,
  //       file: e.target.files[0],
  //     });
  //   };

  // BOC by mahendra 
  useEffect(() => {
    // Check if both the fields are filled
    const isFilled = formData.selectSheetSize && formData.dueDate;
    setIsSheetFieldsFilled(isFilled);
  }, [formData, setIsSheetFieldsFilled]);
  // EOC by mahendra
  return (
    <Row>
      <Col lg="3">
        <Form.Group controlId="formSelectSheetSize">
          <Form.Label>Select Size in Point</Form.Label>
          <Form.Control
            as="select"
            name="selectSheetSize"
            value={formData.selectSheetSize}
            onChange={handleChange}
            required
          >
            <option>Select Size in point</option>
            {sheetSize.map((item, i) => {
              return (
                <option value={item} key={i}>
                  {item}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
      </Col>
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
      {/* <Col lg="3">
          <Form.Group controlId="formFile">
            <Form.Label>Attach Design</Form.Label>
            <Form.Control type="file" name="file" onChange={handleFileChange} />
          </Form.Group>
        </Col> */}
    </Row>
  );
};

export default SheetProduction;
