import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Sorry, we couldn’t find that page.</p>
      <Link to="/search" className="text-blue-600 hover:underline">
        Go back to search
      </Link>
    </div>
  );
}
