import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

import './App.css';
import Navbar from './components/navbar/Navbar';
import Routing from './components/routing/Routing';
import setAuthToken from '../utils/setAuthToken';

let logUser = null;

if (localStorage.getItem('token')) {
  try {
    const jwt = localStorage.getItem('token'); // Get the token as a string
    setAuthToken(jwt);
    logUser = jwtDecode(jwt);
  } catch (error) {
    console.error("Invalid token:", error);
    // Remove the invalid token from local storage
    localStorage.removeItem('token');
  }
}

function App() {
  const [user, setUser] = useState(logUser);
  console.log(user);
  
  return (
    <Router>
      <div className='app'>
        <Navbar user={user} />
        <div className='main'>
          <Routing user={user} />
        </div>
      </div>
    </Router>
  );
}

export default App;
