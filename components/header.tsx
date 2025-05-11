import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">TuxTime</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

