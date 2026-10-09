import { useState, useEffect } from 'react';

interface CourseType {
  _id: string;
  name: string;
}

export default function StudentSchedule() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(false);

  // get courses when my schedule button is clicked
  // from google search, which modifications
  useEffect(() => {
    fetch('https://sdev-module5-tutorial.onrender.com/api/studentCourses')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data); // Save the array to state
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (loading) return <p>Loading schedule...</p>;

  // loop over the data using map
  return (
    <div>
      <h2>My Schedule</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.studentId}</strong> — {course.courseId}
          </li>
        ))}
      </ul>
    </div>
  );
}