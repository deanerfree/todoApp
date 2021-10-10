import "../App.css"

import SelectTodoItem from "./SelectTodoItem"

const TodoList = ({ removeItem, currentListItems, getCurrentList }) => {
	return (
		<div className='itemWrapper'>
			{currentListItems?.map((item, index) => {
				return (
					<div className='item' key={index}>
						<div>
							<SelectTodoItem
								itemId={item.id}
								getCurrentList={getCurrentList}
								removeItem={removeItem}
							/>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default TodoList
