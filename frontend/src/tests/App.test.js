import { render, screen } from "@testing-library/react"
import App from "../App"
import TodoContent from "../components/TodoContent"
import TodoList from "../components/TodoList"
import SelectTodoItem from "../components/SelectTodoItem"

const removeItem = () => {
	console.log("removeItem")
}
const getCurrentList = () => {
	console.log("getCurrentList")
}
const testList = [
	{
		id: 0,
		dateCreated: "2021-10-10T20:01:40.994Z",
		dateUpdated: "2021-10-10T20:01:40.994Z",
		dateFinshed: "2021-10-10T20:01:40.994Z",
		status: "Completed",
		task: "Write Test",
		timeOnTask: { time: 20, message: "20 seconds" },
		description: `Purée de charrue de tabarnane d'étole de saintes fesses de mosus de colon de verrat de cul de câline.
Verrat de cimonaque de mautadine de charrue de christie de cibole d'enfant d'chienne de bâtard de mangeux d'marde d'étole.`,
	},
	{
		id: 1,
		dateCreated: "2021-11-10T20:01:40.994Z",
		dateUpdated: "2021-12-10T20:01:40.994Z",
		dateFinshed: "2021-13-10T20:01:40.994Z",
		status: "Completed",
		task: "Write Test list 2",
		timeOnTask: { time: 20, message: "20 seconds" },
		description: `Purée de charrue de tabarnane d'étole de saintes fesses de mosus de colon de verrat de cul de câline.
Verrat de cimonaque de mautadine de charrue de christie de cibole d'enfant d'chienne de bâtard de mangeux d'marde d'étole.`,
	},
]
test("Should Render the App", () => {
	render(<App />)
	const linkElement = screen.getByText(/Things To Get Done:/i)
	expect(linkElement).toBeInTheDocument()
})

test("Should read the placeholder value of Task input field", () => {
	render(<App />)
	const inputTask = screen.getByPlaceholderText(/Enter a Task/i)
	expect(inputTask.textContent).toBe("")
})

test("Should read the placeholder value of Description input field", () => {
	render(<App />)
	const inputDescription = screen.getByPlaceholderText(/Enter a Description/i)
	expect(inputDescription).toBeInTheDocument()
})

test("Should render an empty list", () => {
	render(<App />)
	const emptyList = screen.getByText(/There's no content loaded/i)
	expect(emptyList).toBeInTheDocument()
})
