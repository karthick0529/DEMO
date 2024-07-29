import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Navbar from "../components/navbar/Navbar";
import Routing from "../components/routing/Routing";
import setAuthToken from "../utils/setAuthToken";

let logUser;
if (localStorage.token) {
  const jwt = localStorage.getItem("token");
  console.log("JWT from localStorage:", jwt);  // Add this line
  setAuthToken(jwt);
  try {
    logUser = jwtDecode(jwt);
    console.log("Decoded JWT:", logUser);  // Add this line
  } catch (error) {
    console.error("JWT decoding error:", error);
  }
}


function App() {
  const [user, setUser] = useState(logUser);
  console.log(user);
  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <div className="main">
          <Routing user={user} />
        </div>
      </div>
    </Router>
  );
}

export default App;
