import './App.css'
import HamBurgerButton from './components/Button/HamBurgerMenu'
import LoginButton from './components/Button/LoginButton'
import ThemeProvider from './components/ThemeProvider/ThemeProvider'
import WhiteBoard from './pages/WhiteBoard'


function App() {

  return (
    <main>
      <ThemeProvider>
        <HamBurgerButton />
        <LoginButton />
        <WhiteBoard />
      </ThemeProvider>
    </main>
  )
}

export default App
