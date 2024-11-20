import React from "react";
const Rank = ({ userName, entries }) => (
  <div>
    <div className="white f3">{`${userName}, your current rank is...`}</div>
    <div className="white f1">{entries}</div>
  </div>
);
export default Rank;
