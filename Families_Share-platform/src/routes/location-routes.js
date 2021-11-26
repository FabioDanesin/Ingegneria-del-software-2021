const express = require("express")
const router = new express.Router()
const Location = require("../models/location");
const User = require('../models/user')

function print(s, tag) {
    let r = String(s) + "\n";
    if(tag!=null)
        r = new String(tag) + r;
    process.stdout.write(r);
}

router.get("/" ,
    async (req, res, next) => {
        try {
            const { user_id } = req.body;
            const user = await Location.findOne({ user_id:user_id }); 
            if(!user) {
                res.status(404).send(`User ${user_id} does not exist`);
            }
            
            const lat = user.latitude;
            const lng = user.longitude
        
            await res.json(
                {
                    latitude: lat,
                    longitude: lng
                }
            );
        } catch (err) {
            next();
        } 
    }
);

router.post("/",
    async (req, res, next) => {
        try {
            const {
                user_id , latitude , longitude
            } = req.body;

            const user = await User.findOne( {user_id:user_id} );
            if(!user){
                res.status(404).send(`User id ${user_id} does not exist`);
            }

            const userlocation_registered = await Location.findOne( {user_id:user_id} );

            if(!userlocation_registered){
                await Location.create ({
                    user_id : user_id,
                    latitude : latitude, 
                    longitude : longitude
                })
                
            } else {
                await Location.updateOne (
                    {user_id : user_id},
                    {
                        latitude : latitude,
                        longitude : longitude
                    }
                )
            }
            res.status(200).send("Location updated");
        } catch (err) {
            next();
        }
    }
);

module.exports = router;