import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

const getTickets = async () => {
  return getJson(
    fetch(SERVER_URL + 'all-tickets')
  ).then( json => {
    return json.map((ticket) => {
      const clientTicket = {
        title: ticket.title,
        timestamp: ticket.timestamp,
        owner: ticket.owner,
        category: ticket.category,
        state: ticket.state
      }
      if (ticket.timestamp != null)
        clientTicket.timestamp = dayjs(ticket.timestamp);
      return clientTicket;
    })
  })
}

/**
 * This function adds a new film in the back-end library.
 */
function addTicket(ticket) {
  // the date must be transformed into a string for the JSON.stringify method
  if (ticket.timestamp){
    ticket.timestamp = dayjs(ticket.timestamp);
  }
  return getJson(
    fetch(SERVER_URL + "create-ticket", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket) 
    })
  )
}

/*** Authentication functions ***/

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

  
const API = { getTickets, addTicket, logIn, getUserInfo, logOut };

export default API;