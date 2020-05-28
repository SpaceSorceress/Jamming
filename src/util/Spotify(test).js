const clientID = "073e5992c3ee4746945512175e90aa56";
const redirectURi = "https://jamming_sir.surge.sh/";
//const redirectURi = "http://localhost:3000/";
//browser header will be used by all 3 requests
let accessToken;
let userID;

const Spotify = {

    getAccessToken() {
        //we first need to check if accessToken has already been received
        if (accessToken) {
            return accessToken;
        };
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
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            //in case if url does not contain access token we redirect the user to the page in order to ask him to log in
            //to redirect user use window.location
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private&redirect_uri=${redirectURi}`;

        }
    },

    //accepts a parameter for the user’s search term;returns a promise that will eventually resolve to the list of tracks from the search.
    search(searchItem) {

        const accessToken = Spotify.getAccessToken();
        let path = `https://api.spotify.com/v1/search?type=track&q=${searchItem}`;
        const browserHeader = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        return fetch(path, browserHeader)
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                };

                return jsonResponse.tracks.items.map(track => ({

                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri

                }));

            });

    },

    /*getCurrentUserId() {
        if(userID){return userID};
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
            //GET current user’s ID
            return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
                .then(response => {
                    return response.json();
                })
                .then(jsonResponse => {
                userID = jsonResponse.id;
                   return userID;
                }); 
    
    },*/

    savePlaylist(newPlaylistName, arrayOfURis, playlistID) {
        if (!newPlaylistName || !arrayOfURis) { return; }

        //const userID = Spotify.getCurrentUserId();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let status;
        let statusOK;
        if (!playlistID) {
            let newPlaylistID;
            //GET current user’s ID
            return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
                .then(response => {
                    return response.json();
                })
                .then(jsonResponse => {
                    userID = jsonResponse.id;
                    //POST a new playlist with the input name to the current user’s Spotify account. Receive the playlist ID back from the request.
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({
                                "name": newPlaylistName
                            })
                        })
                        .then(response => {
                            return response.json();
                        })
                        .then(jsonResponse => {
                            newPlaylistID = jsonResponse.id;
                            //POST the track URIs to the newly-created playlist, referencing the current user’s account (ID) and the new playlist (ID)
                            return fetch(`https://api.spotify.com/v1/playlists/${newPlaylistID}/tracks`,
                                {
                                    headers: headers,
                                    method: 'POST',
                                    body: JSON.stringify({
                                        "uris": arrayOfURis
                                    })

                                }).then(response => { return response.json() })
                                .then(jsonResponse => {
                                    newPlaylistID = jsonResponse.snapshot_id;
                                })
                        })
                });
        } else {
            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
                {
                    headers: headers,
                    method: 'PUT',
                    body: JSON.stringify({
                        "uris": arrayOfURis
                    })
                })

                .then(response => { return response.json() })
                .then(jsonResponse => {
                    status = jsonResponse;

                    //change PlaylistName
                    return fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
                        headers: headers,
                        method: 'PUT',
                        body: JSON.stringify({
                            "name": newPlaylistName
                        })
                    }).then(response => { console.log(response) });

                })
        }
    },


    getUserPlaylists() {
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        //const userID = Spotify.getCurrentUserId();
        //GET current user’s ID
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                userID = jsonResponse.id;
                //Get a list of the playlists owned or followed by a Spotify user.*/
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                    {
                        headers: headers,
                    })
                    .then(response => {
                        return response.json();
                    })
                    .then(jsonResponse => {
                        if (!jsonResponse.items) { return [] };
                        return jsonResponse.items.map(playlist => ({

                            id: playlist.id,
                            name: playlist.name

                        }));
                    })
            });
    },

    getTracksFromUserPlaylist(playlistID) {
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                return jsonResponse.items.map(item => ({
                    id: item.track.id,
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    //album: 
                    uri: item.track.uri
                }))
            });
    }
}


export default Spotify;