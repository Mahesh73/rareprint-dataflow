import React, { useEffect, useState } from "react";
import { Container, Nav, Tab, Table } from "react-bootstrap";
import axiosInstance from "../../axiosConfig";
import Riso from "./Riso";
import Xerox from "./Xerox";
import Toyocut from "./Toyocut";

const Machine = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("riso");
  useEffect(() => {
    axiosInstance.get(`/api/${type}`).then((res) => setData(res.data));
  }, [type]);
  const changeType = (val) => {
    axiosInstance.get(`/api/${type}`).then((res) => {
      setData(res.data);
      setType(val);
    });
  };

  return (
    <Container>
      <Tab.Container id="left-tabs-example" defaultActiveKey="riso">
        <Nav variant="pills" className="m-3" fill>
          <Nav.Item>
            <Nav.Link eventKey="riso" onClick={() => changeType("riso")}>
              RISO
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="xerox" onClick={() => changeType("xerox")}>
              Xerox
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="toyocut" onClick={() => changeType("toyocut")}>
              Toyocut
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="riso">
            {type === "riso" && <Riso data={data} setData={setData} />}
          </Tab.Pane>
          <Tab.Pane eventKey="xerox">
            {type === "xerox" && <Xerox data={data} setData={setData} />}
          </Tab.Pane>
          <Tab.Pane eventKey="toyocut">
            {type === "toyocut" && <Toyocut data={data} setData={setData} />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Machine;
