import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";

const CreateVendor = ({ show, setShow, setVendor, vendorData}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    contactNumber: "",
    address: "",
  });

   // Track initial vendor data for comparison
   const [initialData, setInitialData] = useState(null);

  // useEffect(() => {
  //   if (vendorData) {
  //     setFormData(vendorData);
  //   }
  // }, [vendorData]);

  useEffect(() => {
    if (vendorData) {
      setFormData(vendorData);
      setInitialData(vendorData); 
    } else {
      setFormData({
        name: "",
        email: "",
        city: "",
        contactNumber: "",
        address: "",
      });
      setInitialData(null);
    }
  }, [vendorData]);

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isDataChanged = () => {
    if (!initialData) return true; // For new vendors, always allow submission
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  // const handleSubmit = () => {
  //   if (vendorData) {
  //       axiosInstance
  //       .put(`/api/vendor/update/${vendorData._id}`, formData)
  //       .then((response) => {
  //         toast.success("Vendor updated successfully!");
  //         console.log(response);
  //        setVendor(response.data.vendor);
  //         handleClose();
  //       })
  //       .catch((error) => {
  //         toast.error(error.response?.data?.message || "An error occurred.");
  //       });
  //   } else {
  //     axiosInstance
  //       .post("/api/vendor/register", formData)
  //       .then((response) => {
  //         alert("Vendor registered successfully!");
  //         setVendor(response.data.vendor); // Pass new vendor to parent
  //         handleClose();
  //       })
  //       .catch((error) => {
  //         console.error("Error registering vendor:", error);
  //         alert(error.response?.data?.message || "An error occurred.");
  //       });
  //   }
  // };

  const handleSubmit = () => {
    if (vendorData) {
      // Check if form data has changed
      const isChanged = JSON.stringify(formData) !== JSON.stringify(vendorData);
      if (!isChanged) {
        toast.info("No changes detected. Please update some fields before submitting.");
        return;
      }
  
      axiosInstance
        .put(`/api/vendor/update/${vendorData._id}`, formData)
        .then((response) => {
          toast.success("Vendor updated successfully!");
          setVendor(response.data.vendor);
          handleClose();
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "An error occurred.");
        });
    } else {
      axiosInstance
        .post("/api/vendor/register", formData)
        .then((response) => {
          alert("Vendor registered successfully!");
          setVendor(response.data.vendor); // Pass new vendor to parent
          handleClose();
        })
        .catch((error) => {
          console.error("Error registering vendor:", error);
          alert(error.response?.data?.message || "An error occurred.");
        });
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {vendorData ? "Update Vendor" : "Register Vendor"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="vendorName">
            <Form.Label>Vendor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vendor name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="vendorEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="vendorCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="vendorNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter number"
              name="contactNumber"
              value={formData.contactNumber}
              maxLength={10}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="vendorAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {vendorData ? "Update Vendor" : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateVendor;
