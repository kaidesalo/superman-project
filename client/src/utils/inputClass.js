// Shared Tailwind classes for text inputs; red border when the field has an error
export const inputClass = (hasError) =>
  `mt-1 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
    hasError ? 'border-red-400' : 'border-slate-300'
  }`
