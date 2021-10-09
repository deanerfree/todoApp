import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Field, Formik } from "formik"
import { Button, Card, Typography } from "@mui/material"
import LoadingContent from "./LoadingContent"
import DisplayTodoContent from "./DisplayTodoContent"
import { Edit, Close } from "@mui/icons-material"

const SelectTodoItem = ({ itemId, removeItem, getCurrentList }) => {
	const [createDate, setCreateDate] = useState()
	const [task, setTask] = useState()
	const [description, setDescription] = useState()
	const [status, setStatus] = useState()
	const [createTask, setCreateTask] = useState(false)
	const [editDescription, setEditDescription] = useState(false)
	const [editStatus, setEditStatus] = useState(false)

	const actionType = ["Task", "Description", "Status"]

	const currentDate = new Date()

	const initialValues = {
		status: "",
		task: "",
		description: "",
	}

	const changeTask = () => {
		setCreateTask(!createTask)
	}
	const changeDescription = () => {
		setEditDescription(!editDescription)
	}
	const changeEditStatus = () => {
		setEditStatus(!editStatus)
	}

	const getItems = async (id) => {
		let results = await axios.get(`/v1/api/todoList/${id}`)
		let returnedResults = results.data
		console.log(results.data)
		setCreateDate(returnedResults.dateCreated)
		setTask(returnedResults.task)
		setDescription(returnedResults.description)
		setStatus(returnedResults.status)
	}

	const patchValues = (id, values) => {
		axios
			.patch(`/v1/api/editItem/${id}`, values)
			.then((res) => res.data)
			.then(getCurrentList())
	}

	useEffect(() => {
		try {
			getItems(itemId)
		} catch (error) {
			console.error(error)
		}
	}, [])

	return (
		<Card>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { setSubmitting, resetForm }) => {
					values.id = itemId
					values.dateUpdated = currentDate
					values.dateCreated = createDate
					console.log(values)
					patchValues(itemId, values)
					setSubmitting(false)
					resetForm(initialValues)
					changeTask()
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
				}) =>
					task || description || status ? (
						<div>
							{createTask ? (
								<form onSubmit={handleSubmit}>
									<div>
										<div className='form' onSubmit={handleSubmit}>
											<Typography>Task: {task}</Typography>
											<Field
												type='task'
												name='task'
												placeholder={task}
												value={values.task}
												onChange={handleChange}
											/>
											<Typography>Description: {description}</Typography>
											<Field
												type='description'
												name='description'
												placeholder={description}
												value={values.description}
												onChange={handleChange}
											/>
											<Typography>Status: {status}</Typography>
											<Field
												type='status'
												name='status'
												placeholder={status}
												value={values.status}
												onChange={handleChange}
											/>
										</div>
										<Button
											variant='outlined'
											type='submit'
											disabled={isSubmitting}>
											Submit
										</Button>
									</div>
								</form>
							) : (
								<Card>
									<div className='editField'>
										<Typography>Todo Item {itemId + 1}</Typography>
										<div className='editIcons'>
											<div className='editIcon' onClick={changeTask}>
												<Edit />
											</div>
											<div className='editIcon' onClick={removeItem}>
												<Close />
											</div>
										</div>
									</div>
									<div className='form'>
										<DisplayTodoContent
											type={actionType[0]}
											item={task}
											editItem={changeTask}
										/>
										<DisplayTodoContent
											type={actionType[1]}
											item={description}
											editItem={changeDescription}
										/>
										<DisplayTodoContent
											type={actionType[2]}
											item={status}
											editItem={changeEditStatus}
										/>
									</div>
								</Card>
							)}
						</div>
					) : (
						<LoadingContent />
					)
				}
			</Formik>
		</Card>
	)
}

export default SelectTodoItem
