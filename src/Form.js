import { useState, useEffect, useRef } from "react";
import "./style.css";

function Form({ onPageChange }) {
  const [users, setUsers] = useState([]);
  const [objects, setObjects] = useState([]);
  const [sources, setSources] = useState([]);
  const [devices, setDevices] = useState([]);
  const [issues, setIssues] = useState([]);

  async function fetchData(url) {
    try {
      let names;
      const response = await fetch(`http://127.0.0.1:3000/${url}`);
      const data = await response.json();
      if (url === "objects") {
        names = data.map((e) => e.name);
      } else if (url === `source` || url === `device` || url === `issue-type`) {
        names = data.map((e) => e.name_en);
      } else if (url === "users") {
        names = data.map((e) => `${e.vards} ${e.uzv}`);
      }
      if (url === `users`) setUsers(names);
      if (url === `objects`) setObjects(names);
      if (url === `source`) setSources(names);
      if (url === `device`) setDevices(names);
      if (url === `issue-type`) setIssues(names);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData("users");
    fetchData("objects");
    fetchData("source");
    fetchData("device");
    fetchData("issue-type");
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
    const id_user = data.get(`id_user`);
    const id_source = data.get(`id_source`);
    const name = data.get(`name`);
    const id_object = data.get(`id_object`);
    const id_device = data.get(`id_device`);
    const id_type = data.get(`id_type`);
    const remark = data.get(`remark`);

    await fetch(`http://127.0.0.1:3000/submit-issue`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        currentDate,
        currentTime,
        id_user,
        id_source,
        name,
        id_object,
        id_device,
        id_type,
        remark,
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
    onPageChange(`action`);
  }

  return (
    <div className="container">
      <form ref={form} onSubmit={handleSubmit} className="form">
        <div className="form-top">
          <button type="button" onClick={handleAction} className="action-btn">
            ACTION FORM
          </button>
          <h1 className="issue-title">SUBMIT YOUR ISSUE</h1>
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
            <h3>Source</h3>
            <select required name="id_source" defaultValue={""}>
              <option value=""></option>
              {sources.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <h3>User</h3>
            <select required name="id_user" defaultValue={""}>
              <option value=""></option>
              {users.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <h3>Object</h3>
            <select required name="id_object" defaultValue={""}>
              <option value=""></option>
              {objects.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="right-column">
            <h3>Device</h3>
            <select required name="id_device" defaultValue={""}>
              <option value=""></option>
              {devices.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <h3>Type of issue</h3>
            <select required name="id_type" defaultValue={""}>
              <option value=""></option>
              {issues.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <h3>Remarks</h3>
            <textarea
              name="remark"
              maxLength={254}
              className="remark"
            ></textarea>
          </div>
        </div>
        <div className="submit-div">
          <button type="submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
}

export default Form;
