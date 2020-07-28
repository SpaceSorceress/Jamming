import React from 'react';
import './PlaylistList.css';
import PlaylistName from '../LocalPlaylist/LocalPlaylist';


class PlaylistList extends React.Component{
    constructor(props){
        super(props);

        this.componentDidMount=this.componentDidMount.bind(this);
        this.updateScreenNow=this.updateScreenNow.bind(this);
    }

    componentDidMount(){
        this.props.updateScreen();
    }
    updateScreenNow(){
        this.props.updateScreen();
    }
    render(){
        return (
            <div className="PlaylistList">
                <h2 onClick={this.updateScreenNow}>Local Playlists</h2>
                <div className="Playlists">
                {this.props.playlists.map(playlist=>{
                    return (
                      <PlaylistName
                        name={playlist.name}
                        key={playlist.id}
                        id={playlist.id}
                        showTracks={this.props.showTracks}
                        showPlaylistName={this.props.showPlaylistName}
                        unfollowPlaylist={this.props.unfollowPlaylist}
                      />
                    );
                })}
                </div>
            </div>
        )
    }
};

export default PlaylistList;