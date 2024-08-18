/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const { check, validationResult, oneOf } = require('express-validator'); // validation middleware
const cors = require('cors');

const ticketDao = require('./dao-tickets'); // module for accessing the films table in the DB
const userDao = require('./dao-users');

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret! - change it for the exam!",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: app.get('env') === 'production' ? true : false },
}));


app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}



/*** Utility Functions ***/

// Make sure to set a reasonable value (not too small!) depending on the application constraints
// It is recommended to have a limit here or in the DB constraints to avoid malicious requests waste space in DB and network bandwidth.
const maxString = 160;


// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Tickets APIs ***/

/* API to create a ticket */

app.post('/api/create-ticket',
    [
        check('category').isLength({min: 1, max: maxString}),
        check('title').isLength({min: 1, max: maxString}),
        check('description').isLength({min: 1, max: maxString}),
    ],
    async (req, res) => {
        // validation errors check
        const errors = validationResult(req).formatWith(errorFormatter); // format error message
        if(!errors.isEmpty()){
            return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
        }

        const ticket = {
            state: req.body.state,
            category: req.body.category,
            owner: req.body.owner,
            title: req.body.title,
            timestamp: new Date().toISOString(),
            description: req.body.description,
        };

        try {
            const result = await ticketDao.createTicket(ticket); // NOTE: createTicket returns the newly created object
            res.json(result);
          } catch (err) {
            res.status(503).json({ error: `Database error during the creation of new ticket: ${err}` }); 
          }
    }
)

/* API to list all tickets */
app.get('/api/all-tickets', 
  (req, res) => {
    // get films that match optional filter in the query
    ticketDao.listTicketFromMostRecent()
      .then(tickets => res.json(tickets))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});





// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));