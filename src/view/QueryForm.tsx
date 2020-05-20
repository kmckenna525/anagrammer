import React from 'react';
import {QueryDriver} from '../domain/QueryDriver';
import { Button, ButtonGroup } from 'react-bootstrap';

export interface IProps {
  driver:QueryDriver;
}
export interface IState {
  value:string;
}

export class QueryForm extends React.Component<IProps, IState> {
    constructor(props:any) {
      super(props);
      this.state = {value:''};
    }
  
    handleChange = (event:any) => {
      this.setState({value: event.target.value});
    }
  
    handlePrefix = (event:any) => {
      event.preventDefault();
      this.props.driver.searchPrefix(this.state.value);
    }
  
    handleSuffix = (event:any) => {
      event.preventDefault();
      this.props.driver.searchSuffix(this.state.value);
    }
  
    handlePattern = (event:any) => {
      event.preventDefault();
      this.props.driver.searchPattern(this.state.value);
    }
  
    handleAnagram = (event:any) => {
      event.preventDefault();
      this.props.driver.searchAnagrams(this.state.value);
    }
  
    handleNAnagram = (event:any) => {
      event.preventDefault();
      this.props.driver.searchNAnagrams(this.state.value);
    }
  
    render() {
      return (
        <view>
          <label>
            Query:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label><br/>
          <ButtonGroup>
            <Button variant="secondary" value="Prefix" onClick={this.handlePrefix}>Prefix</Button>
            <Button variant="secondary" value="Suffix" onClick={this.handleSuffix}>Suffix</Button>
            <Button variant="secondary" value="Pattern" onClick={this.handlePattern}>Pattern</Button>
            <Button variant="secondary" value="Anagram" onClick={this.handleAnagram}>Anagram</Button>
            <Button variant="secondary" value="NAnagram" onClick={this.handleNAnagram}>N-Anagram</Button>
          </ButtonGroup>
        </view>
      );
    }
}

export default QueryForm;