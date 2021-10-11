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
	CardContent,
} from "@mui/material"
import { Edit, Close } from "@mui/icons-material"

import LoadingContent from "./LoadingContent"
import DisplayTodoContent from "./DisplayTodoContent"
import moment from "moment"

const SelectTodoItem = ({ itemId, removeItem, getCurrentList }) => {
	const options = [
		{ value: "Planned" },
		{ value: "In Process" },
		{ value: "Completed" },
	]
	const currentDate = new Date()
	const [estimatedTime, setEstimatedTime] = useState()
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
		time: null,
	}

	const handleUpdateDate = () => {
		setUpdatedDate(currentDate)
	}

	const handleFinishedDate = () => {
		setFinishedDate(currentDate)
	}

	const handleRadioChange = (e) => {
		setStatus(e.target.value)
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

	const taskCompleted = (status, dtSt, dtFn, tmtsk) => {
		if (status !== "Completed") return tmtsk
		let value = { time: 0, message: "" }
		let diff = moment(dtFn, "DD/MM/YYYY HH:mm:ss").diff(
			moment(dtSt, "DD/MM/YYYY HH:mm:ss")
		)
		let diffToSec = diff / 1000
		value.time = diffToSec

		console.log(diffToSec)
		if (status === "Completed") {
			if (tmtsk.time > 0) {
				value.time = diffToSec + tmtsk.time
				diffToSec = value.time
			}

			if (diffToSec < 60) {
				value.message = `${Math.floor(diffToSec)} seconds`
			}
			if (diffToSec >= 60) {
				value.message = `${diffToSec / 60} minutes`
			}
			if (diffToSec >= 3600) {
				value.message = `${diffToSec / 3600} hours`
			}
			if (diffToSec >= 86400) {
				value.message = `${diffToSec / 86400} days`
			}
		}

		return value
	}

	const getItems = async (id) => {
		try {
			let results = await axios.get(`/v1/api/todoList/${id}`)
			let returnedResults = results.data
			console.log("returned Results", returnedResults)
			setCreateDate(returnedResults.dateCreated)
			// setUpdatedDate(returnedResults.dateUpdated)
			setTask(returnedResults.task)
			setDescription(returnedResults.description)
			setStatus(returnedResults.status)
			setTimeOnTask(returnedResults.timeOnTask)
			setEstimatedTime(returnedResults.time)
		} catch (error) {
			console.error(error)
		}
	}

	const patchValues = (id, values) => {
		try {
			axios.patch(`/v1/api/editItem/${id}`, values).then((res) => res.data)
		} catch (error) {}
	}

	useEffect(() => {
		getItems(itemId)

		// eslint-disable-next-line
	}, [])

	// status, dtSt, dtFn

	return (
		<Card
			style={{
				backgroundColor: "#aae0f9",
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
					values.dateUpdated = updatedDate
					values.dateCreated = createDate
					values.time = estimatedTime
					values.dateFinished = finishedDate
					values.timeOnTask = taskCompleted(
						status,
						updatedDate,
						finishedDate,
						timeOnTask
					)
					console.log("submitvalues:", values)
					patchValues(itemId, values)
					setSubmitting(false)
					resetForm(initialValues)
					changeTask()
					getCurrentList()
					getItems(itemId)
				}}>
				{({
					values,
					handleChange,
					handleSubmit,
					isSubmitting,
					resetForm,
					/* and other goodies */
				}) =>
					task || description || status ? (
						<div>
							{createTask ? (
								<form onSubmit={handleSubmit}>
									<Card className='form' onSubmit={handleSubmit}>
										<CardContent>
											<Typography>Task: {task}</Typography>
											<Field
												type='task'
												name='task'
												placeholder={task}
												value={values.task}
												onChange={handleChange}
											/>
											<Typography>Estimated Time: {estimatedTime}</Typography>
											<Field
												type='number'
												name='time'
												placeholder={estimatedTime}
												value={values.estimatedTime}
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
													row
													aria-label='Task Status'
													defaultValue='Not Started'
													name='radio-buttons-group'
													value={status}
													onChange={handleRadioChange}>
													<FormControlLabel
														value={options[0].value}
														control={<Radio />}
														label='Planned'
													/>
													<FormControlLabel
														value={options[1].value}
														control={<Radio />}
														label='In Process'
														onClick={() => {
															handleUpdateDate()
														}}
													/>
													<FormControlLabel
														value={options[2].value}
														control={<Radio />}
														label='Complete'
														onClick={() => {
															handleFinishedDate()
														}}
													/>
												</RadioGroup>
											</FormControl>
										</CardContent>
										<div className='buttonWrapper'>
											<div className='buttonItems'>
												<Button
													style={{ backgroundColor: "#1976d1", color: "white" }}
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
													type='reset'
													onClick={() => {
														changeTask()
														resetForm()
													}}>
													Cancel
												</Button>
											</div>
										</div>
									</Card>
								</form>
							) : (
								<Card
									style={{
										backgroundColor: "#c8eeff",
									}}>
									<div className='editField'>
										<div className='editIconTitle'>
											<Typography
												variant='h1'
												style={{ fontSize: "20px", fontWeight: "500" }}>
												{task}
											</Typography>
										</div>
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
										<div className='displayItemStatus'>
											<div className='displayItem'>
												<div>
													<DisplayTodoContent
														type={actionType[2]}
														item={status}
														editItem={changeEditStatus}
													/>
													{timeOnTask ? (
														<div className='editField'>
															{timeOnTask.message}
														</div>
													) : null}
												</div>
											</div>
										</div>
										<DisplayTodoContent
											type={actionType[1]}
											item={description}
											editItem={changeDescription}
										/>

										<div id='created'>Date Created: {createDate}</div>
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
