const router = require("express").Router()
const {
	getAllItems,
	getItem,
	createItem,
	editItem,
	deleteItem,
} = require("../controller/itemController")

router.route("/todoList").get(getAllItems)
router.route("/todoList/:id").get(getItem)
router.route("/createItem").post(createItem)
router.route("/editItem/:id").patch(editItem)
router.route("/removeItem/:id").delete(deleteItem)

module.exports = router
