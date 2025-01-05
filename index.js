const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const router = require('./routes/index');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

sequelize.authenticate().then(()=>{
    console.log('Connection to Supabase PostgreSQL Database successful!');
}).catch((err)=>{
    console.log('Unable to connect to Supabase PostgreSQL:', err);
    process.exit(1);
})

// routing middleware
app.use(router);

app.listen(PORT, (req, res)=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})