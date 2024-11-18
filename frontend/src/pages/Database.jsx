import React from "react";
import { useLocation } from "react-router-dom";

function Database() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dbname = queryParams.get("dbname");
  return <div>{dbname}</div>;
}

export default Database;
