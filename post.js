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
// pool.connect((err,connection) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err.stack);
//       return;
//     }
  
//     console.log('Connected to MySQL as ID:', connection.threadId);
   
//     // Release the connection when done
  
//   });  
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '68.178.149.116', 
  port:'3306',
  user: 'truckbooking',
  password: 'truckbooking',
  database: 'truckbooking',
 
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
// Note: Avoid calling pool.connect() multiple times as it's not needed for a pool.

  
  
  // Middleware to ensure the user is authenticated and retrieve the CRN from the session
  app.use((req, res, next) => {
    if (req.session && req.session.crn) {
      res.locals.crn = req.session.crn; // Make CRN available to routes
    }
    next();
  });
//   const getAgentInfo=(request,response)=>{
//     pool.query('select "agentType" from agent ',(error,results)=>{
//         if(error){
//             throw error
//         } 
//         const agentTypes = results.rows.map((row) => row.agentType);
      

// response.json(agentTypes);
//     })
// }
 
const getPostDate=(request,response)=>{
    const {from , to,crn} = request.query;
    console.log(`Fetching data for date range11: from ${from} to ${to}`); // Add a log statement to check query parameters

    connection.query('select truckNumber, date, time, `from`, `to` from booking where  `date` >= ? AND `date` <= ? AND crn = ?',[from,to,crn],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results)
console.log(results)
    })      
}
const getPostTruck=(request,response)=>{
    const { truckNumber,crn } = request.query;
    console.log(`Fetching data for date range: ${truckNumber}`); // Add a log statement to check query parameters
    connection.query('select truckNumber, date, name, "from", "to",status,paymentStatus from booking where  truckNumber=? and crn=?',[truckNumber,crn],(error,results)=>{
        if(error){
            throw error  
        }
        response.status(200).json(results)

    })
}
const getLocation=(request,response)=>{
    const { loadingSublocations,unloadingSublocations } = request.query;
    console.log(`Fetching data for date range: ${loadingSublocations} to ${unloadingSublocations}`); // Add a log statement to check query parameters

    connection.query('select loadingSublocations,unloadingSublocations from post ',(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results)

    })
}
const getPost=(request,response)=>{
    const { crn }= request.query
    console.log(crn)
    connection.query('select * from post where crn=? ',[crn],(error,results)=>{
        if(error){
            throw error
        } 
        response.status(200).json(results)
    })
} 
const getPostStatus = (request, response) => {
    const { crn, truckNumber } = request.query;
    console.log(crn, truckNumber);
  
    connection.query('SELECT * FROM post WHERE crn = ? AND truckNumber = ?', [crn, truckNumber], (error, postResults) => {
      if (error) {
        throw error;
      }
  
      // Check if the truck is already posted
      if (postResults.length > 0) {
        const post = postResults[0];  
  
        // Check if the posted date has expired
        const currentDate = new Date();
        const postedDate = new Date(post.date); // Assuming you have a "date" column
        const daysDifference = (currentDate - postedDate) / (1000 * 60 * 60 * 24); // Calculate the difference in days
  
        if (daysDifference <= 2) {
          // The posted date is within the last 2 days, disallow reposting
          response.status(200).json({ canPost: false, message: 'Truck already posted within the last 2 days.' });
          return;
        }
  
        // Now, check if there's a previous booking
        connection.query(
          'SELECT * FROM booking WHERE truckNumber = ? ORDER BY date DESC LIMIT 1',
          [truckNumber],
          (bookingError, bookingResults) => {
            if (bookingError) {
              throw bookingError;
            }    
  
            if (bookingResults.length > 0) {
              const lastBooking = bookingResults.rows[0];
              const bookingDate = new Date(lastBooking.date);
  
              if (lastBooking.status === 'active' && currentDate > bookingDate) {
                // Previous booking is completed, and the booking date has expired
                response.status(200).json({ canPost: true });
              } else {
                // Previous booking is either not completed or its booking date has not expired
                response.status(200).json({ canPost: false, message: 'Truck already booked by an agent.' });
              }
            } else {
              // No previous booking exists, allow reposting
              response.status(200).json({ canPost: true });
            }
          }
        );
      } else {
        // The truck is not posted, allow posting
        response.status(200).json({ canPost: true });
      }
    });
  };
  
