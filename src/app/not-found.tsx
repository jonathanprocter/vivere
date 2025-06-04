import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-6">Sorry, we couldn't find that page.</p>
      <Link href="/" className="btn-primary">Go back home</Link>
    </div>
  );
}
