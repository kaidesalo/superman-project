// @ts-ignore
import React, { useState, useEffect } from 'react'; 

// @ts-ignore
import { Link, useParams, useNavigate } from "react-router-dom";

// @ts-ignore
import Button from "../components/Button";

// @ts-ignore
import InstructorEditCourse from "../components/InstructorEditCourse";

function InstructorEditCoursePage() {
  const navigate = useNavigate();

  // alert(courseId);

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

          <Button className="" onClick={() => navigate("/InstructorSchedulePage")}>
            Courses
          </Button>

          <Button className="" onClick={() => navigate("/InstructorAddCoursePage")}>
            Create Course
          </Button>

          <Button className="" onClick={() => console.log("See Students")}>See Students</Button>

          <InstructorEditCourse />

        </div>
      </main>
    </>
  );
}

export default InstructorEditCoursePage;
