import React from 'react';

interface IProps {
    result:string;
  }

  
  export class SearchResultCell extends React.Component<IProps> {
      render() {
        return (
        <span>{this.props.result.length}: {this.props.result}</span>
        );
      }
  }