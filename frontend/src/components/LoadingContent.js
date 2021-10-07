import { Card, CardContent } from "@mui/material"

const LoadingContent = () => {
	return (
		<Card style={{ height: "200px" }}>
			<CardContent
				style={{
					padding: "12%",
					display: "flex",
					justifyContent: "center",
				}}>
				There's no content loaded
			</CardContent>
		</Card>
	)
}

export default LoadingContent
