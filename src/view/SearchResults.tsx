import React from 'react';
import {QueryDriver} from '../domain/QueryDriver';
import FlatList from 'flatlist-react';
import {SearchResultCell} from './SearchResultCell';
import { observer } from "mobx-react"

interface IProps {
  driver:QueryDriver;
}

@observer
export class SearchResults extends React.Component<IProps> {
    render() {
      return (
          <FlatList
          list={this.props.driver.results}
          renderItem={this.renderResult}/>
      );
    }

    renderResult = (result:string, idx: number) => {
        return (<SearchResultCell result={result} />);
    }
}