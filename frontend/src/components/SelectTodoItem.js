import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Field, Formik } from "formik"
import {
	Button,
	Card,
	Typography,
	Radio,
	RadioGroup,
	FormControl,
	FormControlLabel,
} from "@mui/material"
import { Edit, Close } from "@mui/icons-material"

import LoadingContent from "./LoadingContent"
import DisplayTodoContent from "./DisplayTodoContent"
import moment from "moment"

const options = [
	{ value: "Not Started" },
	{ value: "In Process" },
	{ value: "Completed" },
]
const currentDate = new Date()

const SelectTodoItem = ({ itemId, removeItem, getCurrentList }) => {
	const [createDate, setCreateDate] = useState()
	const [updatedDate, setUpdatedDate] = useState()
	const [finishedDate, setFinishedDate] = useState()
	const [task, setTask] = useState()
	const [description, setDescription] = useState()
	const [timeOnTask, setTimeOnTask] = useState()
	const [status, setStatus] = useState(options[0].value)
	const [createTask, setCreateTask] = useState(false)
	const [editDescription, setEditDescription] = useState(false)
	const [editStatus, setEditStatus] = useState(false)

	const actionType = ["Task", "Description", "Status"]

	const initialValues = {
		status: status,
		task: "",
		description: "",
	}

	const handleRadioChange = (event) => {
		setStatus(event.target.value)
		if (event.target.value === options[2].value) {
			setFinishedDate(currentDate)
		}
		if (event.target.value === options[1].value) {
			setUpdatedDate(currentDate)
		}
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

	const taskCompleted = (status, dtSt, dtFn) => {
		let value = 0
		if (status === "Completed") {
			let diff = moment(dtFn, "DD/MM/YYYY HH:mm:ss").diff(
				moment(dtSt, "DD/MM/YYYY HH:mm:ss")
			)
			if (diff < 60) {
				value = `${diff} seconds`
			}
			if (diff >= 60) {
				value = `${diff / 60} minutes`
			}
			if (diff >= 3600) {
				value = `${diff / 3600} hours`
			}
			if (diff >= 86400) {
				value = `${diff / 86400} days`
			}
		}
		console.log("Task completed Value:", value)
		return value
	}

	const getItems = async (id) => {
		let results = await axios.get(`/v1/api/todoList/${id}`)
		let returnedResults = results.data
		console.log(results.data)
		setCreateDate(returnedResults.dateCreated)
		setUpdatedDate(returnedResults.dateUpdated)
		setTask(returnedResults.task)
		setDescription(returnedResults.description)
		setStatus(returnedResults.status)
		setTimeOnTask(returnedResults.timeOnTask)

		console.log(typeof returnedResults.dateUpdated)
	}

	const patchValues = (id, values) => {
		axios.patch(`/v1/api/editItem/${id}`, values).then((res) => res.data)
	}

	useEffect(() => {
		try {
			getItems(itemId)
		} catch (error) {
			console.error(error)
		}
	}, [])

	// status, dtSt, dtFn

	return (
		<Card
			style={{
				backgroundColor: "#b3eaff",
			}}>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { setSubmitting, resetForm }) => {
					if (values.task === "") {
						values.task = task
					}
					if (values.description === "") {
						values.description = description
					}
					values.id = itemId
					values.status = status
					values.dateCreated = createDate
					values.dateUpdated = updatedDate
					values.dateFinished = finishedDate
					values.timeOnTask = taskCompleted(status, updatedDate, finishedDate)

					console.log("submitvalues:", values)
					patchValues(itemId, values)
					setSubmitting(false)
					resetForm(initialValues)
					changeTask()
					getCurrentList()
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

											<FormControl component='fieldset'>
												<RadioGroup
													aria-label='Task Status'
													defaultValue='Not Started'
													name='radio-buttons-group'
													value={status}
													onChange={handleRadioChange}>
													<FormControlLabel
														value={options[0].value}
														control={<Radio />}
														label='Not Started'
													/>
													<FormControlLabel
														value={options[1].value}
														control={<Radio />}
														label='In Process'
													/>
													<FormControlLabel
														value={options[2].value}
														control={<Radio />}
														label='Complete'
													/>
												</RadioGroup>
											</FormControl>
										</div>
										<div className='buttonWrapper'>
											<div className='buttonItems'>
												<Button
													variant='outlined'
													type='submit'
													disabled={isSubmitting}>
													Submit
												</Button>
											</div>
											<div className='buttonItems'>
												<Button
													style={{ backgroundColor: "red", color: "white" }}
													variant='outlined'
													type='cancel'
													onClick={changeTask}>
													Cancel
												</Button>
											</div>
										</div>
									</div>
								</form>
							) : (
								<Card
									style={{
										backgroundColor: "#b3eaff",
									}}>
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
									<Card className='form'>
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
									</Card>
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
