import React from 'react';
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import Axios from 'axios';

class PositivityHandler
    extends React.Component {
    
    handleNewPositivity = (event) => {
        const keys = Object.keys(event)
        console.log(event.user_id);
        console.log(event.confirmation_date);
        for(const k of keys) {
            console.error(`${k}=${event[k]}`);
        }

    }
    
    render() {
        
        return (
            <form 
                id="InputFields" 
                onSubmit={this.handleNewPositivity}>
                <input id="user_id" type="Date"></input>
                <input id="confirmation_date" type=""></input>
                <button type="submit" value="submit"></button>
            </form>
        );
    }

}

export default withRouter(withLanguage(PositivityHandler));
