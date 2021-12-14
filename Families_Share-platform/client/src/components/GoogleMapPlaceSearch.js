import React from "react";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import useOnclickOutside from "react-cool-onclickoutside";

import "@reach/combobox/styles.css";

const libraries = ["places"];

function GoogleMapPlaceSearch({ callback,inputClassName,placeholder,location }){

  // const {isLoaded,loadError} = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries,
  // });

  function getCurrentPosition(){
    let {lat,lng} = 0;
    navigator.geolocation.getCurrentPosition(pos => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    },()=> null);
    return {lat,lng}
  }

  let {lat,lng} = getCurrentPosition();

  const {
    ready,
    value,
    suggestions:{status,data},
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions:{
      location:{  lat:()=>lat, lng: () => lng},
      radius:500*1000
    },
    defaultValue: location
  });



  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const place_id = results[0].place_id;

      const locationData = {
        target:{
          value: address,
          latlng:{ lat, lng },
          place_id: place_id,
          name: "location"
        }
      };
      callback(locationData);
    } catch (error) {
      console.log("Error: ", error);
    }
  };


  const renderSuggestions = () =>
    // data.map((suggestion) => {
    //   const {
    //     place_id,
    //     structured_formatting: { main_text, secondary_text },
    //   } = suggestion;

      data.map(({ place_id, description }) => {
        console.log({ place_id, description })
        // return(<ComboboxOption key={place_id} value={description} />)
      // })

      return (
        <li key={place_id} onClick={()=>handleSelect(description)}>
          {/* <strong>{main_text}</strong> <small>{secondary_text}</small> */}
          <strong>{description}</strong>
        </li>
      );
    });

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });
  return (
    // <div className="">
    //   <Combobox onSelect={handleSelect}>
    //     <ComboboxInput
    //       value={value}
    //       onChange={handleInput}
    //       disabled={!ready}
    //       placeholder={placeholder}
    //       className = {inputClassName}
    //       selectOnClick
    //       required
    //     />
    //     <ComboboxPopover>
    //       <ComboboxList>
    //         {status === "OK" &&
    //           data.map(({ id, description }) => {
    //             console.log({ id, description })
    //             return(<ComboboxOption key={id} value={description} />)
    //           })
    //         }
    //       </ComboboxList>
    //     </ComboboxPopover>
    //   </Combobox>
    // </div>
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        className = {inputClassName}
        required
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
}

export default GoogleMapPlaceSearch;
