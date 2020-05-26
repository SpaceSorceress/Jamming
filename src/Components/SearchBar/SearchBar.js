import React from 'react';
import './SearchBar.css';

 class SearchBar extends React.Component {
     constructor(props){
         super(props);
         this.state={
            searchValue:""
         };

         this.handleValueChange=this.handleValueChange.bind(this);
         this.handleSearch=this.handleSearch.bind(this);
     }

     handleValueChange(event){
        this.setState({
            searchValue:event.target.value
        });
    }

    handleSearch(){
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleValueChange} />
                <button className="SearchButton"
                onClick={this.handleSearch}>SEARCH</button>
            </div>
        )
    }
}

export default SearchBar;