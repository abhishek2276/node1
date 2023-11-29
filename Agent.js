const { response } = require('express')
const session = require('express-session');
const express = require('express')

const app = express();

// Initialize express-session to manage sessions
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// const Pool = require('pg').Pool
// const pool = new Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'login',
//     user: 'postgres',
//     password: 'Abhi@2001',
// })
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '68.178.149.116', 
  port:'3306',
  user: 'truckbooking',
  password: 'truckbooking',
  database: 'truckbooking',
  connectTimeout: 30000,
 
});                            
 
connection.connect((err,connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  } 

  console.log('Connected to MySQL as ID:', connection.threadId);

  // Release the connection when done

});  
connection.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  } else if (err.code === 'ECONNRESET') {
    console.error('Connection to database was reset.');
  } else { 
    console.error('Unexpected database error:', err.message);
  }
});
// Function to execute a query
function getItems() {
  const query = 'SELECT * FROM main'; // Change 'main' to your actual table name

  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

  
  // Middleware to ensure the user is authenticated and retrieve the CRN from the session
  app.use((req, res, next) => {
    if (req.session && req.session.crn) {
      res.locals.crn = req.session.crn; // Make CRN available to routes
    }
    next();
  });
  const authenticateUser = (request, response) => {
    const { agentId, password } = request.body;
  
    connection.query(
      'SELECT * FROM agent WHERE agentId = ? AND password = ?',
      [agentId, password],
      (error, results) => {
        if (error) {
          throw error; 
        }
  
        if (results.length === 0) {
          // Authentication failed
          response.status(401).json({ message: 'Please enter valid details and try again' });
        } else {
          // Authentication successful, return user data
          const user = results[0];
          response.status(200).json({ message: 'Authentication successful', user });
        }
      }
      );
    };

    const getInfo=(request,response)=>{
      const { crn} =request.query;
      console.log(crn)
      connection.query('select phonenumber from agent where crn=?',[crn],(error,results)=>{
          if(error){
              throw error
          } 
          const phonenumbers = results.map((row) => row.phonenumber);
          response.json(phonenumbers);
      })
  } 
  const getAgent=(request,response)=>{
    const { crn,phonenumber} =request.query;
    console.log('fetched',crn,phonenumber)
    connection.query('select agentType, name, email, password, phonenumber,aadharNumber, uploadAadhar, doorNo, street, landmark, village, pincode, pancardNumber, uploadPan, mandal, state, district,agentId from agent where crn=? and phonenumber=?',[crn,phonenumber],(error,results)=>{
        if(error){
            throw error 
        } 
        response.status(200).json(results)
console.log(results)
    })
}  
  const getAgentInfo=(request,response)=>{
    const { crn } = request.query;
    console.log(`Fetching data for date range: ${crn}`); // Add a log statement to check query parameters

    connection.query('select * from agent where crn= ?',[crn],(error,results)=>{
        if(error){ 
            throw error
        } 
        response.status(200).json(results)
console.log(results)    
    })
}  
const getAgentUpdate=(request,response)=>{
  
  const{   
    id,
      agentType,
  name,
  email,
  password,
  phonenumber,
  aadharNumber,
  uploadAadhar,
  doorNo,
  street,
  landmark,
  village,
  pincode,
  pancardNumber,
  uploadPan,
  mandal,
  crn,
  state,
  district
  }=request.body
  connection.query('update agent set "agentType"=$2, name=$3, email=$4, password=$5, phonenumber=$6, "aadharNumber"=$7, "uploadAadhar"=$8, "pancardNumber"=$9, "uploadPan"=$10, "doorNo"=$11, street=$12, landmark=$13, village=$14, pincode=$15, mandal=$16, district=$17, state=$18, crn=$19 where id=$1 ',[id,agentType, name, email, password, phonenumber, aadharNumber, uploadAadhar, pancardNumber, uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn],(error,results)=>{
      if(error){
          throw error
      }
      response.status(200).send(`Agent updated with id:${id}`) 
     })
} 

const getAgentInfo1 = (request, response) => {
  const { crn, phonenumber } = request.query;
  console.log(`Fetching data for CRN: ${crn} and Phone Number: ${phonenumber}`); // Log the CRN and phone number

  connection.query(
    'SELECT agentType, name, phonenumber, village, district, state FROM agent WHERE crn = ? AND phonenumber = ?',
    [crn, phonenumber],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results);
      console.log(results);
    }
  );
};

