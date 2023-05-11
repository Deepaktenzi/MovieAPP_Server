const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongodb = require('mongoose');
app.use(
  cors({
    origin: 'https://movieapptask.vercel.app/',
    optionsSuccessStatus: 200,
  })
);
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json({ limit: '1000mb' }));

app.use(cookieParser());
app.use('/api/', adminRoutes);

mongodb
  .connect(
    `mongodb+srv://deepaktenzi:${process.env.MONGODB_PASS}@cluster0.btvwmbl.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.log(err));
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Server Is Running...');
});
