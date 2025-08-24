import { ThemeToggle } from "../ThemeToggle/ThemeToggle"
import { Button } from "../ui/button"
import { LogIn } from "lucide-react"

const LoginButton = () => {
  return (
    <div className="fixed bottom-4 sm:top-4 right-4 z-[999]">
      <div className="flex  gap-4 items-center">
        <ThemeToggle />
        <Button
          style={{ padding: '8px 20px' }}
          className="cursor-pointer  h-12 text-xl flex items-center gap-2 bg-[var(--background)] hover:bg-[var(--background)]  text-blackborder border-[var(--background)] px-6 py-3 rounded-md shadow-sm transition-all duration-200"
        >
          <LogIn style={{ width: '18px', height: '18px' }} />
        </Button>
      </div>
    </div>
  )
}

export default LoginButton
