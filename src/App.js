import logo from './logo.svg';
import './App.css';
//import { Amplify } from 'aws-amplify';
//import amplifyconfig from './amplifyconfiguration.json';
//Amplify.configure(amplifyconfig);

import { useState } from 'react';
import PDFViewer from './pdfInput';

function App() {
  const [prompt, setPrompt] = useState('')

  const handleChange = e => {
    setPrompt(e.target.value);
  }

  const handleClick = e => {
    e.preventDefault();
    console.log(prompt);
  }

  
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Insert Prompt Below: 
        </p>

        <input 
          className='text-input'
          type="text"
          name="instruction"
          onChange={handleChange} 
          value={prompt}
        />
        <PDFViewer className='file-input'></PDFViewer>

        <button className='button'onClick={handleClick}> Generate Response</button>
        <div>

        </div>
        <a
          className="City of Fort Worth"
          href="https://www.fortworthtexas.gov/Home"
          target="_blank"
          rel="noopener noreferrer"
        >
          City of Fort Worth
        </a>
      </header>
    </div>
  );
}

export default App;
