
import Image from "next/image";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-start py-10 lg:py-0 lg:justify-center  min-h-screen bg-gray-100">
      <Image
        src="/page.jpg" 
        alt="Error"
        width={400} 
        height={400} 
        className="object-contain"
      />
      <h1 className="text-3xl font-bold mt-6">Oops! Page not found.</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
    </div>
  );
}
