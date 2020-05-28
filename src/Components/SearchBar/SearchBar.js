import React from 'react';
import './SearchBar.css';

 class SearchBar extends React.Component {
     constructor(props){
         super(props);
         this.state={
            searchValue:"Spotify"
         };

         this.handleValueChange=this.handleValueChange.bind(this);
         this.handleSearch=this.handleSearch.bind(this);
         this.keyDown=this.keyDown.bind(this);
     }

     handleValueChange(event){
        this.setState({
            searchValue:event.target.value
        });
    }

    keyDown(event){
        if(event.key==="Enter"){
            this.handleSearch();
            event.preventDefault();
        }
    }

    handleSearch(){
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <div className="SearchBar" onKeyDown={this.keyDown}>
                {this.props.loggedIn&&<input placeholder={this.props.placeholderTrue}
                onChange={this.handleValueChange} />}
                {!this.props.loggedIn&&<input value={this.props.placeholderFalse}
                onChange={this.handleValueChange} />}

                {this.props.loggedIn&&<button className="SearchButton"
                onClick={this.handleSearch}>SEARCH</button>}
                {!this.props.loggedIn&&<button className="SearchButton"
                onClick={this.handleSearch} id="searchButton">LOG IN</button>}
            </div>
        )
    }
}

export default SearchBar;