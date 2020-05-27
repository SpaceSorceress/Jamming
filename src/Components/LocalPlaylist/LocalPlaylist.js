import React from 'react';
import './LocalPlaylist.css';

class PlaylistName extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(event){
        this.props.showTracks(event.target.id);
        this.props.showPlaylistName(event.target.innerHTML);
        event.preventDefault();
    }


    render(){
        return (
            <div className="LocalPlaylist">
                <h3 onClick={this.handleClick} id={this.props.id}>
                    {this.props.name}</h3>
            </div>
        )
    }
}

export default PlaylistName;