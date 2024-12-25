import React, { useState } from "react";
import { Container, Button, Breadcrumb } from "react-bootstrap";
import CreateVendor from "./CreateVendor";
const Vendor = () => {
  const [show, setShow] = useState(false);

  const createVendor = () => {
    setShow(true);
  };

  return (
    <Container style={{ maxWidth: "2000px", padding: "0 20px" }}>
      <div
        className="m-1"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Vendor</Breadcrumb.Item>
        </Breadcrumb>
        <div className="search-bar">
          <Button onClick={() => createVendor()}>Create Vendor</Button>
        </div>
      </div>

      {show && <CreateVendor show={show} setShow={setShow} />}
    </Container>
  );
};

export default Vendor;
