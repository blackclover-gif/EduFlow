
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const connectDB =
require('./config/db');

// ROUTES

const authRoutes =
require('./routes/authRoutes');

const videoRoutes =
require('./routes/videoRoutes');

const quizRoutes =
require('./routes/quizRoutes');

const scoreRoutes =
require('./routes/scoreRoutes');

const aiRoutes =
require('./routes/aiRoutes');

const app = express();

// CONNECT DATABASE

connectDB();

// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use(
'/uploads',
express.static('uploads')
);

const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api', attendanceRoutes);

// ROUTES

app.use(cors());
app.use('/api', authRoutes);

app.use('/api', videoRoutes);

app.use('/api', quizRoutes);

app.use('/api', scoreRoutes);

app.use('/api', aiRoutes);

// TEST ROUTE

app.get('/',(req,res)=>{

res.send('Server Running');

});

// PORT

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(
`Server running on port ${PORT}`
);

});

