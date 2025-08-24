import { Button } from "../ui/button"
import { LogIn } from "lucide-react"

const LoginButton = () => {
  return (
    <div className="fixed bottom-4 sm:top-4 right-4 z-[999]">
      <Button
        style={{padding:'8px 20px'}}
        className="cursor-pointer h-12 text-xl flex items-center gap-2 bg-white border border-gray-300 px-6 py-3 rounded-md shadow-sm transition-all duration-200"
      >
        <LogIn size={18}/>
        <span className="hidden sm:block capitalize">Login</span>
      </Button>
    </div>
  )
}

export default LoginButton
