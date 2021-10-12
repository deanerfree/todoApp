const express = require("express")
const app = express()
const PORT = process.env.PORT || 5001
app.use(express.json())

//middleware
const router = require("./routes/routes")

app.get("/greeting", (req, res) => {
	res.send("Greetings")
})

app.use("/v1/api", router)

app.listen(PORT, () => console.log(`You are connected to ${PORT}`))
