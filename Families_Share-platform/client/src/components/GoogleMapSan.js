import React from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";


import mapStyles from "../styles/mapStyles";

const mapContainerStyle = {
  width:"90vw",
  height:"50vw"
};


const options = {
  styles: mapStyles,
  disableDefaultUI:true
};

function GoogleMapSan({ lat, lng, location}){
  const [marker] = React.useState({ lat, lng });
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

          {/*
           href="javascript:;" è per evitare che la pagina venga aggiornata
           Al cliccare del marker, si potrà visualizzare l'indirizzo scelto per l'attività e un link:
           se cliccato, verrà aperta una nuova pagina con l'indirizzo su google maps.
          */}
          <div>
            <h2>{location}</h2>
            <a href="javascript:;" onClick={() => window.open("https://maps.google.com?q="+ selected.lat + "," + selected.lng )}>
              Visualizza su Google Maps</a>
          </div>

        </InfoWindow>
      ) : null}

    </GoogleMap>
  )

}

export default GoogleMapSan;
