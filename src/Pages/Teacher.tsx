import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Teacher() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar bg-secondary border-bottom border-body">
        <div className="container-fluid">
          <div className="d-flex justify-content-start">
            <span className="badge text-bg-dark text-capitalize navbar-text fs-1">
              Hello, [
              <span className="fst-italic fw-lighter">teacher placeholder</span>
              ]
            </span>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              color="dark"
              className="justify-content-end"
              onClick={() => navigate("/Login")}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container-flex">
        <div className="d-grid gap-2 p-4" >
          <Button className=""  onClick={() => console.log("Create Course")}>Create Course</Button>
          <Button onClick={() => console.log("See Students")}>See Students</Button>
        </div>
      </main>
    </>
  );
}

export default Teacher;
