import React from "react";
import { Descriptions } from "antd";

function Movieinfo(props) {
  const { movie } = props;

  return <div>{movie.recommendations}</div>;
}

export default Movieinfo;
