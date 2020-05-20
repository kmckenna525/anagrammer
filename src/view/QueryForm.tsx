import React from 'react';
import {QueryDriver} from '../domain/QueryDriver';

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
          </label>
          <input type="button" value="Prefix" onClick={this.handlePrefix}/>
          <input type="button" value="Suffix" onClick={this.handleSuffix}/>
          <input type="button" value="Pattern" onClick={this.handlePattern}/>
          <input type="button" value="Anagram" onClick={this.handleAnagram}/>
          <input type="button" value="NAnagram" onClick={this.handleNAnagram}/>
        </view>
      );
    }
}

export default QueryForm;