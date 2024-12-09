import Link from "next/link";

function RootNotFound() {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-bold">COMING SOON</h1>
          <p className="text-lg">We are working on this page</p>
          <Link href="/">
            <div className="text-blue-500">Go back to home</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RootNotFound;
