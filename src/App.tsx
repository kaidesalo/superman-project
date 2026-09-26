import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Pages/Login";
import Student from "./Pages/Student";
import Teacher from "./Pages/Teacher";
import Button from "./components/Button";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a href="/" className="navbar-brand mb-0 h1 text-light fs-1">
            VulpiCourse
          </a>
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Button onClick={() => console.log("Student View")}>
                  <Link
                    aria-current="page"
                    className="nav-link link-light link-offset-2 link-underline link-underline-opacity-0"
                    to="/Student"
                  >
                    Student View
                  </Link>
                </Button>
              </li>
              <li className="nav-item">
                <Button onClick={() => console.log("Login Page")}>
                  <Link
                    aria-current="page"
                    className="active nav-link link-light link-offset-2 link-underline link-underline-opacity-0"
                    to="/Login"
                  >
                    Login
                  </Link>
                </Button>
              </li>
              <li className="nav-item">
                <Button onClick={() => console.log("Teacher View")}>
                  <Link
                    aria-current="page"
                    className="nav-link link-light link-offset-2 link-underline link-underline-opacity-0"
                    to="/"
                  >
                    Teacher View
                  </Link>
                </Button>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <Button className="btn-outline-success" type="submit" onClick={() => console.log("SEARCH!!!")}>Search</Button>
            </form>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Teacher />} />
        <Route path="/Student" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
