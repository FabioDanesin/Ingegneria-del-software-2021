import React from 'react';
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import axios from "axios";
import Log from "./Log";
import BackNavigation from "./BackNavigation";

const baseurl = "/api/positivity/" // URL base a cui tutte le richieste sono dirette.



const updateDeviceToken = (userId, deviceToken) => {
    return axios
      .post(`/api/users/${userId}/deviceToken`, {
          deviceToken
      })
      .then()
      .catch(error => {
          Log.error(error);
      });
};

const getMyGroups = userId => {
    return axios
      .get(`/api/users/${userId}/groups`)
      .then(response => {
          return response.data;
      })
      .catch(error => {
          Log.error(error);
          return [];
      });
};

class PositivityHandler
    extends React.Component {

    //user_id = JSON.parse(localStorage.getItem("user"))["id"];
    //.event = "positive";  //Valore di default.
    //date = null;

    constructor(props) {
        super(props);
        this.state = {
            userId : JSON.parse(localStorage.getItem("user"))["id"],
            fetchedUserInfo: false,
            myGroups: [],
            positivityDate : null,
            positivityValue : "positivo"  //Valore di default
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }



    async componentDidMount() {
        const deviceToken = localStorage.getItem("deviceToken");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        if (deviceToken !== undefined && deviceToken !== "undefined") {
            await updateDeviceToken(userId, deviceToken);
        }
        const myGroups = await getMyGroups(userId);
        // const myGroups = groups

        this.setState({
            fetchedUserInfo: true,
            myGroups
        });
    }


    /**
     * Controlla se lo userid passato è presente nel database.
     *
     * @param {userid} String Stringa user(contenuta nel database)
     * @returns True se lo userid passato è contenuto nella tabella Positive, false altrimenti
     */
    doesUserExist(userid) {
        const url = baseurl + "getpositive"
        const jsondata = {user_id : userid}

        try {
            try {

                return axios
                    .post(url, jsondata)
                    .then(

                        (__onsuccess)=>{
                            return true;
                        },

                        (__onfailure) => {
                            console.log("FAILURE"); //DEBUG ONLY
                            return false;
                        }
                    )
                    .catch(
                        (_onreject)=>{
                            console.log("REJECTED");
                            return false;
                        }
                    )

            } catch (err) {
                console.warn("ERROR caught {" + err + "}");
                return false;
            }
        } catch (rejectionerror) {
            console.error("Error on user existance condition check : " + rejectionerror.toString());
            return false;
        }
    }

    handlePositivity(date) {
        const posturl = baseurl + "addnewpositive";
        const patchurl = baseurl + "updatepositive";
        const geturl = baseurl + "getpositive";
        const formdata = { //è identico per entrambi in ogni caso
            user_id: this.state.userId,
            confirmation_date: date,
            result:this.state.positivityValue.toUpperCase()
        }
        axios
          .post(posturl, formdata)
          .catch((onrejection)=> {
              console.error(`Check on url ${posturl} failed due to ${onrejection}`);
            }
          )
    }

    handleNegativity() {
        console.log("NEGATIVITY");
        const targeturl = baseurl + "deletepositive";
        const payload = {
            data:{
                user_id : this.state.userId
            }
        };

        try{
            if(this.doesUserExist(this.state.userId)){
                axios.delete(targeturl, payload);
            }
            //Non serve aggiungere un else. Semplicemente non fa nulla.
        } catch (anyerror) {
            console.error("Error in function handleNegativity : " + anyerror.toString())
        }
    }


     async sendPositivityAnnouncements(userId,positivityValue,positivityDate,myGroups) {
        const bodyFormData = new FormData();
        bodyFormData.append("message",
          `Sono risultato: ${positivityValue.toUpperCase()} al test covid il giorno ${positivityDate}`);
        bodyFormData.append("user_id", userId);

        myGroups.forEach(group => {
          axios
            .post(`/api/groups/${group.group_id}/announcements`, bodyFormData)
            .then(response => {
              Log.info(response);
            })
            .catch(error => {
              Log.error(error);
            });

        });
       this.handlePositivity(positivityDate);
    }

  handleSubmit(event) {
    event.preventDefault();
    try {
      const { myGroups,positivityDate,positivityValue,userId } = this.state;
      this.sendPositivityAnnouncements(userId, positivityValue, positivityDate, myGroups)
        .then(r  => alert("La tua segnalazione è stata inviata nelle chat di tutti i tuoi gruppi."));
    }catch (error) {
      console.error(error);
    }
  }

    render() {
      const { fetchedUserInfo} = this.state;
      const { history } = this.props;
        return (
          <div>
            <BackNavigation
              title={"Segnala positività"}
              onClick={() => history.replace("/myfamiliesshare")}
            />
            {fetchedUserInfo &&<form id="InputFields" onSubmit={this.handleSubmit}>
                <div className="row no-gutters">
                    <div className = "col-2-10">
                    </div>
                    <div className = "col-6-10">

                      <select
                        className="editProfileInputField"
                        placeholder="Seleziona segnalazione"
                        value={this.state.positivityValue}
                        onChange={(e)=>{
                            this.setState({positivityValue:e.target.value});
                        }}>
                        <option value="positivo">Segnala positività</option>
                        <option value="negativo">Segnala negatività</option>
                      </select>

                      <input
                        className="editProfileInputField"
                        id="confirmation_date"
                        type="Date"
                        value={this.state.positivityDate}
                        onChange={
                            (e) =>{
                                this.setState({positivityDate:e.target.value});
                            }
                        }/>

                    </div>
                </div>
                <div className="myPromptActionsContainer">
                    <button className="myPromptAction" >Segnala!</button>
                </div>
            </form>}
          </div>
        );
    }

}

export default withRouter(withLanguage(PositivityHandler));
