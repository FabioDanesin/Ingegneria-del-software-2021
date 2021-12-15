import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { formatRelative } from "date-fns";

import mapStyles from "../styles/mapStyles";
import GoogleMapPlaceSearch from "./GoogleMapPlaceSearch";

const mapContainerStyle = {
  width:"90vw",
  height:"50vw"
};


const options = {
  styles: mapStyles,
  disableDefaultUI:true
};

function GoogleMapSan({ lat, lng }){
  //mettere qua i dati per posizionare il marker dove si vuole fare l'evento
  const [marker,setMarkers] = React.useState({ lat, lng });
  const [selected,setSelected] = React.useState(null);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map)=>{
    mapRef.current = map;
  },[]);

  return(
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={marker}
      options={options}
      //onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {
        <Marker
          position={marker}
          onClick={()=> {
            setSelected(marker);
          }}
        />
      }


      {selected ? (
        <InfoWindow
          position={{lat: selected.lat, lng: selected.lng}}
          onCloseClick={() => setSelected(null)}>
          <div>
            <h2>Spotted</h2>

          </div>
        </InfoWindow>
      ) : null}

    </GoogleMap>
  )

}

export default GoogleMapSan;
