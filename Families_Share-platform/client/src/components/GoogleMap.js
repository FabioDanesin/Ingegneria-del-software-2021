//note: code formatted for ES6 here
import React from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},

      mapCenter:{
        lat:0,
        lng:0

      }
    };

    this.containerStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%'
    };

    this.style = {
      width: '50%',
      height: '50%'
    };

    this.currentPosition = {
      latitude:0,
      longitude:0
    };

    let {lat, lon} = 0;
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    });

    this.state.mapCenter.lat = lat;
    this.state.mapCenter.lng = lon;
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  componentDidMount(){

  }

  render() {
    return (
      <Map google={this.props.google}
           onClick={this.onMapClicked}
           containerStyle={this.containerStyle}
           style={this.style}
           initialCenter={{
             lat: this.state.mapCenter.lat,
             lng: this.state.mapCenter.lng
           }}>
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />


      </Map>
    )
  }
}



export default GoogleApiWrapper({
  apiKey: ("AIzaSyDxm7sQvAnAa1DDKsWBZ8u8LLQd1GlZdHo")
})(GoogleMap)
