import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Formik } from "formik"
import TodoItem from "./TodoItem"
import { Button, TextField, Card } from "@mui/material"
import { Close } from "@mui/icons-material"

const TodoContent = () => {
	const [currentListItems, setCurrentListItems] = useState([])
	const [status, setStatus] = useState()
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
	}
	const getCurrentList = async () => {
		const theData = await axios.get("/v1/api/todoList")
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
			<Card className='form'>
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
						<form onSubmit={handleSubmit}>
							<h2>Title</h2>
							<TextField
								type='task'
								name='task'
								placeholder='Enter a title'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.task}
							/>
							{errors.task && touched.task && errors.task}
							<h2>Description</h2>
							<TextField
								type='description'
								name='description'
								placeholder='Enter a description'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.description}
							/>

							<Button variant='outlined' type='submit' disabled={isSubmitting}>
								Submit
							</Button>
						</form>
					)}
				</Formik>
			</Card>
			<div>
				{currentListItems.length > 0 ? (
					<Card className='taskList'>
						{currentListItems?.map((item, index) => {
							return (
								<div key={index}>
									<TodoItem props={item} />
									<Button onClick={() => removeItem(index)}>
										<Close color='primary' />
									</Button>
								</div>
							)
						})}
					</Card>
				) : (
					<Card>There's nothing to display</Card>
				)}
			</div>
		</div>
	)
}

export default TodoContent
