import React from 'react';
import './App.css';
import  SearchBar  from '../SearchBar/SearchBar';
import SearchResults  from '../SearchResults/SearchResults';
import  Playlist  from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state={
        searchResults: [
          {album:
          "The Black Parade",
          artist:
          "My Chemical Romance",
          id:
          "5wQnmLuC1W7ATsArWACrgW",
          name:
          "Welcome to the Black Parade",
          uri:
          "spotify:track:5wQnmLuC1W7ATsArWACrgW"},
          
          {album: "Appetite For Destruction", artist: 
          "Guns N' Roses",
          id:"0G21yYKMZoHa30cYVi1iA8",
          name:
          "Welcome To The Jungle",
          uri:
          "spotify:track:0G21yYKMZoHa30cYVi1iA8"},
          
          {album: "Meet The Woo", artist: "Pop Smoke", id: 
          "0fIffclhgJC5h8AdMMVvkp",
          name:
          "Welcome To The Party",
          uri:
          "spotify:track:0fIffclhgJC5h8AdMMVvkp"},
          
          {album: "Welcome to Wonderland", artist:
          "Anson Seabra",
          id:
          "3JfHYZKy5JmE5Fv4gDTCiz",
          name:
          "Welcome to Wonderland",
          uri:
          "spotify:track:3JfHYZKy5JmE5Fv4gDTCiz"},
          
          {album: "Life of a Dark Rose", artist: "Lil Skies",
          id:
          "5GpAhJpbHvUi6gY6RG15Ze",
          name:
          "Welcome to the Rodeo",
          uri:
          "spotify:track:5GpAhJpbHvUi6gY6RG15Ze"},
          
          {album: "Welcome to Chilis", artist: "Yung Gravy", 
          id:
          "7BYppcUTuG5ysmaJlGSt3t",
          name:
          "Welcome to Chilis",
          uri:
          "spotify:track:7BYppcUTuG5ysmaJlGSt3t"},
          
          {album:
          "Welcome to the Party (with French Montana & Lil Pump, feat. Zhavia Ward) [from Deadpool 2]",
          artist:
          "Diplo",
          id:
          "5mqzhMuUpvnMfwNz6iepmO",
          name:
          "Welcome to the Party (with French Montana & Lil Pump, feat. Zhavia Ward) - from Deadpool 2",
          uri:
          "spotify:track:5mqzhMuUpvnMfwNz6iepmO"},
          {album: 
            "Good Apollo I'm Burning Star IV Volume One: From Fear Through The Eyes Of Madness",
            artist:
            "Coheed and Cambria",
            id:
            "42GP0xKtkolBnmqQRvSllO",
            name:
            "Welcome Home",
            uri:
            "spotify:track:42GP0xKtkolBnmqQRvSllO"},
            
            {album: "Still Not Getting Any", artist: 
            "Simple Plan",
            id:
            "714Lw0m2SmCEhKSPw0Dn8J",
            name:
            "Welcome to My Life",
            uri:
            "spotify:track:714Lw0m2SmCEhKSPw0Dn8J"}
      ],
      playlistName:"New Playlist",
      playlistTracks:[
    ]
    };

    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  addTrack(newSong){
    let tracksInPlaylist=this.state.playlistTracks;
    if(tracksInPlaylist.find(track=>
      track.id===newSong.id)){return;}

      tracksInPlaylist.push(newSong);
      this.setState({
        playlistTracks:tracksInPlaylist
      })
  }

  removeTrack(track){
    let currentPlayListTracks=this.state.playlistTracks;
    let updatedPlaylist=currentPlayListTracks.filter(trackName=>
      trackName.id!==track.id
    );

    this.setState({
      playlistTracks:updatedPlaylist
    });
  }

  updatePlaylistName(newName){
    if(newName!==this.state.playlistName){
      this.setState({
        playlistName:newName
      });
    }
  }

  savePlaylist(){
    const trackURIs=this.state.playlistTracks.map(track=>{
      return track.uri});
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.setState({
        playlistName:'New playlist',
        playlistTracks:[]
      });
  }

  search(item){
    Spotify.search(item).then(tracks=>{
      this.setState({searchResults:tracks});
    });
  }

  render() {
    return (<div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        < SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} 
          addSong={this.addTrack} 
          />
          <Playlist name={this.state.playlistName} 
          playlistTracks={this.state.playlistTracks}
          removeTrack={this.removeTrack}
          updatePlaylistName={this.updatePlaylistName}
          savePlaylist={this.savePlaylist}/>
        </div>
      </div>
    </div>)
  }
}

export default App;
