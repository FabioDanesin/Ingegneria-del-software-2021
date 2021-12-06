const express = require('express')
const config = require('config')
const router = new express.Router()

const Users = require("../models/user")
const Positivity = require("../models/positivity")

router.post("/addnewpositive", 
    async(req, res, next)=> {
       try{ 
            const {
                user_id, 
                confirmation_date
            } = req.body;
            
            const existence_condition = await Users.findOne(user_id)
            
            if(existence_condition){
                res.status(404).send("No user matching this UID");
            } 
            
            const newdata = {
                user_id:user_id, 
                confirmation_date:confirmation_date
            }
            
            await Positivity.create(newdata)

            res.status(200).send("Added positivity")
        } catch (err) {
            console.error(err)
            next(err)
        }
    }
)

router.post("/getpositive", 
    async(req, res, next) => {
        try{
            const {
                user_id
            } = req.body;
            
            const existence_condition = await Users.findOne(user_id)
            if(existence_condition){
                res.status(404).send("No user matching this UID");
            } else {
                const response = await Positivity.findOne(user_id);
                if(response) {
                    res.json(
                        {
                            user_id : response.user_id,
                            confirmation_date : response.confirmation_date
                        }
                    );
                } else {
                    res.status(404).send("No positive user matching this UID")
                }
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
)

module.exports = router;