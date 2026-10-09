// @ts-ignore
import React, { useState, useEffect } from 'react'; 

// @ts-ignore
import { Link, useParams, useNavigate } from "react-router-dom";

// @ts-ignore
import Button from "../components/Button";

export default function InstructorEditCourse() {

  // loading
  const [loading, setLoading] = useState(false);
  
  // success / error message after api response
  const [message, setMessage] = useState('');

  const [courseName, setCourseName] = useState('');

  // get the course id
  const { id } = useParams(); // Matches the :id definition from the route

  // alert(id);

  // get the course data
  // 2. Fetch original data when component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://sdev-module5-tutorial.onrender.com/api/courses/' + id);
        if (!response.ok) throw new Error('Failed to fetch item data');
        
        const data = await response.json();
        
        // Populate form state with data from the API
        setCourseName(data[0].name);
      } catch (err) {
        //setError(err.message);
        // alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // handle form submit
  const handleSubmit = async (event?: any) => {
    // prevent browser from submitting form
    event.preventDefault(); 
    setLoading(true);
    setMessage('');

    //alert('clicked...' + event.currentTarget);

    // identify the form
    const form = document.getElementById('editCourseForm') as HTMLFormElement;

    // use formData to serialize and capture all form data
    const formData = new FormData(form);
    
    // convert form field data to json
    const formJson = Object.fromEntries(formData.entries());

    // send post request to api
    try {
      const response = await fetch('https://sdev-module5-tutorial.onrender.com/api/updateCourse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formJson),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // @ts-ignore
      const result = await response.json();

      setMessage('Course Updated!');
      
      // safely reset the form
      if (form !== null) {
        // TypeScript knows 'form' is safe here
        form.reset(); 
      }

    } catch (error) {
       if (error instanceof Error) {
        // TypeScript now knows 'error' is an Error object
        // console.error(error.message);
        setMessage(`Error: ${error.message}`);
      } else {
        // Handle the case where something else was thrown (e.g., a string or null)
        console.error("An unexpected error occurred", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit} id = "editCourseForm">

        <input type = "text" name = "courseID" id = "courseID" defaultValue={id} />

        <div>
          <label htmlFor="name">Course Name:</label>
          <input type="text" id="name" name="name" required defaultValue={courseName} />
        </div>

        <button className="" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating Course...' : 'Update Course'}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}