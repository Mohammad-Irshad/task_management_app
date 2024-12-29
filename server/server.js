const {app} = require('./index')

const PORT = process.env.PORT

app.listen(PORT , () => {
    console.log(`Server is running on PORT : ${PORT}`)
})