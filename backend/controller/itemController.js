let itemList = []

// @desc    Get all Todo Items: GET
// @route   http://localhost:5000/v1/api/todoList
// @access  Public
const getAllItems = async (req, res) => {
	try {
		await res.send(itemList)
	} catch (error) {
		console.error(`This is the Error: ${error}`)
	}
}

// @desc    Get specific Todo Item: GET
// @route   http://localhost:5000/v1/api/todoList/:id
// @access  Public
const getItem = async (req, res) => {
	try {
		const id = req.params.id
		await res.send(itemList[id])
	} catch (error) {
		console.error(`This is the Error: ${error}`)
	}
}

// @desc    Create a todo Item: Post
// @route   http://localhost:5000/v1/api/createItem
// @access  Public
const createItem = async (req, res) => {
	try {
		const createItem = await req.body
		itemList.push(createItem)
		res.send({ message: "Item added to the list", itemList })
	} catch (error) {
		console.error(`This is the Error: ${error}`)
	}
}

// @desc    Edit a todo Item: Patch
// @route   http://localhost:5000/v1/api/editItem/:id
// @access  Public
const editItem = async (req, res) => {
	try {
		const id = req.params.id
		const update = req.body
		itemList[id] = update
		res.send({ message: "Item updated", itemList })
	} catch (error) {
		console.error(`This is the error: ${error}`)
	}
}

// @desc    Delete Specific Item: Delete
// @route   http://localhost:5000/v1/api/removeItem/:id
// @access  Public
const deleteItem = async (req, res) => {
	try {
		const id = req.params.id
		itemList.splice(id, 1)
		res.send({ message: "Item removed", itemList })
	} catch (error) {
		console.error(`This is the error: ${error}`)
	}
}

module.exports = { getAllItems, getItem, createItem, editItem, deleteItem }
