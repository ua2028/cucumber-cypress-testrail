import React from "react";

const TaskDescription = () => {
  return (
    <article>
      <br />
      <h2>System requirements</h2>
      <br />
      <ul>
        <li>
          User has abbility to <b>Add asset</b>
          <ul>
            <li>The asset name should be unique</li>
            <li>
              The asset name is a combination of 4 uppercase letters and 10
              digitalis
            </li>
          </ul>
        </li>
        <br />
        <li>
          User has abbility to see <b>Existing asset</b>
          <ul>
            <li>Search by assert name</li>
            <li>Filter by assert name</li>
            <li>Sort by assert name</li>
          </ul>
        </li>
      </ul>
    </article>
  );
};
export default TaskDescription;
