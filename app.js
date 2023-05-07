const express = require('express')
const app = express();
const port = 3000;
const sequelize = require('./config/database');

sequelize.sync().then(() => console.log("DB is ready"));

//Middleware
app.use(express.json());
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*'); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization,OPTIONS');
  next();
})

app.get('/', (req, res) => {
    res.send("Welcome to Perez Parking App API");
})

app.listen(port, () => {
  console.log(`Perez Parking App API listening on port ${port}`)
})

//Routes
app.use('/api/park', require('./routes/api/park'));
app.use('/api/unpark', require('./routes/api/unpark'));
app.use('/api/spaces', require('./routes/api/spaces'));
app.use('/api/gates', require('./routes/api/gates'));
app.use('/api/gate-space-info', require('./routes/api/gate-space-info'));
app.use('/api/rates', require('./routes/api/rates'));
