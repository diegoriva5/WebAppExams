import 'dayjs';
import { Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TicketsTable(props) {
  const { tickets } = props;

  return (
    <Table className="table table-bordered table-striped table-hover w-100">
      <thead>
        <tr>
          <th className="text-start">Title</th>
          <th className="text-center">TimeStamp</th>
          <th>Owner</th>
          <th className="text-end">Category</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketRow ticketData={ticket} key={tickets.id} />
          ))}
      </tbody>
    </Table>
  );
}

function TicketRow(props) {

  const { ticketData } = props;

  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleString() : '';
  }

  return (
    <tr>
      <td>
        <p>{ticketData.title}</p>
      </td>
      <td className="text-center">
        <small>{formatTimestamp(ticketData.timestamp)}</small>
      </td>
      <td>
        <p>{ticketData.owner}</p>
      </td>
      <td>
        <p>{ticketData.category}</p>
      </td>
      <td>
        <p>{ticketData.state}</p>
      </td>
    </tr>
  );
}

export { TicketsTable };
