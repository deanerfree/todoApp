import { render, screen } from "@testing-library/react"
import App from "../App"
import TodoContent from "../components/TodoContent"

test("Should Render the App", () => {
	render(<App />)
	const linkElement = screen.getByText(/Todo Content/i)
	expect(linkElement).toBeInTheDocument()
})

// test("Should read the placeholder value of Task input field", () => {
// 	render(<TodoContent />)
// 	const inputTask = screen.getByPlaceholderText(/Enter a Task/i)
// 	expect(inputTask.textContent).toBe("")
// })

test("Should read the placeholder value of Description input field", async () => {
	render(<TodoContent />)
	const inputDescription = screen.getByPlaceholderText(/Enter a Description/i)
	await expect(inputDescription).toBeInTheDocument()
})
