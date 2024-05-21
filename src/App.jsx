import './App.css'
import CurrencyConverter from './components/CurrencyConverter';

function App() {

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center">
      <div className="container">
        <CurrencyConverter/>
      </div>
    </div>

  );
}

export default App
