import { useState, useEffect } from 'react';

export default function StudentSchedule() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Fetch the data when the component mounts
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('https://sdev-module5-tutorial.onrender.com/api/studentCourses');
        const result = await response.json();
        console.log(result);
        setCourses(result); // Update state with the fetched array
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <p>Loading schedule...</p>;

  // 3. Iterate over the data using .map() inside JSX
  return (
    <div>
      <h2>My Schecule</h2>
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