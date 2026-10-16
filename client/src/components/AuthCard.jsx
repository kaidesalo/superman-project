import FoxLogo from './FoxLogo.jsx'

// Shared layout for the Sign In and Register pages
function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <FoxLogo className="h-12 w-12" />
          <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthCard
