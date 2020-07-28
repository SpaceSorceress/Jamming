const clientID = "073e5992c3ee4746945512175e90aa56";
//const redirectURi = "https://jamming_sir.surge.sh/";
const redirectURi = "http://localhost:3000/";
let accessToken;
let userID;
const spotifyLink = "https://api.spotify.com/v1/";

const Spotify = {
  getAccessToken() {
    //we first need to check if accessToken has already been received
    if (accessToken) {
      return accessToken;
    }
    //if accessToken variable is empty, we need to check the URL to see if it's there
    //we need to use match() method and regex in order to find out access token and expiration time
    //example of url https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
    //regex for access token /access_token=([^&]*)/
    //regex for expiration time: /expires_in=([^&]*)/
    // we are using Implicit Grant Flow: https://developer.spotify.com/documentation/general/guides/authorization-guide/
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    //use window.location.href to get the url

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      //Clear the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      //in case if url does not contain access token we redirect the user to thi page in order to ask him to log in
      //to redirect user use window.location
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private&redirect_uri=${redirectURi}`;
      document.getElementById("inputField").placeholder =
        "Enter A Song, Album, or Artist";
    }
  },

  //accepts a parameter for the user’s search term;returns a promise that will eventually resolve to the list of tracks from the search.
  search(searchItem) {
    const accessToken = this.getAccessToken();
    const searchPath = `${spotifyLink}search?type=track&q=${searchItem}`;
    const browserHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return fetch(searchPath, browserHeader)
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }

        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  async getCurrentUserId() {
    if (userID) {
      return userID;
    }
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    //GET current user’s ID
    return await fetch(`${spotifyLink}me`, { headers: headers })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        userID = jsonResponse.id;
      });
  },

  async savePlaylist(newPlaylistName, arrayOfURis, playlistID) {
    if (!newPlaylistName || !arrayOfURis) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const userID = await this.getCurrentUserId();
    let status;
    let statusOK;
    if (!playlistID) {
      let newPlaylistID;

      //POST a new playlist with the input name to the current user’s Spotify account. Receive the playlist ID back from the request.
      return fetch(`${spotifyLink}users/${userID}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({
          name: newPlaylistName,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((jsonResponse) => {
          newPlaylistID = jsonResponse.id;
          //POST the track URIs to the newly-created playlist, referencing the current user’s account (ID) and the new playlist (ID)
          return fetch(`${spotifyLink}playlists/${newPlaylistID}/tracks`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
              uris: arrayOfURis,
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((jsonResponse) => {
              newPlaylistID = jsonResponse.snapshot_id;
            });
        });
    } else {
      return fetch(`${spotifyLink}playlists/${playlistID}/tracks`, {
        headers: headers,
        method: "PUT",
        body: JSON.stringify({
          uris: arrayOfURis,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((jsonResponse) => {
          status = jsonResponse;
          //change PlaylistName
          return fetch(`${spotifyLink}playlists/${playlistID}`, {
            headers: headers,
            method: "PUT",
            body: JSON.stringify({
              name: newPlaylistName,
            }),
          }).then((response) => {
            //console.log(response);
          });
        });
    }
  },

  async getUserPlaylists() {
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const userID = await this.getCurrentUserId(); //GET current user’s ID
    //Get a list of the playlists owned or followed by a Spotify user.

    return fetch(`${spotifyLink}users/${userID}/playlists`, {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (jsonResponse.items) {
          console.log(jsonResponse.items);
          return jsonResponse.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
          }));
        } else {
          return [];
        }
      });
  },

  getTracksFromUserPlaylist(playlistID) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return fetch(`${spotifyLink}playlists/${playlistID}/tracks`, {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        return jsonResponse.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          //album:
          uri: item.track.uri,
        }));
      });
  },

  unfollowPlaylist(id){
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    fetch(`${spotifyLink}playlists/${id}/followers`, {
        headers: headers,
        method: "DELETE"});

  }
};

export default Spotify;
