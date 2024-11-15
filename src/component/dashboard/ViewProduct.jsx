import moment from "moment";
import React from "react";
import { Modal, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";
const ViewProduct = ({ showModal, setShowModal, details }) => {
  const renderTooltip = (props, value) => {
    return (
      <Tooltip id="cell-tooltip" {...props}>
        {value.map((item) => (
          <>
            <span>
              {item.status} {moment(item.updatedAt).format("DD-MM-YYYY")}
            </span>
            <br />
          </>
        ))}
      </Tooltip>
    );
  };
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Product History </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
       <div style={{ overflowX: 'auto' }}>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>GSM</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {details?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.category}</td>
                    <td>{item.size}</td>
                    <td>{item.gsm}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                    <td>{item.productDescription}</td>
                    <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                    <td>
                      {item.status[item.status.length - 1].status}
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => renderTooltip(props, item.status)}
                      >
                        <InfoCircleFill />
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewProduct;