const getAgentType = (request, response) => {
  const { agentId } = request.query; // Change agentType to phonenumber
  console.log(`Fetching data for phone number: ${agentId}`);

  connection.query('SELECT t1.*, t2.ownername, t2.owneremail FROM agent AS t1 JOIN owner1 AS t2 ON t1.crn = t2.crn WHERE t1.agentId = ?', [agentId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results);
    console.log(results)
  });
};
const getTrucks = (request, response) => {
  const { crn } = request.query;

  connection .query(
    'SELECT t1.truckNumber, t1.truckMaxWeight, t1.truckWheels, t1.rightside, t2.* FROM truck AS t1 JOIN post1 AS t2 ON t1.truckNumber = t2.truckNumber WHERE t2.crn = ?',
    [crn],
    (error, results) => {
      if (error) { 
        throw error;
      }
      console.log('Retrieved truck data:', results);

      // Iterate through the results and construct image URLs
      const trucksWithImageURLs = results.map((truck) => {
        const uploadRegistrationUrl = `http://localhost:9000/images/${truck.uploadRegistration}`;
        const truckFrontSideWithNumberPlateUrl = `http://localhost:9000/images/${truck.truckFrontSideWithNumberPlate}`;
        const truckBackSideWithNumberPlateUrl = `http://localhost:9000/images/${truck.truckBackSideWithNumberPlate}`;
        const truckCabinUrl = `http://localhost:9000/images/${truck.truckCabin}`;
        const truckOdometerUrl = `http://localhost:9000/images/${truck.truckOdometer}`;
        const truckVideoUrl = `http://localhost:9000/images/${truck.truckVideo}`;
        const truckPermitUrl = `http://localhost:9000/images/${truck.truckPermit}`;
        const truckFitUrl = `http://localhost:9000/images/${truck.truckFit}`;
        const truckPollutionCertificateUrl = `http://localhost:9000/images/${truck.truckPollutionCertificate}`;
        const truckInsuranceCertificateUrl = `http://localhost:9000/images/${truck.truckInsuranceCertificate}`;
        const truckOwnerPassportSizePhotoUrl = `http://localhost:9000/images/${truck.truckOwnerPassportSizePhoto}`;
        const rightsideUrl = `http://localhost:9000/images/${truck.rightside}`;  
        const leftsideUrl = `http://localhost:9000/images/${truck.leftside}`;  

        return {
          ...truck,
          uploadRegistrationUrl,
          truckFrontSideWithNumberPlateUrl,
          truckBackSideWithNumberPlateUrl,
          truckCabinUrl,
          truckOdometerUrl,
          truckVideoUrl,
          truckPermitUrl,
          truckFitUrl,
          truckPollutionCertificateUrl,
          truckInsuranceCertificateUrl,
          truckOwnerPassportSizePhotoUrl,
          rightsideUrl,
          leftsideUrl
        };
      });

      response.status(200).json(trucksWithImageURLs);
    }
  );
};
const getOwner=(request,response)=>{
  connection.query('select * from agent ',(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results)
    })
} 
const getOwnerById=(request,respose)=>{
    const id = parseInt(request.params.id)
    connection.query('select * from agent where id=?',[id],(error,results)=>{
        if(error){
            throw error
        }
        
        respose.status(200).json(results)
    })
}
const createOwner = (request, response) => {
  const {  
    agentType,
    name,
    email,
    password,
    phonenumber,
    aadharNumber,  
  
    doorNo,
    street,
    landmark,
    village,
    pincode,
    pancardNumber,
   
    mandal,
    state,
    district,
    crn,
  } = request.body;
  const { 
        uploadAadhar,
        uploadPan,
       
      } = request.files;
      const filenames = {
        uploadAadhar: uploadAadhar[0].filename,
        uploadPan: uploadPan[0].filename,
       
      };

  // Generate a random 6-digit agent ID 
  const agentId = generateRandomAgentId();

  connection.query('insert into agent (agentType, name, email, password, phonenumber, aadharNumber, uploadAadhar, pancardNumber, uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn, agentId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [agentType, name, email, password, phonenumber, aadharNumber, filenames.uploadAadhar, pancardNumber, filenames.uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn, agentId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Agent product added with agent ID: ${agentId}`);
    }
  );
}

