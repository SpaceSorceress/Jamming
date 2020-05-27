import React from 'react';
import './PlaylistList.css';
import PlaylistName from '../LocalPlaylist/LocalPlaylist';


class PlaylistList extends React.Component{
    
    render(){
        return (
            <div className="PlaylistList">
                <h2>Local Playlists</h2>
                <div className="Playlists">
                {this.props.playlists.map(playlist=>{
                    return <PlaylistName 
                    name={playlist.name}
                    key={playlist.id} id={playlist.id}
                    showTracks={this.props.showTracks}
                    showPlaylistName={this.props.showPlaylistName}/>
                })}
                </div>
            </div>
        )
    }
};

export default PlaylistList;