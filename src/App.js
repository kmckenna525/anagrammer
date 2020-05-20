import React from 'react';
import QueryForm from './view/QueryForm'
import './App.css';
import { QueryDriver } from './domain/QueryDriver';
import { SearchResults } from './view/SearchResults';

function App() {
  const driver = new QueryDriver();
  return (
    <div className="App">
      <header className="App-header">
        Anagram Solver
      <QueryForm driver={driver}/>
      <SearchResults driver={driver}/>
      </header>
    </div>
  );
}

export default App;
