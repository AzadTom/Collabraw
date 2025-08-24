import { Menu } from 'lucide-react';
const HamBurgerButton = () => {

  return (
    <button className="fixed bottom-4 sm:top-4 left-4 z-[999] w-12 h-12 cursor-pointer flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm">
      <Menu color="#000" size={20} />
    </button>
  )
}

export default HamBurgerButton