// @ts-ignore
import React, { useState, useEffect } from 'react'; 

import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StudentSchedule from "../components/StudentSchedule";

function Student() {
  const navigate = useNavigate();

  // 1. Initialize state to false
  const [isLoaded, setIsLoaded] = useState(false);

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
          {/* 2. Change state to true on click */}
          <Button onClick={() => setIsLoaded(true)}>
            My Schedule
          </Button>
          <Button onClick={() => navigate("/StudentAddCoursePage")}>Add Class</Button>

          {/* 3. Conditionally render the component using the && operator */}
          {isLoaded && <StudentSchedule />}

        </div>
      </main>
    </>
  );
}

export default Student;
