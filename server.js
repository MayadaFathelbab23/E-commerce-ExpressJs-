const path = require('path')
const cors = require('cors')
const compression = require('compression')

const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan')
const dbConnect = require('./config/dbConnection')
// Routes
const mountRoutes = require('./Routes')
const {checkoutWebhook} = require('./Services/orderService')
// Error Handeling
const ApiError = require('./utils/apiError');
const ErrorHandel = require('./middleware/ErrorMiddleware')

dotenv.config({path : 'config.env'});
// Database connection
dbConnect();
// Create server
const app = express();

app.use(cors());
app.options('*', cors())

// compress all responses
app.use(compression())
app.use(express.json()); // json parsing

// checkout webhook
app.post('/checkout-complete' , express.raw({type: 'application/json'}) , checkoutWebhook)
// Middleware
if(process.env.NODE_ENV === 'development'){ //logger
    app.use(morgan('dev'));
}

// serve static files
app.use(express.static(path.join(__dirname , "uploads")))
//  Mount Routes
mountRoutes(app);
// route validation middleware
app.all("*" ,( req , res , next)=>{
    next(new ApiError(`Can not fin this route ${req.originalUrl}` , 400))
})
//  Error handling middleware
app.use(ErrorHandel)

// port listening
const {PORT} = process.env;
const server = app.listen(PORT , ()=>{
    console.log(`app is listing on port ${PORT}`)
})

// Handle errors outside express (Unhandeled Rejection (promise)) Like database
// Event => Listen => calback()

process.on("unhandledRejection" , (err)=>{
    console.error(`Unhandeled rejoection Error : ${err.name} | ${err.message}`);
    server.close(()=>{
        console.error(`App server is closed.....`)
        process.exit(1)
    })
})