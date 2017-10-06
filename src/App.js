import React, { Component } from 'react';
import './App.css';
import {FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			query : '',
			artist: null,
			tracks: [],
		}
	}
	search(){
		const BASE_URL ='https://api.spotify.com/v1/search?';
		let FETCH_URL = BASE_URL + 'q=' + this.state.query
							+ '&type=artist&limit=1';
		const ALBUM_URL = 'https://api.spotify.com/v1/artists/'
		const accessToken = 'BQCpRByL6O-iTHELTmrTKWRghzM259etlu9iMFvX8YwATnaSQlvLdYcntsWUZqruHb5ToRerlIWTBIN1uaptpGa9qtEehAsI5wsG78gW70ER37aNrzotK2MDBg_6XCa3Y5zQVTlmyHHBfFBlcQYF5o_13jAWZ4AxpPu4';
		const myHeaders = new Headers();
		const myOptions = {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			mode: 'cors',
			cache: 'default',
			Accept: 'application/json',
		};
		fetch(FETCH_URL, myOptions)
			.then(response => response.json())
			.then(json => {
				const artist = json.artists.items[0];
				this.setState({artist});
				FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=PH`;

				fetch(FETCH_URL, myOptions)
					.then(response => response.json())
					.then(json => {
						console.log('artist tracks', json);
						const { tracks } = json;
						this.setState({tracks});
					});
			});
		
	}
	render(){
		return(
			<div className="App">
				<FormGroup className="searchBar">
					<InputGroup>
						<FormControl
							type="text"
							placeholder="Search for an Artist"
							value = {this.state.query}
							onChange = {event=> this.setState({query: event.target.value})}
							onKeyPress = {event => {
								if (event.key==='Enter') {
									this.search()
								}
							}}
						/>
						<InputGroup.Addon onClick = {()=>this.search()}>
							<Glyphicon 
								glyph="search"
							></Glyphicon>
						</InputGroup.Addon>
					</InputGroup>
				</FormGroup>
					{
						this.state.artist !==null ?
							<div className="contentGrid">
								<Profile 
									artist={this.state.artist}
								/>
								<Gallery 
									tracks={this.state.tracks}
								/>
							</div>
						:
							<div></div>
					}
			</div>
		)
	}
}

export default App;