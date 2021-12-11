const express = require('express')
const config = require('config')
const router = new express.Router()

const Users = require("../models/user")
const Positivity = require("../models/positivity")

function userexists(user_id) {
    return Users.findOne(user_id) != null;
}

router.post("/addnewpositive", 
	async(req, res, next)=> {
		try{ 
			const {
				user_id, 
				confirmation_date
			} = req.body;
			
			const existence_condition = await userexists(user_id);
			
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
			console.error("Error in URN /addnewpositive");
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
            
            const existence_condition = await userexists(user_id);

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
			console.error("Error in URL /getpositive")
            console.error(err);
            next(err);
        }
    }
)

router.delete("/deletepositive", 
    async (req, res, next) => { 
        try{
			const {user_id} = req.body

			const existence_condition = await userexists(user_id);
			if(existence_condition) {
				Positivity.deleteOne({user_id});
				res.status(200).send("Positivity deleted")
			}else {
				res.status(404).send("No data do delete matching the user id " + user_id + " was found")
			}
        } catch (err) {
			console.error("Error in URL /deletepositive")
            console.error(err);
            next(err);
        }
    }
)

router.patch("/updatepositive", 
    async (req, res, next) => { 
		try{
			const {user_id, confirmation_date} = req.body
			
			const existence_condition = userexists(user_id);
			if(existence_condition){
				const setparameter = {
					user_id
				};

				const updateform = {
					confirmation_date
				};

				await Positivity.updateOne(setparameter, updateform);
				res.status(200).send("Data updated successfully")
			} else {
				res.status(404).send("Error. No user found for the requested user id")
			}
		} catch (err) {
			console.error("Error in url /updatepositive")
            console.error(err);
            next(err);
        }
    }
)

module.exports = router;