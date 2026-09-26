import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "../Pages/Login";
import Student from "../Pages/Student";
import Teacher from "../Pages/Teacher";
import Button from "../components/Button";

const Navbar = () => {
  return (
    <Router>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a href="/" className="navbar-brand mb-0 h1 text-light fs-1">
            VulpiCourse
          </a>
          <button
            className="navbar-toggler"
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
                <Link
                  aria-current="page"
                  className="nav-link"
                  to="/Student"
                >
                  Student View
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  aria-current="page"
                  className="nav-link"
                  to="/Login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  aria-current="page"
                  className="nav-link"
                  to="/"
                >
                  Teacher View
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <Button
                className="btn-outline-success"
                type="submit"
                onClick={() => console.log("SEARCH!!!")}
              >
                Search
              </Button>
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
  )
}

export default Navbar