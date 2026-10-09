// @ts-ignore
import React, { useState, useEffect } from 'react'; 

// @ts-ignore
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";

// @ts-ignore
import StudentSchedule from "../components/StudentSchedule";

import StudentAddCourseList from "../components/StudentAddCourseList";

function StudentAddCoursePage() {
  const navigate = useNavigate();

  // @ts-ignore
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

          <StudentAddCourseList />

        </div>
      </main>
    </>
  );
}

export default StudentAddCoursePage;
