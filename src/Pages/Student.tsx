import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Student() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar bg-secondary border-bottom border-body">
        <div className="container-fluid">
          <div className="d-flex justify-content-start">
            <span className="badge text-bg-dark text-capitalize navbar-text fs-1">
              Hello, [
              <span className="fst-italic fw-lighter">student placeholder</span>
              ]
            </span>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              color="dark"
              className="justify-content-end"
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container-flex">
        <div className="d-grid gap-2 p-4" >
          <Button className=""  onClick={() => console.log("See Schedule")}>See Schedule</Button>
          <Button onClick={() => console.log("Add Class")}>Add Class</Button>
        </div>
      </main>
    </>
  );
}

export default Student;
