import Button from "../components/Button";

const Login = () => {
  return (
    <>
      <div className="row justify-content-center">
        <form className="container card bg-secondary text-white p-4 shadow m-4">
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control bg-dark text-white border-light"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control bg-dark text-white border-light"
              id="exampleInputPassword1"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Forgot Password
            </label>
          </div>
          <Button
            className="btn-light"
            onClick={() => console.log("Submited Form!!!")}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
