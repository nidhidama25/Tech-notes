const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieparser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/',require('./routes/root'))
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "connect-src 'self' http://localhost:3500");
    next();
});
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views','404.html'))
    } else if (req.accepts('json')) {
        res.json({message:'404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))