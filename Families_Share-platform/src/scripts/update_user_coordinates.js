require('dotenv').config();

let dbHost = require('config').get('dbConfig.host');

const mongoose = require('mongoose');
const url = process.env[dbHost];

mongoose.connect(
    url, 
    (Err)=>{
        console.error(`Connection error at url ${url}`);
        console.error(Err);
    }
);

const db = mongoose.connection.db


/**
 * Wrapper per la funzione di Update.
 * 
 * @param {string} name Nome della tabella target.
 * @param {dictionary} filter Condizioni dei dati target validi. Può essere lasciato vuoto.
 * @param {dictionary} query Valori che vogliono essere aggiornati.
 */
function set(name, filter, query) { 

    try {
        db.collection(name).updateOne(filter , { $set : query})
        .then(
            (__onfulfilled)=> {
                console.log(`${name} hit`);
            },
            (__onfailure)=> {
                throw new Error(`${name} not found in database`);
            }
        );
    } catch (error) {
        console.error(error);
    }

}
/**
 * Funzione wrapper per la Select. 
 * 
 * @param {String} name Nome dello schema richiesto.
 * @param {Dictionary} query Dati che si vogliono selezionare. Può essere vuoto.
 * @param {Error * Result -> Void} opt_array_callback Callback da inserire in una funzione toArray. Opzionale
 */
function get(name, query, opt_array_callback) {
    let res = undefined;
    let callback = (err, select_result)=> {
        if(err) {
            throw err;
        } else {
            res = select_result;
        }
    }
    try{
        db.collection(name).find(name , function(err, collection) {
            if(err){
                console.error(err);
            } else {
                collection.find(query).toArray(callback);
            }
        });
    } catch (error) {
        console.error(error);
    }

    return res;
}
//wrapper per update delle coordinate del singolo user nel database
function update_user_coordinates(ext_user_id , ext_latitude, ext_longitude) { 
    set('User', {user_id:ext_user_id}, {latitude: ext_latitude , longitude:ext_longitude});
}

module.exports = { update_user_coordinates }