const getPostById=(request,respose)=>{
    const id = parseInt(request.params.id)
    connection.query('select * from post where id=?',[id],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results)
    })
}
const getPostByTruck=(request,respose)=>{
    const truckNumber = parseInt(request.params.id)
    connection.query('select * from post where truckNumber=?',[truckNumber],(error,results)=>{
        if(error){
            throw error
        }
        respose.status(200).json(results)
    })
}
const createPost=(request,response)=>{
   const {  
    truckNumber,
   date,  
   from,
   time,
   to,
   loadingSublocations,
   unloadingSublocations,
   ton,
   kilometer,
   pricePerTonKm,
   crn,
   
   }=request.body
   connection.query('insert into post (truckNumber, date, time, `from`, `to`, loadingSublocations,unloadingSublocations,ton,kilometer,pricePerTonKm, crn ) values(?,?,?,?,?,?,?,?,?,?,?)',[ truckNumber,  date, time,from, to,loadingSublocations,unloadingSublocations,ton,kilometer,pricePerTonKm,crn],(error,results)=>{
    if(error){
        throw error
    }
    response.status(200).send(`post truck add with id:${results.insertId}`)
   })
}
const createPost1=(request,response)=>{
    const {  
     truckNumber,
    date,
    from, 
    time,
    to,
    loadingSublocations,
    unloadingSublocations,
    ton,
   kilometer,      
   pricePerTonKm,
    crn,  
     
    }=request.body
    connection.query('insert into post1 (truckNumber, date, time,`from`, `to`, loadingSublocations,unloadingSublocations,ton,kilometer,pricePerTonKm, crn ) values(?,?,?,?,?,?,?,?,?,?,?)',[ truckNumber,  date, time,from, to,loadingSublocations,unloadingSublocations,ton,kilometer,pricePerTonKm,crn],(error,results)=>{
     if(error){
         throw error
     }  
     response.status(200).send(`post truck add with id:${results.insertId}`)
    })
 }
const updatePost=(request,response)=>{
    const id=parseInt(request.params.id)
    const{ 
        registrationNumber,
        date,
        from,
        time,
        to,
        loadingSublocations,
        unloadingSublocations,
                    crn,
    }=request.body
    connection.query('update post set "registrationNumber"=$2, date=$3, "time"=$4, "from"=$5, "to"=$6, sublocations=$7, crn=$8,"loadingSublocations"=$9,"unloadingSublocations"=$10 where id=$1',[ registrationNumber,  date, time, from,to,crn,loadingSublocations,unloadingSublocations],(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).send(`truck updated with id:${id}`) 
       })
} 
const deletePost = (request, response) => {
    const id = parseInt(request.params.id);
    connection.query('DELETE FROM post WHERE id=?', [id], (error, results) => {
      if (error) {
        console.error("Error deleting from post table:", error);
        response.status(500).json({ error: "Internal server error" });
        return;
      }
      response.status(200).send(`Deleted truck with id: ${id} from post table.`);
    });
  };
   
  const deletePost1 = (request, response) => {
    const id = parseInt(request.params.id);
    connection.query('DELETE FROM post1 WHERE id=?', [id], (error, results) => {
      if (error) {
        console.error("Error deleting from post1 table:", error);
        response.status(500).json({ error: "Internal server error" });
        return;
      }
      response.status(200).send(`Deleted truck with id: ${id} from post1 table.`);
    });  
  };     
const setPost=(request,response)=>{
    const truckNumber=parseInt(request.params.id)
    connection.query('select "truckNumber" FROM post  WHERE "truckNumber"=$1',[truckNumber],(error,results)=>
    {
        if(error){  
            throw error
        }
        response.status(200).send(` deleted  truck with id:${id}`)
    })
}
function requireAuth(req, res, next) {
    if (!req.session.crn) {
      // User is not authenticated, redirect to the login page or send an unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // User is authenticated, continue to the next middleware or route handler
    next();
  }
  
  // Example protected route using the requireAuth middleware
  app.get('/protected-route', requireAuth, (req, res) => {
    // This route is protected and can only be accessed by authenticated users
    res.json({ message: 'This is a protected route.' });
  });
module.exports = {
    getLocation,
    getPostTruck,
    getPostDate,
    getPost,
    setPost,
    getPostStatus,
    getPostById,
    createPost,
    createPost1,
    updatePost,
    deletePost1,
    deletePost,
    getPostByTruck,
}       