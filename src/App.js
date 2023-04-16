import { useState, useEffect } from "react";
import "./style.css";
import Form from "./Form";
import Table from "./Table";
import ActionForm from "./ActionForm";
import ActionTable from "./ActionTable";

function App() {
  const [active, setActive] = useState(`issue`);

  const handlePage = (currentPage) => {
    setActive(currentPage);
  };
  return (
    <>
      {active === `issue` && <Form onPageChange={handlePage}></Form>}
      {active === `issue` && <Table />}
      {active === `action` && (
        <ActionForm onPageChange={handlePage}></ActionForm>
      )}
      {active === `action` && <ActionTable />}
    </>
  );
}
export default App;
