import { Typography } from "@mui/material"

const DisplayTodoContent = ({ type, item }) => {
	return (
		<div className='editField'>
			<Typography>
				{type}: {item}
			</Typography>
		</div>
	)
}

export default DisplayTodoContent
