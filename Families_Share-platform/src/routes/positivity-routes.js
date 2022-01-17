const express = require('express')
const config = require('config')
const router = new express.Router()

const Users = require("../models/user")
const Positivity = require("../models/positivity")

function userexists(user_id) {
	return Users.findOne(user_id) != null;
}
/**
 * URL = /getpositive
 * PAYLOAD =
 * 	{
 * 		user_id
 * 	}
 * URL "privato"
 */
router.post("/getpositive",
	(req, res, next) => {
		try{
			const {
				user_id
			} = req.body;
			const response = Positivity.findOne(user_id);
			console.log("RESPONSE="+String(response));

			if(response) {
				return res.json(
					{
						user_id : response.user_id,
						confirmation_date : response.confirmation_date
					}
				);
			} else {
				return res.status(404).send("No positive user matching this UID")
			}

		} catch (err) {
			console.error("Error in URL /getpositive")
			console.error(err);
			next(err);
		}
	}
)
/**
 * URL = "/addnewpositive"
 * PAYLOAD =
 * 	{
 * 		user_id,
 * 		confirmation_date
 * 	}
 */
router.post("/addnewpositive",
	async(req, res, next)=> {
		const datasplitter = (datetime) => {
			let y, m, d
			const split = String(datetime).split(["-"])
			y = split[0]
			m = split[1]
			d = split[2]

			return {
				"year":y,
				"month":m,
				"day":d
			}
		}

		try{
			const {
				user_id,
				confirmation_date
			} = req.body;

			const existence_condition = await userexists(user_id);

			if(!existence_condition){
				console.error("No user matching UID=" + user_id);
				return res.status(404).send("No user matching this UID");
			}

			const newdata = {
				user_id:user_id,
				confirmation_date:confirmation_date
			}

			await Positivity.create(newdata)

			return res.status(200).send("Added positivity")
		} catch (err) {
			console.error("Error in URN /addnewpositive");
			console.error(err)
			next(err)
		}
	}
)


/**
 * URL = /deletepositive
 * PAYLOAD =
 * 	{
 * 		user_id
 * 	}
 */
router.delete("/deletepositive",
    async (req, res, next) => {
        try{
			const {user_id} = req.body
			console.log("Begin deletion");
			const existence_condition = await userexists(user_id);
			if(existence_condition) {
				await Positivity.deleteOne({user_id});
				return res.status(200).send("Positivity deleted")
			}else {
				return res.status(404).send("No data to delete matching the user id " + user_id + " was found")
			}

        } catch (err) {
			console.error("Error in URL /deletepositive")
            console.error(err);
            next(err);
        }
    }
)

/**
 * URL= /updatepositive
 * PAYLOAD =
 * 	{
 * 		user_id,
 * 		confirmation_date
 * 	}
 */
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
				return res.status(200).send("Data updated successfully")
			} else {
				return res.status(404).send("Error. No user found for the requested user id")
			}
		} catch (err) {
			console.error("Error in url /updatepositive")
            console.error(err);
            next(err);
        }
    }
)

module.exports = router;
