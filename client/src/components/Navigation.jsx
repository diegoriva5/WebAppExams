import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';

import { LoginButton, LogoutButton } from './Auth';

const Navigation = (props) => {

    return (
        <Navbar bg="dark" expand="md" variant="dark" className="navbar-padding w-100 fixed-top">
            <Navbar.Brand className="mx-2" href="index.html">
                <i className="bi bi-ticket-fill mx-2" />
                Ticket Library
            </Navbar.Brand>
            <Nav className='ms-auto'>
                <Navbar.Text className="mx-2 fs-5">
                    {props.user && props.user.name && `Logged in as: ${props.user.name}`}
                </Navbar.Text>
                <Form className="mx-2 mt-1">
                    {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
                </Form>
            </Nav>
        </Navbar>
    );
}

export { Navigation };


