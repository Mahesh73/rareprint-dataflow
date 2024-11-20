import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import InHouseProd from "./prodType/InHouse";
import Outsource from "./prodType/Outsource";
import SheetProduction from "./prodType/Sheet";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StartProduction = ({
  show,
  setShow,
  orderId,
  productId,
  details,
  productionData,
}) => {
  const navigate = useNavigate();
  const productionTypes = [
    {
      key: "inHouse",
      value: "InHouse",
    },
    {
      key: "outsource",
      value: "Outsource",
    },
    {
      key: "sheetProduction",
      value: "Sheet Production",
    },
  ];
  const [type, setType] = useState("inHouse");
  const [formData, setFormData] = useState({
    chooseType: "",
    selectMachine: "",
    selectPaper: "",
    envelopSize: "",
    paperSize: "",
    selectVendor: "",
    cost: "",
    extraCharges: "",
    // file: "",
    dueDate: "",
    otherDetails: "",
    prodQty: 0,
    afterPrint: "",
    selectSheetSize: "",
  });

  const changeType = (value) => {
    setType(value);
    setFormData({
      chooseType: type,
      selectMachine: "",
      selectPaper: "",
      envelopSize: "",
      paperSize: "",
      selectVendor: "",
      cost: "",
      extraCharges: "",
      //   file: "",
      dueDate: "",
      otherDetails: "",
      prodQty: 0,
      afterPrint: "",
      selectSheetSize: "", // Reset selectSheetSize
    });
    // setIsMachineSelected(false); // Reset machine selection when changing type
    setIsSheetFieldsFilled(false); // Reset sheet fields state
  };
  const submitInHouse = (_formData) => {
    if (productionData) {
      axiosInstance
        .put(
          `/api/orders/${orderId}/products/${productId}/production`,
          _formData
        )
        .then((res) => {
          toast.success(res.data.message);
          setShow(false);
          navigate("/machine");
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    } else {
      axiosInstance
        .post(
          `/api/orders/${orderId}/products/${productId}/production`,
          _formData
        )
        .then((res) => {
          toast.success(res.data.message);
          setShow(false);
          navigate("/machine");
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    }
  };
  const submitOutSource = (_formData) => {
    axiosInstance
      .put(`/api/orders/${orderId}/products/${productId}/production`, _formData)
      .then((res) => {
        toast.success(res.data.message);
        setShow(false);
        navigate("/machine");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };
  const submitProduction = (e) => {
    e.preventDefault();
    formData.chooseType = type;
    formData.prodQty = parseInt(formData.prodQty);
    if (type === "inHouse") {
      submitInHouse(formData);
    } else if (type === "outsource") {
      submitOutSource(formData);
    }
    
  };
  useEffect(() => {
    if (productionData) {
      setType(productionData.chooseType);
      setFormData(productionData);
    }
  }, [productionData]);
  const closeModel = () => {
    setFormData({
      chooseType: type,
      selectMachine: "",
      selectPaper: "",
      envelopSize: "",
      paperSize: "",
      selectVendor: "",
      cost: "",
      extraCharges: "",
      //   file: "",
      dueDate: "",
      otherDetails: "",
      prodQty: 0,
      afterPrint: "",
      selectSheetSize: "",
    });
    setShow(false);
  };

  // BOC by mahendra
  // const [isMachineSelected, setIsMachineSelected] = useState(false);
  const [isSheetFieldsFilled, setIsSheetFieldsFilled] = useState(false);
  // EOC by mahendra
  return (
    <Modal show={show} onHide={closeModel} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {details.productName} {details.productCategory}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitProduction}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="FormChooseType">
              <Form.Label>Choose Type</Form.Label>
              <InputGroup>
                {productionTypes.map((item, i) => {
                  return (
                    <Form.Check
                      inline
                      label={item.value}
                      key={i}
                      type="radio"
                      name="chooseType"
                      value={item.key}
                      checked={type === item.key}
                      onChange={(e) => changeType(e.target.value)}
                      disabled={productionData}
                    />
                  );
                })}
              </InputGroup>
            </Form.Group>
          </Row>
          {type === "inHouse" && (
            <InHouseProd
              formData={formData}
              setFormData={setFormData}
              productionData={productionData}
              // setIsMachineSelected={setIsMachineSelected} // Pass the function here
            />
          )}
          {type === "outsource" && (
            <Outsource formData={formData} setFormData={setFormData} />
          )}
          {type === "sheetProduction" && (
            <SheetProduction formData={formData} setFormData={setFormData}  setIsSheetFieldsFilled={setIsSheetFieldsFilled} />
          )}
          <Button variant="primary" type="submit" className="mt-5" 
          disabled={
             (type === "sheetProduction" &&
              !isSheetFieldsFilled &&
              !productionData // Disable only for "Start Production" (if no fields filled)
              ) || (type === "inHouse" && (formData.selectMachine !== "riso" && formData.selectMachine !== "xerox") && !productionData) ||
              (type === "outsource" && (formData.selectVendor == "" || formData.selectVendor == "Select Vendor")&& !productionData)
            }
            >
            {productionData ? "Update Production" : "Start Production"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StartProduction;
