import { useState, useEffect, useRef } from "react";
import "./style.css";

function ActionForm({ onPageChange }) {
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [issueids, setIssueids] = useState([]);

  useEffect(() => {
    async function fetchData(url) {
      try {
        let names, ids;
        const response = await fetch(`http://127.0.0.1:3000/${url}`);
        const data = await response.json();
        if (url === "users") {
          names = data.map((e) => `${e.vards} ${e.uzv}`);
        } else if (url === "status") {
          names = data.map((e) => e.name_en);
        } else if (url === `issueids`) {
          ids = data.map((e) => e.id);
        }
        if (url === `users`) setUsers(names);
        if (url === `status`) setStatuses(names);
        if (url === `issueids`) setIssueids(ids);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData("users");
    fetchData("status");
    fetchData("issueids");
  }, []);

  const form = useRef(null);
  async function handleSubmit(event) {
    event.preventDefault();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    console.log(form);
    const data = new FormData(event.target);
    const currentDate = `${year}-${month}-${date}`;
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });
    const name = data.get(`name`);
    const id_status = data.get(`id_status`);
    const id_user = data.get(`id_user`);
    const id_report = data.get(`id_report`);
    console.log(
      JSON.stringify({
        name,
        id_status,
        currentDate,
        currentTime,
        id_user,
        id_report,
      })
    );

    await fetch(`http://127.0.0.1:3000/submit-action`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        id_status,
        currentDate,
        currentTime,
        id_user,
        id_report,
      }),
    })
      .then((response) => {
        console.log(response.status);
        console.log(response);
        return response.json();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleAction() {
    onPageChange(`issue`);
  }

  return (
    <div className="action-container">
      <form ref={form} onSubmit={handleSubmit} className="action-form">
        <div className="form-top">
          <button type="button" onClick={handleAction} className="action-btn">
            ISSUE FORM
          </button>
          <h1 className="issue-title">SUBMIT YOUR ACTION</h1>
        </div>
        <div className="inputs">
          <div className="left-column">
            <h3>Name</h3>
            <textarea
              required
              name="name"
              maxLength={254}
              className="remark"
            ></textarea>
            <h3>Status</h3>
            <select required name="id_status" defaultValue={""}>
              <option value=""></option>
              {statuses.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="right-column">
            <h3>User</h3>
            <select required name="id_user" defaultValue={""}>
              <option value=""></option>
              {users.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <h3>Issue ID</h3>
            <select required name="id_report" defaultValue={""}>
              <option value=""></option>
              {issueids.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="submit-div">
          <button type="submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
}

export default ActionForm;
