import { MetaTags } from '@redwoodjs/web'

// Adapted from NextJS error handling to RedwoodJS
const FatalErrorPage = () => {
  return (
    <>
      <MetaTags title="Error" description="Something went wrong" />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-4">
          Please try refreshing the page or contact support if the problem persists.
        </p>
        <button
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </>
  )
}

export default FatalErrorPage