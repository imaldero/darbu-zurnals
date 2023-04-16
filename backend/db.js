const mysql = require(`mysql2`);
const express = require(`express`);
const app = express();
const cors = require(`cors`);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port 3000`);
  }
});

const con = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  database: `darbu_zurnals`,
  multipleStatements: true,
});

app.get(`/users`, (req, res) => {
  con.query(`SELECT name FROM person_fname`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.get(`/objects`, (req, res) => {
  con.query(`SELECT name FROM object`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.get(`/status`, (req, res) => {
  con.query(`SELECT name_en FROM report_status`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.get(`/source`, (req, res) => {
  con.query(`SELECT id, name_en FROM report_source`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.get(`/device`, (req, res) => {
  con.query(`SELECT id, name_en FROM report_device`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.get(`/issue-type`, (req, res) => {
  con.query(`SELECT id, name_en FROM issue_type`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.post(`/submit-issue`, (req, res) => {
  const currentDate = req.body.currentDate;
  const currentTime = req.body.currentTime;
  const id_user = req.body.id_user;
  const id_source = req.body.id_source;
  const name = req.body.name;
  const id_object = req.body.id_object;
  const id_device = req.body.id_device;
  const id_type = req.body.id_type;
  const remark = req.body.remark;
  con.query(
    `INSERT INTO report_issue (date, time, id_user, id_source, name, id_obj, id_device, id_type, note)
    VALUES ("${currentDate}", "${currentTime}", ${id_user}, ${id_source}, "${name}", ${id_object}, ${id_device}, ${id_type}, "${remark}")`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    }
  );
});

app.get(`/issue`, (req, res) => {
  con.query(
    `SELECT report_issue.id, report_issue.date, report_issue.time, person.fname AS id_user,report_source.name_en AS id_source, object.name AS id_obj ,report_issue.name,report_device.name_en AS id_device,issue_type.name_en AS id_type, note FROM report_issue    
    LEFT JOIN object ON report_issue.id_obj = object.id
    LEFT JOIN person ON report_issue.id_user = person.id
    LEFT JOIN report_source ON report_issue.id_source = report_source.id
    LEFT JOIN report_device ON report_issue.id_device = report_device.id
    LEFT JOIN issue_type ON report_issue.id_device = issue_type.id`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    }
  );
});

app.get(`/issueids`, (req, res) => {
  con.query(`SELECT id FROM report_issue`, (err, result) => {
    if (err) {
      res.send(err);
      return;
    } else {
      res.send(result);
      return;
    }
  });
});

app.post(`/submit-action`, (req, res) => {
  const name = req.body.name;
  const id_status = req.body.id_status;
  const currentDate = req.body.currentDate;
  const currentTime = req.body.currentTime;
  const id_user = req.body.id_user;
  const id_report = req.body.id_report;
  con.query(
    `INSERT INTO report_action (name, id_status, date, time, id_user, id_report)
    VALUES ("${name}", ${id_status}, "${currentDate}", "${currentTime}", ${id_user}, ${id_report})`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    }
  );
});

app.get(`/action`, (req, res) => {
  con.query(
    `SELECT report_action.id,  report_action.name, report_status.name_en AS id_status, report_action.date, report_action.time, person.fname AS id_user, report_issue.id AS id_report FROM report_action    
    LEFT JOIN person ON report_action.id_user = person.id
    LEFT JOIN report_status ON report_action.id_status = report_status.id
    LEFT JOIN report_issue ON report_action.id_report = report_issue.id`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    }
  );
});
