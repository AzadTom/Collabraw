import { Menu } from 'lucide-react';
const HamBurgerButton = () => {

  return (
    <button className="fixed top-4 left-4 z-[999] w-12 h-12 cursor-pointer flex items-center justify-center bg-[var(--background)] border border-[var(--background)] rounded-md shadow-sm">
      <Menu size={20} />
    </button>
  )
}

export default HamBurgerButton