import { useState } from "react"
import "../App.css"
import axios from "axios"
import { Card } from "@mui/material"

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
