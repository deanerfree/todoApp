import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Formik } from "formik"
import TodoItem from "./TodoItem"
import { Button, TextField, Card, Modal } from "@mui/material"
import { Close } from "@mui/icons-material"
import LoadingContent from "./LoadingContent"
import SelectTodoItem from "./SelectTodoItem"

const TodoContent = () => {
	const [currentListItems, setCurrentListItems] = useState([])
	const [open, setOpen] = useState(false)
	const currentDate = new Date()
	const options = [
		{ status: "Not Started" },
		{ status: "In Process" },
		{ status: "Completed" },
	]

	const initialValues = {
		id: 0,
		status: null,
		task: "",
		description: "",
		dateCreated: currentDate,
		dateUpdated: currentDate,
		dateFinished: null,
	}

	const toggleModal = () => {
		setOpen(!open)
	}

	const getCurrentList = async () => {
		const theData = await axios.get(`/v1/api/todoList`)
		try {
			if (theData.status === 200) {
				const list = theData.data
				setCurrentListItems(list)
			}
		} catch (error) {
			console.error({ message: `This is the Error`, error })
		}
	}

	// const taskCompleted = (listItem) => {
	// 	if (listItem === "Completed") {
	// 		let value = listItem.dateFinished - listItem.dateUpdated
	// 		return value
	// 	}
	// 	if (listItem !== "Completed") {
	// 		return
	// 	}
	// }

	const removeItem = (id) => {
		axios.delete(`/v1/api/removeItem/${id}`)
		getCurrentList()
	}

	useEffect(() => {
		getCurrentList()
	}, [])
	console.log(currentListItems)

	return (
		<div>
			<h2>Todo Content</h2>
			<Card className='formWrapper'>
				<Formik
					initialValues={initialValues}
					onSubmit={(values, { setSubmitting, resetForm }) => {
						values.id = currentListItems.length
						values.status = options[0].status
						axios.post("/v1/api/createItem", values)
						getCurrentList()
						setSubmitting(false)
						resetForm(initialValues)
					}}>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						/* and other goodies */
					}) => (
						<form className='form' onSubmit={handleSubmit}>
							<div className='formInputs'>
								<h2>Task</h2>
								<TextField
									type='task'
									fullWidth
									name='task'
									placeholder='Enter a Task'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.task}
								/>
								{errors.task && touched.task && errors.task}
								<h2>Description</h2>
								<TextField
									variant='outlined'
									placeholder='Enter a description'
									id='outlined-multiline-static'
									label='Description'
									fullWidth
									multiline
									rows={4}
									type='description'
									name='description'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.description}
									style={{ height: 100, marginBottom: "35px" }}
								/>
							</div>
							<div className='formSubmit'>
								<Button
									variant='outlined'
									type='submit'
									disabled={isSubmitting}>
									Submit
								</Button>
							</div>
						</form>
					)}
				</Formik>
			</Card>
			<Card className='taskList'>
				{currentListItems.length > 0 ? (
					<div className='itemWrapper'>
						{currentListItems?.map((item, index) => {
							return (
								<Card className='item' key={index}>
									<div className='itemTask'>
										<h2>Task: {item.task}</h2>
										<Button
											className='closeButton'
											onClick={() => removeItem(index)}>
											<Close color='primary' />
										</Button>
									</div>
									<div onClick={toggleModal}>
										<TodoItem props={item} />
										<Modal
											open={open}
											onClose={toggleModal}
											aria-labelledby='parent-modal-title'
											aria-describedby='parent-modal-description'>
											<Card>
												<SelectTodoItem index={index} />
											</Card>
										</Modal>
									</div>
								</Card>
							)
						})}
					</div>
				) : (
					<LoadingContent />
				)}
			</Card>
		</div>
	)
}

export default TodoContent
