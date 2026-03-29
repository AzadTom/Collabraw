import { ThemeToggle } from "../ThemeToggle/ThemeToggle"
import { Button } from "../ui/button"
import { LogIn } from "lucide-react"

const LoginButton = () => {
  return (
    <div className="flex flex-col gap-4 items-center w-full p-4">
      <div className="flex w-full items-center justify-between">
         <span className="text-sm font-medium">Appearance</span>
         <ThemeToggle />
      </div>
      <Button
        className="w-full flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Log In
      </Button>
    </div>
  )
}

export default LoginButton
