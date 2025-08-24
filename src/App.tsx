import './App.css'
import HamBurgerButton from './components/Button/HamBurgerMenu'
import LoginButton from './components/Button/LoginButton'
import WhiteBoard from './pages/WhiteBoard'


function App() {

  return (
    <main>
      <HamBurgerButton />
      <LoginButton/>
      <WhiteBoard />
    </main>
  )
}

export default App
