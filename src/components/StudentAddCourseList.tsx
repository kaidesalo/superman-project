import { useState, useEffect } from 'react';

// @ts-ignore
import { Link } from "react-router-dom";

import Button from "../components/Button";

export default function StudentAddCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // get list of courses
  // from google search, with modifications
  useEffect(() => {
    fetch('https://sdev-module5-tutorial.onrender.com/api/courses')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data); // Save the array to state
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // from google search results
  // delete item from list and api on button click
  // can this be moved to a new component??
  const handleAdd = async (id: string) => {
    
    // confirm delete
    const confirmDelete = window.confirm("Are you sure you want to delete this course? " + id);
    if (!confirmDelete) return;

    try {
      // Send the DELETE request to your API endpoint
      const response = await fetch('https://sdev-module5-tutorial.onrender.com/api/courses/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update the local state to remove the item from the UI immediately
        setCourses(courses.filter(course => course._id !== id));
        // alert("Course deleted successfully!");

      } else {
        alert("Failed to delete course from the server.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (loading) return <p>Loading courses...</p>;

  // 3. Iterate over the data using .map() inside JSX
  return (
    <div>
      <h2>Available Courses</h2>
      <ul>
          {courses.map((course) => (
            <li key={course._id}>
              {course.name} - {course._id} - 
              <button onClick={() => handleAdd(course._id)} style={{ marginLeft: '10px', color: 'red' }}>
                Add
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}