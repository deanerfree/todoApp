import { useEffect, useState } from "react"
import axios from "axios"
import { Formik } from "formik"

const TodoContent = () => {
	const [currentListItems, setCurrentListItems] = useState([])
	const [status, setStatus] = useState()
	const currentDate = new Date()
	const options = [{ status: "In Process" }, { status: "Completed" }]

	const getCurrentList = async () => {
		const theData = await axios.get("/v1/api/todoList")
		try {
			if (theData.status === 200) {
				setCurrentListItems(theData.data)
			}
		} catch (error) {
			console.error({ message: `This is the Error`, error })
		}
		setCurrentListItems(theData.data)
	}

	useEffect(() => {
		getCurrentList()
	}, [])
	console.log(currentListItems)

	return (
		<div>
			<h2>Todo Content</h2>
			<div>
				<Formik
					initialValues={{ title: "", description: "", date: "" }}
					onSubmit={(values, { setSubmitting }) => {
						axios.post("/v1/api/createItem", values)
						values.date = currentDate
						getCurrentList()
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2))
							setSubmitting(false)
						}, 400)
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
							<input
								type='title'
								name='title'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.title}
							/>
							{errors.title && touched.title && errors.title}
							<h2>Description</h2>
							<input
								type='description'
								name='description'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.description}
							/>

							<button type='submit' disabled={isSubmitting}>
								Submit
							</button>
						</form>
					)}
				</Formik>
			</div>
			<div>
				{currentListItems.length > 0 ? (
					<div>
						{currentListItems?.map((item, index) => {
							return (
								<ul key={index}>
									<li>{item.title}</li>
								</ul>
							)
						})}
					</div>
				) : (
					<p>There's nothing to display</p>
				)}
			</div>
		</div>
	)
}

export default TodoContent
