import { useEffect } from "react";
import { useState } from "react";
import CurrencyDropdown from "./dropdown";
import { PiArrowsLeftRightFill } from "react-icons/pi";

const CurrencyConverter = () => {
const [currencies, setcurrencies] = useState([]);
const [amount, setAmount] = useState(1);
const [fromCurrency, setFromCurrency] = useState("USD");
const [toCurrency, setToCurrency] = useState("INR");
const [convertedAmount, setConvertedAmount] = useState(null);
const [converting, setConverting] = useState(false);
const [favorites, setFavorites] = useState(
  JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
);


  // CURRENCIES -> https://api.frankfurter.app/currencies
   const fetchCurrencies =async () => {
      try {
        const res = await fetch("https://api.frankfurter.app/currencies");
        const data = await res.json();

        setcurrencies(Object.keys(data)); 

      } catch (error) {
        console.log("Error Fetching", error);
      }
   }

       useEffect(() => {
        fetchCurrencies();
      }, [])
   
      console.log(currencies);

      // CONVERSION -> https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
      const convertCurrency = async() => {
          if(!amount) return;
          setConverting(true);
        try {
          const res = await fetch(  
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
          const data = await res.json();
  
          setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
  
        } catch (error) {
          console.log("Error Fetching", error);
        } finally{
          setConverting(false);
        }
      };


      const handleFavorite = (currency) => {
        let updatedFavorites = [...favorites];

           if(favorites.includes(currency)){
            updatedFavorites = updatedFavorites.filter(fav=>fav!==currency);
           } else {
              updatedFavorites.push(currency);
           }
             setFavorites(updatedFavorites);
             localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      };

      const swapCurrencies= () =>  {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
      }
  
  
  return (
    < div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-2xl">
      <h2 className="mb-5 text-2xl font-extrabold text-gray-700">
        Currency Conventer
        </h2>
        
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end font-semibold ">
              <CurrencyDropdown 
              favorites={favorites}
              currencies={currencies} 
              title="From:" 
              currency={fromCurrency}
              setCurrency={setFromCurrency}
              handleFavorite={handleFavorite}/>

               { /* swap currency button */ }
                 <div className="flex justify-center -mb-5 sm:mb-0">
                    <button 
                    onClick={swapCurrencies}
                    className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-400">
                    <PiArrowsLeftRightFill className="text-xl text-gray-700" />
                    </button>
                 </div>

              <CurrencyDropdown 
              favorites={favorites}
              currencies={currencies} 
              title="To:" 
              currency={toCurrency}
              setCurrency={setToCurrency}
              handleFavorite={handleFavorite}/>
              </div>


         <div className="mt-4">
              <label 
               htmlFor="amount"
               className="block font-medium text-sm text-gray-700">
            Amount:
            </label>

          <input
           value={amount}
           onChange={(e) => setAmount(e.target.value)}  
           type="number" 
           className="w-full p-2 border border-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-700 mt-1 " />
         </div>

         <div className="flex justify-end mt-6" >

             <button 
              onClick={convertCurrency}
              className={`px-5 py-2 bg-teal-700 text-white rounded-md hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2
               ${converting ? "animate-pulse" : ""}`}
               > Convert </button>
         </div>

         {convertedAmount && (
          <div className="mt-4 text-lg font-extrabold text-right text-teal-700">
          Converted Amount: {convertedAmount}
           </div>
      )}
    </div>
   ); 
};

export default CurrencyConverter;
