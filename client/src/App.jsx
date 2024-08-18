import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Toast } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate, useNavigate } from 'react-router-dom';


import { AddLayout, GenericLayout, NotFoundLayout, LoginLayout, TableLayout, ConfirmationPage } from './components/Layout';
import API from './API.js';

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

function AppWithRouter(props) {

  const navigate = useNavigate();  // To be able to call useNavigate, the component must already be in BrowserRouter (see App)

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);


  const [ticketList, setTicketList] = useState([]);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    console.log('DEBUG: err: '+JSON.stringify(err));
    let msg = '';
    if (err.error)
      msg = err.error;
    else if (err.errors) {
      if (err.errors[0].msg)
        msg = err.errors[0].msg + " : " + err.errors[0].path;
    } else if (Array.isArray(err))
      msg = err[0].msg + " : " + err[0].path;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARNING: a more complex application requires a queue of messages. In this example only the last error is shown.
    console.log(err);

    setTimeout( ()=> setDirty(true), 2000);
  }

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);  // The useEffect callback is called only the first time the component is mounted.
  
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */ 
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
    setFilmList([]);
  };

  function addTicket(ticket) {
    API.addTicket(ticket)
      .then(()=>{setDirty(true); navigate('/home');})
      .catch(err=>handleErrors(err));
  }


  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={loggedIn? <GenericLayout
                                      message={message} setMessage={setMessage}
                                      loggedIn={loggedIn} user={user} logout={handleLogout} /> : <Navigate replace to='/login' />} >
          <Route index element={loggedIn? <TableLayout 
              ticketList={ticketList} setTicketList={setTicketList}
              dirty={dirty} setDirty={setDirty} /> : <Navigate replace to='/' />} />
          <Route path="add" element={loggedIn? <AddLayout addTicket={addTicket} user={user}/> : <Navigate replace to='/' />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>
        <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate replace to='/' />} />
      </Routes>
    </Container>
  );
}

export default App;