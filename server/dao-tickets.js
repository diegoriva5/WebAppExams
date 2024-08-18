'use strict';

/* Data Access Object (DAO) module for accessing tickets data */

const db = require('./db');
const dayjs = require("dayjs");



const convertTicketFromDbRecord = (dbRecord) => {
    const ticket = {};
    ticket.id = dbRecord.id;
    ticket.state = dbRecord.state;
    ticket.category = dbRecord.category;
    // Note that the column name is all lowercase, JSON object requires camelCase as per the API specifications we defined.
    // We convert "watchdate" to the camelCase version ("watchDate").
  
    ticket.title = dbRecord.title;
    // FIXME
    // Also, here you decide how to transmit an empty date in JSON. We decided to use the empty string.
    // Using the null value is an alternative, but the API documentation must be updated and the client must be modified accordingly.
    //film.watchDate = dbRecord.watchdate ? dayjs(dbRecord.watchdate) : "";
    ticket.owner = dbRecord.owner;
    ticket.timestamp = dbRecord.timestamp;
    ticket.description = dbRecord.description;
  
    /* // ALTERNATIVE:
    // WARNING: the column names in the database are all lowercases. JSON object requires camelCase as per the API specifications we defined.
    // We convert "watchdate" to the camelCase version ("watchDate").
    // Object.assign will copy all fields returned by the DB (i.e., all columns if SQL SELECT did not specify otherwise)
    const film = Object.assign({}, e, { watchDate: e.watchdate? dayjs(e.watchdate) : "" });  // adding camelcase "watchDate"
    delete film.watchdate;  // removing lowercase "watchdate"
    */
    return ticket;
  }

// This function retrieves the whole list of tickets from the database.
exports.listTickets = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tickets';
      db.all(sql, (err, rows) => {
        if (err) { reject(err); }
  
        const tickets = rows.map((e) => {
          const tickets = convertTicketFromDbRecord(e);
          return tickets;
        });
        resolve(tickets);
      });
    });
};

/* List all tickets from the most recent to the oldest */
exports.listTicketFromMostRecent = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tickets ORDER BY timestamp DESC';
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const tickets = rows.map((e) => {
        const tickets = convertTicketFromDbRecord(e);
        return tickets;
      });
      resolve(tickets);
    });
  });
};

// This function retrieves a film given its id.
exports.getTicket = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tickets WHERE id=?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        }
        if (row == undefined) {
          resolve({ error: 'Ticket not found.' });
        } else {
          const ticket = convertTicketFromDbRecord(row);
          resolve(ticket);
        }
      });
    });
  };

/**
 * This function adds a new ticket in the database.
 * The ticket id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tickets (state, category, owner, title, timestamp, description) VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [ticket.state, ticket.category, ticket. owner, ticket.title, ticket.timestamp, ticket.description], function (err) {
            if (err) {
                reject(err);
            }

            resolve(exports.getTicket(this.lastID));
        })
    });
};