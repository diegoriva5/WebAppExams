import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import API from '../API.js';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { ticket } = location.state || {};  // Get the ticket data from location state

  const handleConfirm = () => {
    if (ticket) {
      API.addTicket(ticket)
        .then(() => {
          navigate('/');  // Navigate back to home page after successful ticket creation
        })
        .catch(err => {
          console.error('Error adding ticket:', err);
          // You might want to handle the error here, e.g., show a notification
        });
    }
  };

  const handleBack = () => {
    navigate('/add', { state: { ticket } });  // Navigate back to the add ticket page with ticket data
  };

  return (
    <div className="container mt-4">
      <h2>Confirm Ticket Details</h2>
      {ticket ? (
        <Card>
          <Card.Body>
            <Card.Title>{ticket.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{ticket.category}</Card.Subtitle>
            <Card.Text>
              <strong>Description:</strong> {ticket.description}<br />
              <strong>Owner:</strong> {ticket.owner}<br />
              <strong>Timestamp:</strong> {new Date(ticket.timestamp).toLocaleString()}<br />
              <strong>State:</strong> {ticket.state}
            </Card.Text>
            <Button variant="primary" onClick={handleConfirm}>Confirm and Create Ticket</Button>
            <Button variant="danger" className="ms-2" onClick={handleBack}>Back</Button>
          </Card.Body>
        </Card>
      ) : (
        <p>No ticket data available.</p>
      )}
    </div>
  );
};

export { ConfirmationPage };
