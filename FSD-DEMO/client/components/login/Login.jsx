import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../utils/http";

function Login({ user }) {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await http.post("/auth", userDetails);
      localStorage.setItem("token", data);
      window.location = "/";
    } catch (error) {
      console.log(err);
      if(error.response && error.response.status ===400){
        setError(error.response.data.error);
      }
    }
  };
  return (
    <form className= 'signup-form' onSubmit={handleSubmit}>
     <label htmlFor="Email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        onChange= {handleChange}
      /> 
      <label htmlFor="Password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={handleChange}
      />

      {error && (
        <div className="error_container">
          <p className="form_error">{error}</p>
        </div>
      )}
            
      <button type="submit">Login</button>       

    </form>   
  )
}

export default Login;
