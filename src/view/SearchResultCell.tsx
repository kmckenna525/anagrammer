import React from 'react';
import { ListGroup } from 'react-bootstrap';

interface IProps {
    result:string;
  }

  
  export class SearchResultCell extends React.Component<IProps> {
      render() {
        return (
        <ListGroup.Item>{this.props.result.length}: {this.props.result}</ListGroup.Item>
        );
      }
  }