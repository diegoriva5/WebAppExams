import { Row, Col, Button, Alert, Toast } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';

import { Navigation } from './Navigation';
import { TicketsTable } from './TicketsLibrary';
import { useEffect } from 'react';
import { TicketForm } from './AddTicket.jsx';
import { ConfirmationPage } from './ConfirmationPage.jsx';
import { LoginForm } from './Auth';

import API from '../API.js';


function NotFoundLayout(props) {
  return (
    <>
      <h2>This route is not valid!</h2>
      <Link to="/">
        <Button variant="primary">Go back to the main page!</Button>
      </Link>
    </>
  );
}


function LoginLayout(props) {
  return (
    <>
      <Row>
        <Col>
          <LoginForm login={props.login} />
        </Col>
      </Row>
    </>
  );
}
  
function TableLayout(props) {
  const location = useLocation();
  let reloadFromServer = true;
  if (location.state)
    reloadFromServer = location.state.reloadFromServer;  

  useEffect(() => {
    if (reloadFromServer) {
      // Fetch tickets, ordered by the most recent timestamp
      API.getTickets(props.ticketList)
      .then(tickets => {
        // Assuming the tickets are already sorted by the API
        props.setTicketList(tickets);
      })
      .catch(e => 
        { console.log(e); 

      }); 
    }
  }, [reloadFromServer]);
  
  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <h1 className="my-2">Tickets</h1>
      </div>
      <TicketsTable 
        tickets={props.ticketList}  />
      <Link to={'/login'}>
        <Button variant='primary' className='my-2'>Login</Button>
      </Link>
      <Link to={'/add'}>
        <Button variant='secondary' className='my-2'>Add Ticket</Button>
      </Link>
    </>
  );
}
  
function GenericLayout(props) {
  return (
    <>
      <Row>
          <Col>
            <Navigation loggedIn={props.loggedIn} user={props.user} logout={props.logout} />
          </Col>
      </Row>

      <Row><Col>
        {props.message? <Alert className='my-1' onClose={() => props.setMessage('')} variant='danger' dismissible>
          {props.message}</Alert> : null}
        {/* Alternative, with autohide
          <Toast show={props.message !== ''} onClose={() => props.setMessage('')} delay={4000} autohide>
            <Toast.Body>{props.message}</Toast.Body>
          </Toast>
        */}
      </Col></Row>

      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </>
  );
}

function AddLayout(props) {
  return (
    <TicketForm addTicket={props.addTicket} user={props.user}/>
  );
}

function ConfirmationLayout(props) {
  return (
    <ConfirmationPage />
  );
}

export { GenericLayout, NotFoundLayout, LoginLayout, TableLayout, AddLayout, ConfirmationPage };
