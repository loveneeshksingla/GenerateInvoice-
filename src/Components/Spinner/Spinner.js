import React from "react";
import "./Spinner.css";

const Spinner = ({ loading = false, description }) => {
  if (!loading) return null;
  return (
    <div className="loader_container">
      <div className="loader"></div>
      {description && <p>{description}</p>}
    </div>
  );
};
export default Spinner;
