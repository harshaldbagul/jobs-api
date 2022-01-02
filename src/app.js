
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const auth = require('./middleware/auth');
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/',(req,res)=>res.send('jobs-api'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, jobsRouter);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log('Server started on port', PORT));
    } catch (err) {
        console.log('Server failed to start', err);
    }
};

start();