import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4">
      <h1 className="text-4xl font-bold text-pink-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-pink-800 mb-6">Testimonials Not Found</h2>
      <p className="text-pink-700 mb-8 text-center max-w-md">
        We couldn&apos;t find the testimonials you&apos;re looking for. They may have been moved or don&apos;t exist.
      </p>
      <Button asChild>
        <Link href="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  )
}

