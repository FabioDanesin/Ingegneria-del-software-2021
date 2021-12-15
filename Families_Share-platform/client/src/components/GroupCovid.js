import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import Log from "./Log";
import { Card, Grid } from "@material-ui/core";

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

  return (
    <React.Fragment>
      <BackNavigation title={group.name} fixed onClick={() => handleGoBack()} />
      {covidData === undefined && <LoadingSpinner /> }
      {typeof covidData === "object" && <div id="covidContainer">
        <Grid container direction= "column" alignItems="center">


          <BigNumber
            number={covidData.nuovi_positivi}
            label="Persone risultate positive nelle ultime 24 ore"
          />

          <BigNumber
            number={"+" + covidData.variazione_totale_positivi}
            label="Persone positive nelle ultime 24 ore"
          />

          <BigNumber
            number={covidData.totale_positivi}
            label="Persone attualmente positive"
          />

          <BigNumber
            number={covidData.terapia_intensiva}
            label="Persone attualmente in terapia intensiva"
          />

          <BigNumber
            number={calcDate(covidData)}
            label="Ultimo aggiornamento"
          />

        </Grid>
      </div>}
    </React.Fragment>
  );
};

export default GroupCovid;

GroupCovid.propTypes = {
  group: PropTypes.object,
  history: PropTypes.object
};


function BigNumber(props) {
  return (
    <Grid item xs={12} md={6} lg={4} style={ {
      paddingTop: 16,
      width: "100%"
    }}>
      <Card style={ {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 4,
        paddingBottom: 4
      }}>
        <p style={ {
          fontSize: 50,
          textAlign: "center",
          margin: 0
        }}>
          {props.number}
        </p>

        <p style={ {
          textAlign: "center"
        }}>
          {props.label}
        </p>
      </Card>
    </Grid>
  )
}

BigNumber.propTypes = {
  number: PropTypes.string,
  label: PropTypes.string
};


function calcDate(covidData) {
  const lastUpdate = new Date(covidData.data)
  const now = new Date()
  const diff = now - lastUpdate


  if(diff < 1000 * 60 * 60) {
    const minuti = diff / 1000 / 60
    return minuti.toFixed() + " minuti fa"
  }else{
    const ore = diff / 1000 / 60 / 60
    return ore.toFixed() + " ore fa"
  }
}
