import './App.css'
import ThemeProvider from './components/ThemeProvider/ThemeProvider'
import WhiteBoard from './pages/WhiteBoard'


function App() {

  return (
    <main>
      <ThemeProvider>
        <WhiteBoard />
      </ThemeProvider>
    </main>
  )
}

export default App
