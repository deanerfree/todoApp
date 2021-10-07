import { useEffect, useState } from "react"
import "../App.css"
import axios from "axios"
import { Formik } from "formik"
import { Button, TextField, Card, CardContent, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import LoadingContent from "./LoadingContent"

const SelectTodoItem = ({ index }) => {
	console.log(index)
	const [data, setData] = useState()
	const getItem = async (id) => {
		let results = await axios.get(`/v1/api/todoList/${id}`)
		console.log(results)
		setData(results.data)
	}
	useEffect(() => {
		try {
			getItem(index)
		} catch (error) {
			console.error(error)
		}
	}, [index])

	return (
		<Card>
			{data ? (
				<CardContent>
					<Typography>{data.status}</Typography>{" "}
				</CardContent>
			) : (
				<LoadingContent />
			)}
		</Card>
	)
}

export default SelectTodoItem
