import React from 'react';
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import Axios from 'axios';

const baseurl = "/api/positivity/" // URL base a cui tutte le richieste sono dirette.

const addpositive = "newpositive";
const addnegative = "newnegative";

class PositivityHandler
    extends React.Component {
    
    user_id = localStorage.getItem("user");
    event = "positive";  //Valore di default.
    date = null;

    constructor(props) {
        super(props);

        // Necessario per ottenere la data
        this.state={
            datebox : "",
            signaltype : ""
        };

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
                
                return Axios
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
        const targeturl = baseurl + "addnewpositive";
        const patchurl = baseurl + "updatepositive";

        //è identico per entrambi in ogni caso
        const formdata = {
            user_id: this.user_id,
            confirmation_date: date
        }

        console.log("POSITIVITY");
        try{
            if(this.doesUserExist(this.user_id)){
                Axios.patch(patchurl, formdata)
            } else {
                Axios.post(targeturl, formdata)
                    //DEBUG ONLY
                .then(
                    (onfulfilled)=>{
                        console.log("Success");
                        console.log(onfulfilled);
                    },
                    (rejected)=>{
                        console.log("Failure");
                        console.error(rejected);
                    }
                ).catch(
                    (rejected) => {
                        console.log("Rejection");
                        console.warn(rejected);
                    }
                );
            }
            
        } catch (anyerror) {
            console.error("Error in function handlePositivity : " + anyerror.toString());
        }
    } 

    handleNegativity() {
        console.log("NEGATIVITY");
        const targeturl = baseurl + "deletepositive";
        const payload = {
            data:{
                user_id : this.user_id
            }
        }
        try{
            if(this.doesUserExist(this.user_id)){
                Axios.delete(targeturl, payload);
            }
            //Non serve aggiungere un else. Semplicemente non fa nulla.
        } catch (anyerror) {
            console.error("Error in function handleNegativity : " + anyerror.toString())
        }
    }


    render() {
        return (
            <form id="InputFields">

                <select 
                    placeholder="Seleziona segnalazione"
                    onChange={(e)=>{
                        const v = e.target.value
                        console.log("Event changed");
                        this.event = v;
                        console.log(this.event);;
                    }}
                    >
                    <option value="positive">Segnala positività</option>
                    <option value="negative">Segnala negatività</option> 
                </select>

                <input 
                    id="confirmation_date" 
                    type="Date"
                    onChange={
                        (e) =>{
                            console.log("Date changed");
                            this.date = e.target.value;
                            console.log(this.date);
                        }
                    }
                    >
                </input>

                <button type="submit" onClick={
                    () => {
                        try {
                            console.log("Starting")
                            const event = this.event;
                            const date = this.date;
                            switch(event) {
                                case "positive": 
                                    this.handlePositivity(date);
                                    break;
                                case "negative":

                                    this.handleNegativity();
                                    break;
                                
                                default:
                                    throw new Error(`Case ${event} not defined`);
                            }
                        }catch (error) {
                            console.error(error);
                        } 
                    }
                }>Segnala!</button>  
            </form>
        );
    }

}

export default withRouter(withLanguage(PositivityHandler));
