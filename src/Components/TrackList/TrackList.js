import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';


 class TrackList extends React.Component {
    
    render() {
        return (
            <div className="TrackList">
                {   this.props.tracks?//checks if list of tracks was passed down from Search Results
                this.props.tracks.map(track=>{
            return  <Track track={track} 
                key={track.id} 
                onAdd={this.props.addSong}
                removeTrack={this.props.removeTrack}
                isRemoval={this.props.isRemoval}
                updatePlaylistName={this.props.updatePlaylistName}
                /> })
                :'somehow it\'s not get rendered otherwise'
               }
            </div>
        );
    }
}
export default TrackList;