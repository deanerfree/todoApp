import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Formik } from "formik"
import { Button, TextField, Card } from "@mui/material"
import LoadingContent from "./LoadingContent"
import TodoList from "./TodoList"

const TodoContent = () => {
	const [currentListItems, setCurrentListItems] = useState([])

	const currentDate = new Date()

	const options = [
		{ status: "Not Started" },
		{ status: "In Process" },
		{ status: "Completed" },
	]

	const initialValues = {
		id: null,
		status: null,
		task: "",
		description: "",
		dateCreated: 0,
		dateUpdated: 0,
		dateFinished: null,
		timeOnTask: 0,
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

	const removeItem = (id) => {
		axios.delete(`/v1/api/removeItem/${id}`).then((res) => res.data)
		getCurrentList()
	}

	useEffect(() => {
		getCurrentList()
	}, [])
	console.log(currentListItems)

	return (
		<div className='wrapper'>
			<div className='title'>
				<h2>Things To Get Done:</h2>
			</div>
			<Card className='formWrapper'>
				<Formik
					initialValues={initialValues}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						values.id = currentListItems.length
						values.status = options[0].status
						values.timeOnTask = 0
						values.dateCreated = currentDate
						values.dateUpdated = currentDate
						values.dateFinished = 0
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
								{errors.task && touched.task}
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
					<TodoList
						getCurrentList={getCurrentList}
						currentListItems={currentListItems}
						removeItem={removeItem}
					/>
				) : (
					<LoadingContent />
				)}
			</Card>
		</div>
	)
}

export default TodoContent
