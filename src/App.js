import React from 'react';
import QueryForm from './view/QueryForm'
import './App.css';
import { QueryDriver } from './domain/QueryDriver';
import { SearchResults } from './view/SearchResults';
import { Jumbotron, Button } from 'react-bootstrap';

function App() {
  const driver = new QueryDriver();
  return (
    <div className="App">
      <Jumbotron>
        <h1>Anagram Solver</h1>
        <QueryForm driver={driver}/>
      </Jumbotron>
      <SearchResults driver={driver}/>
    </div>
  );
}

export default App;
