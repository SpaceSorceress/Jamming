import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
    constructor(props){
        super(props);

        this.handleChangePlaylistName=this.handleChangePlaylistName.bind(this);
        
    }

    handleChangePlaylistName(event){
        this.props.updatePlaylistName(event.target.value);
    }
    

    render() {
        return (
            <div className="Playlist" onChange={this.handleChangePlaylistName}>
                <input defaultValue={this.props.name}/>
                <TrackList tracks={this.props.playlistTracks}
                removeTrack={this.props.removeTrack}
                isRemoval={true}
                />
                <button className="Playlist-save"
                onClick={this.props.savePlaylist}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}

export default Playlist; 