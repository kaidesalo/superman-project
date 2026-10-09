// @ts-ignore
import React, { useState } from 'react';
import Button from "../components/Button";

export default function InstructorAddCourse() {

  // loading
  const [loading, setLoading] = useState(false);
  
  // success / error message after api response
  const [message, setMessage] = useState('');

  // handle form submit
  const handleSubmit = async (event?: any) => {
    // prevent browser from submitting form
    event.preventDefault(); 
    setLoading(true);
    setMessage('');

    //alert('clicked...' + event.currentTarget);

    // identify the form
    const form = document.getElementById('addCourseForm') as HTMLFormElement;

    // use formData to serialize and capture all form data
    const formData = new FormData(form);
    
    // convert form field data to json
    const formJson = Object.fromEntries(formData.entries());

    // send post request to api
    try {
      const response = await fetch('https://sdev-module5-tutorial.onrender.com/api/addCourse', {
        method: 'POST',
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
      setMessage('Course Added!');

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
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit} id = "addCourseForm">
        <div>
          <label htmlFor="name">Course Name:</label>
          <input type="text" id="name" name="name" required />
        </div>

        <button className="" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}