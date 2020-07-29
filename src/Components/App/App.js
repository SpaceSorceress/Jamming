import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import PlaylistList from "../PlaylistList/PlaylistList";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      localPlaylists: [],
      playlistID: null,
      loggedIn: false,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.showLocalPlaylists = this.showLocalPlaylists.bind(this);
    this.showTracksFromLocalPlaylist = this.showTracksFromLocalPlaylist.bind(
      this
    );
    this.showPlaylistName = this.showPlaylistName.bind(this);
    this.unfollowPlaylist = this.unfollowPlaylist.bind(this);
  }

  async search(item) {
    await Spotify.search(item).then((tracks) => {
      this.setState({ searchResults: tracks, loggedIn: true });
    });
    await this.showLocalPlaylists();
  }

  addTrack(newSong) {
    let tracksInPlaylist = this.state.playlistTracks;
    if (tracksInPlaylist.find((track) => track.id === newSong.id)) {
      return;
    }

    tracksInPlaylist.push(newSong);
    this.setState({
      playlistTracks: tracksInPlaylist,
    });
  }
  //remove track from playlist
  removeTrack(track) {
    let currentPlayListTracks = this.state.playlistTracks;
    //we create an array of tracks, and when - is clicked, we filter out the element to delete
    let updatedPlaylist = currentPlayListTracks.filter(
      (trackName) => trackName.id !== track.id
    );
    //once the array is updated, we set the state to equal this array
    this.setState({
      playlistTracks: updatedPlaylist,
    });
  }
  //with this method you can change a playlist name
  updatePlaylistName(newName) {
    if (newName !== this.state.playlistName) {
      this.setState({
        playlistName: newName,
      });
    }
  }
  // this method allows user to save a new playlist / or to save the edited playlist
  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => {
      return track.uri;
    });
    await Spotify.savePlaylist(
      this.state.playlistName,
      trackURIs,
      this.state.playlistID
    );
    this.setState({
      playlistName: "New playlist",
      playlistTracks: [],
      playlistID: null,
    });
    this.showLocalPlaylists();
  }

  // this method is responsible for uploading the list of local playlists when the user logged in
  async showLocalPlaylists() {
    await Spotify.getUserPlaylists().then((playlists) => {
      this.setState({
        localPlaylists: playlists,
      });
    });
  }
  //once local playlist name is clicked, this method upload list of tracks and enables editing
  showTracksFromLocalPlaylist(playlistID) {
    Spotify.getTracksFromUserPlaylist(playlistID).then((tracks) => {
      this.setState({
        playlistTracks: tracks,
        playlistID: playlistID,
      });
    });
  }

  //when local playlist is clicked, this method places it's name on top of the playlist
  showPlaylistName(newName) {
    this.setState({
      playlistName: newName,
    });
  }

  async unfollowPlaylist(id) {
    await Spotify.unfollowPlaylist(id);
    this.showLocalPlaylists();
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
            loggedIn={this.state.loggedIn}
            placeholderFalse="Please log in to spotify first"
            placeholderTrue="Enter A Song, Album, or Artist"
          />
          {this.state.loggedIn && (
            <div className="App-playlist">
              <SearchResults
                searchResults={this.state.searchResults}
                addSong={this.addTrack}
              />
              <div className="Playlists">
                <Playlist
                  name={this.state.playlistName}
                  playlistTracks={this.state.playlistTracks}
                  removeTrack={this.removeTrack}
                  updatePlaylistName={this.updatePlaylistName}
                  savePlaylist={this.savePlaylist}
                />
                {this.state.loggedIn && (
                  <PlaylistList
                    playlists={this.state.localPlaylists}
                    showTracks={this.showTracksFromLocalPlaylist}
                    showPlaylistName={this.showPlaylistName}
                    updateScreen={this.showLocalPlaylists}
                    unfollowPlaylist={this.unfollowPlaylist}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <footer>
          <h3>Siriakivska Iuliia | 2020</h3> <br />
          <span>
            This project was inspired and created as part of education at
            &copy;Codecademy
          </span>
        </footer>
      </div>
    );
  }
}

export default App;
