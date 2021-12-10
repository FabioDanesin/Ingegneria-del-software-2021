import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import Log from "./Log";

const GroupCovid = props => {
  const { history, group } = props;
  const handleGoBack = () => {
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };

  const [covidData, setCovidData] = useState();

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/pcm-dpc/COVID-19/contents/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json`)
      .then(response => {
        const base64 = response.data.content
        setCovidData(JSON.parse(atob(base64))[0])
      })
      .catch(error => {
        setCovidData("error")
        Log.error(error);
      });
  }, [])
  console.log(covidData)

  return (
    <React.Fragment>
      <BackNavigation title={group.name} fixed onClick={() => handleGoBack()} />
      {covidData === undefined && <LoadingSpinner /> }
      {typeof covidData === "object" && <div id="covidContainer">
      Nuovi positivi nelle ultime 24 ore: {covidData.nuovi_positivi}
      </div>}
    </React.Fragment>
  );
};

export default GroupCovid;

GroupCovid.propTypes = {
  group: PropTypes.object,
  history: PropTypes.object
};
