const TodoItem = ({ props }) => {
	return (
		<div>
			<h2>Task: {props.task}</h2>
			<p>Description: {props.description}</p>
			<p>Created on: {props.dateCreated}</p>
		</div>
	)
}

export default TodoItem
