import React from 'react';
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import Axios from 'axios';

const baseurl = "/api/positivity/" // URL base a cui tutte le richieste sono dirette.


class PositivityHandler
    extends React.Component {
    
    user_id = JSON.parse(localStorage.getItem("user"))["id"];
    event = "positive";  //Valore di default.
    date = null;

    constructor(props) {
        super(props);
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
        const posturl = baseurl + "addnewpositive";
        const patchurl = baseurl + "updatepositive";
        const geturl = baseurl + "getpositive";
        const formdata = { //è identico per entrambi in ogni caso
            user_id: this.user_id,
            confirmation_date: date
        }

        Axios
            .post(
                geturl, 
                {user_id:this.user_id}
            )
            .then(
                async (_success)=>{
                    console.log("STATUS="+_success.status.toString());
                    console.log("Found");
                    try {
                        return await Axios
                            .patch(
                                patchurl,
                                formdata
                            );
                    } catch (onrejection) {
                        console.error(`Check on url ${patchurl} failed due to ${onrejection}`);
                    }
                },
                (_failure)=>{
                    console.log("Not found");
                    Axios
                        .post(
                            posturl,
                            formdata
                        )
                        .catch(
                            (onrejection)=> {
                                console.error(`Check on url ${posturl} failed due to ${onrejection}`);
                            }
                        )
                }
            )
            .catch(
                (rejection)=> {
                    console.error(`Check on url ${geturl} failed due to ${rejection}`);
                }
            );
    } 

    handleNegativity() {
        console.log("NEGATIVITY");
        const targeturl = baseurl + "deletepositive";
        const payload = {
            data:{
                user_id : this.user_id
            }
        };

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
                <div class="row no-gutters">
                    <div class = "col-2-10">  
                    </div>
                    <div class = "col-6-10">  
                    
                        
                        
                    
                    <select class="editProfileInputField" 
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
                    
                    
                    
                    <input class="editProfileInputField"
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
                    </div> 
                </div>
                <div class="myPromptActionsContainer">

                <button class="myPromptAction" type="submit" onClick={

                    () => {
                        try {
                            
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
                </div>
            </form>
        );
    }

}

export default withRouter(withLanguage(PositivityHandler));
