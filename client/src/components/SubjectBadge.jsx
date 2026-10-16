const COLORS = {
  'Computer Science': 'bg-blue-50 text-blue-700',
  Mathematics: 'bg-amber-50 text-amber-700',
  English: 'bg-green-50 text-green-700',
  Biology: 'bg-indigo-50 text-indigo-700',
  Chemistry: 'bg-teal-50 text-teal-700',
  History: 'bg-rose-50 text-rose-700',
}

function SubjectBadge({ subject }) {
  const color = COLORS[subject] || 'bg-slate-100 text-slate-700'
  return <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${color}`}>{subject}</span>
}

export default SubjectBadge
