import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const CreateVendor = ({
  show,
  setShow
}) => {


  const handleClose = () => setShow(false);

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register Vendor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="vendorName">
            <Form.Label>Vendor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vendor name"
              name="vendorName"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="vendorCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter City"
              name="City"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="vendorDescription">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              name="vendorDescription"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="vendorNumber">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter number"
              name="vendorNumber"
              maxLength={10}
              required
            />
          </Form.Group>
        </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateVendor;