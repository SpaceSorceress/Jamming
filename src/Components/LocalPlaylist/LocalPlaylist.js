import React from 'react';
import './LocalPlaylist.css';

class PlaylistName extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this);
        this.unfollow=this.unfollow.bind(this);
    }

    handleClick(event){
        this.props.showTracks(event.target.id);
        this.props.showPlaylistName(event.target.innerHTML);
        event.preventDefault();
    }
    unfollow(event){
        this.props.unfollowPlaylist(event.target.className);
    }


    render(){
        return (
          <div className="LocalPlaylist">
            <h3 onClick={this.handleClick} id={this.props.id}>
              {this.props.name}
            </h3>
            <button onClick={this.unfollow} className={this.props.id}>
              unfollow
            </button>
          </div>
        );
    }
}

export default PlaylistName;