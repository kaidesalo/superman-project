import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Pages/Login";
import Student from "./Pages/Student";
import Teacher from "./Pages/Teacher";
import Button from "./components/Button";

function App() {
  return (
    <Router>
      <nav className="row justify-content-center">
        <div className="btn-group" role="group" aria-label="page">
          <Button onClick={() => console.log("Student View")}>
            <Link className="link-light link-offset-2 link-underline link-underline-opacity-0" to="/Student">Student View</Link>
          </Button>
          <Button className="active" onClick={() => console.log("Login Page")}>
            <Link className=" link-light link-offset-2 link-underline link-underline-opacity-0" to="/">Login</Link>
          </Button>
          <Button onClick={() => console.log("Teacher View")}>
            <Link className="link-light link-offset-2 link-underline link-underline-opacity-0" to="/Teacher">Teacher View</Link>
          </Button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/Teacher" element={<Teacher />}/>
        <Route path="/Student" element={<Student />}/>
      </Routes>
    </Router>
  );
}

export default App;
