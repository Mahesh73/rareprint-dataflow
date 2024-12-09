import React from "react";
import { ListGroup, Offcanvas } from "react-bootstrap";

const SideMenu = ({ menuOpen, toggleMenu }) => {
    return (
        <Offcanvas show={menuOpen} onHide={toggleMenu} placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item action href="/">
                        Dashboard
                    </ListGroup.Item>
                    <ListGroup.Item action href="/production">
                        Production
                    </ListGroup.Item>
                    <ListGroup.Item action href="/machine">
                        Printing Machine
                    </ListGroup.Item>
                    <ListGroup.Item action href="/packaging">
                        Packaging
                    </ListGroup.Item>
                    {/* <ListGroup.Item action href="/vendor">
                        Vendor
                    </ListGroup.Item> */}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SideMenu;