import { useState, useEffect, useRef } from "react";
import "./style.css";

function ActionTable() {
  const [actionData, setActionData] = useState([]);
  useEffect(() => {
    const getActionData = async function () {
      const response = await fetch(`http://127.0.0.1:3000/action`);
      const data = await response.json();
      console.log(data);
      setActionData(data);
    };
    getActionData();
  }, []);

  return (
    <div className="table-div">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th>TIME</th>
            <th>USER</th>
            <th>ISSUE ID</th>
          </tr>
        </thead>
        <tbody>
          {actionData.map((e) => (
            <tr>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.id_status}</td>
              <td>{e.date}</td>
              <td>{e.time}</td>
              <td>{e.id_user}</td>
              <td>{e.id_report}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActionTable;
