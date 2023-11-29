const express = require('express')
const pg = require('pg')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const db = require('./login1')
const db5=require('./truck')
const db6=require('./post')
const upload = multer({ dest: 'uploads/' });
const db4=require('./Agent')
const fs = require('fs')
const port = 9000
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true, 
    })
) 

  app.set('maxHeaderSize', 655369); 
  async function getItems() {
    const pool = mysql.createPool({
      host: 'localhost',
    port: 5432,
    database: 'login',
    user: 'postgres',
    password: 'Abhi@2001',
    });
  
    const query = 'SELECT * FROM main'; // Change 'main' to your actual table name
  
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
  
      // Remember to release the pool when you're done with it
      pool.end();
    });
  }
    const allowedOrigins = ['https://trucksbooking.in/' ,'http://localhost:3000']; // Add the origins you want to allow

    // Configure the CORS middleware with the allowed origins
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    }));
    
      
       
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored.
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
      });
      
      app.get("/readfile", async (req, res) => {
        try {
            const data = await fs.promises.readFile('path/to/your/file.txt', 'utf-8');
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error reading the file');
        }
    });
app.get("/",cors(),async (req,res)=>{
    const data = await getitems()
    console.log("all the details");
     res.send(data)

})
app.get("/api/:option", (req, res) => {
  const option = req.params.option;
  const { from, to } = req.query;

  let query = "";

  if (option === "searchByDateForm") {
    query = `
      SELECT * FROM post
      WHERE from >= $1 AND to <= $2
    `;
  }
  
  const values = [from, to];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

const getPost=(request,response)=>{
    pool.query('select * from post ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
}
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });  
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define a route to get an image by filename
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Serve the image
  res.sendFile(filePath);
});

app.get('/users', db.getUsers)
app.get('/agentusers', db.getAgentUsers)

app.post('/market',db.createAgent)

app.post('/auth',db.authenticateUser)
app.post('/authAgent',db.authenticateAgent)

app.get('/users/:id', db.getUserById)  
app.post('/users/', db.createUser)
app.put('/users/:id', db.updateUser)   
app.delete('/users/:id', db.deleteUser)  
app.get('/AgentInfo', db4.getAgentInfo)
app.get('/AgentInfo1', db4.getAgentInfo1)
app.get('/AgentFetch', db4.getAgent)

app.post('/Agentauth', db4.authenticateUser)
app.get('/Trucks', db4.getTrucks)
app.get('/Info', db4.getInfo)
app.get('/sublocations', db5.getSubLocations)
app.post('/addsublocations', db5.createSublocations)
app.get('/sub', db5.getSub)

app.delete('/deletesublocations', db5.deleteSubLocations)
app.get('./sublocations/:id',db5.getSubLocationsById)
app.get('/agentType', db4.getAgentType)
app.put('/updateagent', db4.getAgentUpdate)
app.put('/booking/:id/updatePaymentStatus', db5.getPaymentUpdate)
app.get('/table1', db4.getTable1) 
app.get('/table2', db4.getTable2)
app.get('/table3', db4.getTable3)

app.get('/Agent', db4.getOwner)
app.get('/Agent/:id', db4.getOwnerById)
app.post('/Agent/',upload.fields([
  { name: 'uploadAadhar', maxCount: 1 },
  { name: 'uploadPan', maxCount: 1 }]),
  db4.createOwner) 

app.put('/Agent/:id', db4.updateOwner) 
app.delete('/Agent/:id', db4.deleteOwner)
app.get('/PostDate', db6.getPostDate)
app.get('/PostTruck', db6.getPostTruck)
app.get('/location', db6.getLocation)
app.get('/Bookings', db4.getBookDate)
app.get('/PostingStatus', db6.getPostStatus)

app.get('/Post', db6.getPost)
app.get('/Post/:id', db6.getPostById)
app.get('/Posting/:id', db6.getPostByTruck)

app.post('/Post/', db6.createPost) 
app.post('/Post1/', db6.createPost1) 

app.put('/Post/:id', db6.updatePost) 
app.delete('/Post/:id', db6.deletePost)
app.delete('/Post1/:id', db6.deletePost1)

app.get('/TruckPost/:truckNumber',db6.setPost)
app.get('/checkTruckStatus', db5.getTruckStatus)

app.get('/truckNumber', db5.getTruckNumber)
app.get('/truckNumber2', db5.getTruckNumber2)
app.get('/truckNumber1', db5.getTruckNumber1) 

app.put('/UpdateTruckStatus', db5.updatetruckStatus) 
app.post('/driver', upload.single('driverPhoto'), db5.createDriver)
app.get('/fetchdriver', db5.getDriver)
app.get('/verified', db5.getVerified)
app.get('/tbr', db5.getTbr)

app.get('/book', db5.getBook) 
app.get('/book/:id', db5.getBookById)
app.post('/book', db5.createBook)
app.delete('/deltruck/:truckNumber', db5.delTruck)
app.get('/booking/:crn', db5.getBooking)
app.get('/booking1', db5.getBooking1)
app.put('/truckUpdate/:id', db5.updateTruckStatus)
app.put('/loadingstatus/:id', db5.updateLoadingStatus)
app.put('/unloadingstatus/:id', db5.updateunloadingStatus)
app.put('/updatebookingstatus', db5.updateDriverStatus)
app.put('/updatedriverstatus/:id', db5.updateDriverStatus1)
app.post('/addnewrecord', db5.createDriving)

app.put('/booking/:id', db4.deleteBooking)
app.use('/uploads', express.static('uploads'));
app.get('/truck', db5.getTruck)
app.get('/truckverify', db5.getTruckverification)

app.get('/truck/:id', db5.getTruckById)
app.post('/Owner', upload.fields([
  { name: 'uploadAadhar', maxCount: 1 },
  { name: 'uploadPan', maxCount: 1 }
]),db.createOwner1);
app.post('/truck', upload.fields([
  { name: 'uploadRegistration', maxCount: 1 },
  { name: 'truckFrontSideWithNumberPlate', maxCount: 1 },
  { name: 'truckBackSideWithNumberPlate', maxCount: 1 },
  { name: 'rightside', maxCount: 1 },
  { name: 'leftside', maxCount: 1 },

  { name: 'truckCabin', maxCount: 1 },
  { name: 'truckOdometer', maxCount: 1 },
  { name: 'truckVideo', maxCount: 1 },
  { name: 'truckPermit', maxCount: 1 },   
  { name: 'truckFit', maxCount: 1 },
  { name: 'truckPollutionCertificate', maxCount: 1 },
  { name: 'truckInsuranceCertificate', maxCount: 1 },
  { name: 'truckOwnerPassportSizePhoto', maxCount: 1 },
  // Add more fields as needed
]), db5.createTruck);
app.put('/truck/:id', db5.updateTruck) 
app.delete('/truck/:id', db5.deleteTruck) 

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})   

module.exports= app;