import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

//Greeter Address
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [message, setMessage] = useState("");
//Helper Functions
//Request Access to User's Metamask
async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts'});
}

//Fetch value
async function fetchGreeting() {
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('Data: ', data);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
}

//Set Value
async function setGreeting() {
  
  if (!message) return;

  //If metamask exists
  if(typeof window.ethereum != "undefined") {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //Create contract with signer
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
    const transaction = await contract.setGreeting(message);

    setMessage("");
    await transaction.wait();
    fetchGreeting();
  }
}

  return (
    <div className="App">
      <div className='App-header'>
        <div className='btnCustomized'>
          <button onClick={fetchGreeting} style={{backgroundColor: "yellow"}}>Fetch Greet</button>
          <button onClick={setGreeting} style={{backgroundColor: "green"}}>Set Greet</button>
        </div>
        <input
          onChange={ (e) => setMessage(e.target.value) }
          value = {message}
          placeholder='Set Greeting Message'
        />
      </div>
    </div>
  );
}

export default App;