// Function to generate a random 6-digit agent ID
function generateRandomAgentId() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const updateOwner=(request,response)=>{
    const id=parseInt(request.params.id)
    const{ 
        agentType,
    name,
    email,
    password,
    phonenumber,
    aadharNumber,
    uploadAadhar,
    doorNo,
    street,
    landmark,
    village,
    pincode,
    pancardNumber,
    uploadPan,
    mandal,
    crn,
    state,
    district
    }=request.body
    connection.query('update agent set agentType=$2, name=$3, email=$4, password=$5, phonenumber=$6, aadharNumber=$7, "uploadAadhar"=$8, "pancardNumber"=$9, "uploadPan"=$10, "doorNo"=$11, street=$12, landmark=$13, village=$14, pincode=$15, mandal=$16, district=$17, state=$18, crn=$19 where id=$1',[agentType, name, email, password, phonenumber, aadharNumber, uploadAadhar, pancardNumber, uploadPan, doorNo, street, landmark, village, pincode, mandal, district, state, crn],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`Agent updated with id:${id}`) 
       })
} 
const deleteOwner=(request,response)=>{
    const id=parseInt(request.params.id)
    connection.query('DELETE FROM agent  WHERE id=?',[id],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  Agent with id:${id}`)
    })
}
const deleteBooking = (request, response) => {
    const { id } = request.params;
  
    // Retrieve the booking details to get the truck data
    connection.query('SELECT * FROM booking WHERE id = ?', [id], (error, bookingSelectResult) => {
      if (error) {
        throw error;
      }
  
      const bookingData = bookingSelectResult.rows[0];
  
      if (bookingData) {
        // Delete the canceled booking
        connection.query('UPDATE booking SET status = ? WHERE id = ?', ['canceled', id], (error, bookingDeleteResult) => {
          if (error) {
            throw error;
          }
  
          // Now, move data from the 'post' table to the 'post1' table based on some criteria (e.g., truckNumber)
          connection.query(
            'INSERT INTO post1 SELECT * FROM post WHERE "truckNumber" = $1',
            [bookingData.truckNumber],
            (error, post1InsertResult) => {
              if (error) {
                throw error;
              }
  
              response.status(200).send(`Canceled booking with ID ${id}, truck data moved to post1.`);
            } 
          );   
        });    
      } else {
        response.status(404).send('Booking data not found for cancellation.');
      }
    });  
  };
  const getBookDate = (request, response) => {
    const { from, to } = request.query;
    console.log(`Fetching data for date range1: from ${from} to ${to}`);
  
    connection.query(
      'SELECT truckNumber, date, time, `from`, `to`, fromSublocation, toSublocation, totalPrice, tbr, status FROM booking WHERE DATE(`date`) >= ? AND DATE(`date`) <= ?',
      [from, to],
      (error, results) => {  
        if (error) {
          throw error;
        }
        response.status(200).json(results);
      }
    );
  };
  
const getTable1=(request,respose)=>{
  const {feildcrn}=request.query;
  connection.query('select * from owner1 where feildcrn=?',[feildcrn],(error,results)=>{
      if(error){
          throw error
      }
      
      respose.status(200).json(results)
  })
}
const getTable2=(request,respose)=>{
  const {feildcrn}=request.query;
  connection.query('select * from truck where feildcrn=?',[feildcrn],(error,results)=>{
      if(error){
          throw error
      }
  
      respose.status(200).json(results)
  })
}
const getTable3=(request,respose)=>{
  const {feildcrn}=request.query;
  connection.query('select * from truck where feildcrn=?',[feildcrn],(error,results)=>{
      if(error){
          throw error
      }
      
      respose.status(200).json(results)
  })
}

module.exports = { 
  getAgentType,
  getInfo,
    getTrucks,
    getAgentInfo1,
    authenticateUser,
    getAgentInfo,
    getOwner,
    getAgent,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    deleteBooking,
    getBookDate,
    getAgentUpdate,
    getTable1,
    getTable2,
    getTable3,
}  