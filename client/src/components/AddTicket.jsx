import dayjs from 'dayjs';

import {useState} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketForm = (props) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(location.state?.ticket?.title || '');
  const [category, setCategory] = useState(location.state?.ticket?.category || '');
  const [description, setDescription] = useState(location.state?.ticket?.description || '');

  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    // String.trim() method is used for removing leading and ending whitespaces from the title.
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setErrorMsg('Please fill out all fields correctly.');
    } else {
      // If form is valid, clear the error message
      setErrorMsg('');

      // Create the ticket object with trimmed values
      const ticket = { 
        state: 'Open',
        category: category.trim(),
        owner: props.user.name,
        title: title.trim(),
        timestamp: new Date().toISOString(),
        description: description.trim()
      };

      navigate('/confirmation', { state : { ticket } }); // Pass the ticket data to the confirmation page

      
      }
    
      setValidated(true);
  }

  const handleCancel = () => {
    navigate('/');  // Navigate back to the add ticket page with ticket data
  };

  return (
    <>
      {errorMsg && <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={category} 
            onChange={event => setCategory(event.target.value)}
            required
          >
            <option value="" disabled>Select a category...</option> 
            <option value="Inquiry">Inquiry</option>
            <option value="Maintenance">Maintenance</option>
            <option value="New feature">New Feature</option>
            <option value="Administrative">Administrative</option>
            <option value="Payment">Payment</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please provide a valid category (at least 3 characters).
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            type="text"  
            value={title} 
            onChange={event => setTitle(event.target.value)}
            required
            minLength={1} // Example of a field constraint
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid title (at least 3 characters).
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea"  
            value={description} 
            onChange={event => setDescription(event.target.value)}
            required
            minLength={10} // Example of a field constraint
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid description (at least 10 characters).
          </Form.Control.Feedback>
        </Form.Group>

        <Button className="mb-3" variant="primary" type="submit">Save</Button>
        <Button className="mb-3" variant="danger" onClick={handleCancel}>Cancel</Button>
      </Form>
    </>
  );

}

export { TicketForm };