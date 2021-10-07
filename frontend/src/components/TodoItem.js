const TodoItem = ({ props }) => {
	return (
		<div className='itemDescription'>
			<div id='description'>
				<p>Description: {props.description}</p>
			</div>
			<div id='created'>
				<p>Created on: {props.dateCreated}</p>
			</div>
		</div>
	)
}

export default TodoItem
