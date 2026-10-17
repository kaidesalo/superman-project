import { useState } from 'react'

// Search box that reports the submitted text to the parent. Pressing Enter or
// "Search" submits; "Clear" resets the search.
function SearchBar({ initialValue = '', onSearch, placeholder = 'Search...' }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="course-search" className="sr-only">
        Search courses
      </label>
      <input
        id="course-search"
        maxLength={100}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:flex-1"
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 sm:flex-none">
          Search
        </button>
        {initialValue && (
          <button type="button" onClick={handleClear} className="flex-1 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none">
            Clear
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
