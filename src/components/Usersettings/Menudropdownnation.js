import React, {Component} from 'react';
import CommonSelect, { CommonOption} from '../commons/Select';

class Menudropdownnation extends Component{
  constructor(props){
    super(props);
    this.state = {
      lists: ["+386 Slovenia", "+677 Solomon Islands","+27 South Africa","+500 South Georgia and the South Sandwich Islands","+82 South Korea"]};
    
  }
  handleChange = event => {
    this.setState({value:event.target.value});
  };
  render(){
    return(
    <CommonSelect onChange={this.props.onChange}>
      {this.state.lists.map(list=>(
        <CommonOption key={list} value={list}>{list}
        </CommonOption>
      ))}
    </CommonSelect>
    )
  }

}




    export default Menudropdownnation;