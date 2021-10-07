import { Card, CardContent } from "@mui/material"

const LoadingContent = () => {
	return (
		<Card style={{ height: "200px" }}>
			<CardContent
				style={{
					margin: "30px",
					display: "flex",
					justifyContent: "center",
					alignContent: "center",
				}}>
				There's no content loaded
			</CardContent>
		</Card>
	)
}

export default LoadingContent
