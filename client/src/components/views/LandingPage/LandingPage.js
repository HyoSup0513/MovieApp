import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        alert("Login Success!");
        props.history.push("/login");
      } else {
        alert("Logout Failed!");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>LandingPage</h2>

      <button onClick={onClickHandler}>Logout</button>
    </div>
  );
}

export default withRouter(LandingPage);
