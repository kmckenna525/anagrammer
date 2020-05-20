import React from 'react';
import {QueryDriver} from '../domain/QueryDriver';
import FlatList from 'flatlist-react';
import {SearchResultCell} from './SearchResultCell';
import { observer } from "mobx-react"
import { ListGroup, Container } from 'react-bootstrap';

interface IProps {
  driver:QueryDriver;
}

@observer
export class SearchResults extends React.Component<IProps> {
    render() {
      const results = this.props.driver.results.sort((a,b)=>b.length - a.length);

      return (
        <Container fluid='md' >
          <ListGroup >
            <FlatList
            list={results}
            renderItem={this.renderResult}/>
          </ListGroup>
        </Container>
      );
    }

    renderResult = (result:string, idx: number) => {
        return (<SearchResultCell result={result} />);
    }
}