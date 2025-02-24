const express = require('express');
const {connectDB} = require('./config/database');
const excelRoutes = require('./routes/excelRoutes');
require('dotenv').config();

const app = express();
app.use(express.json({limit: '100mb'}));

connectDB();

app.use('/files', excelRoutes);

app.get('/', (req, res) => {
    res.send('Home page')
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
