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
// Middleware to ensure the user is authenticated and retrieve the CRN from the session
app.use((req, res, next) => {
    if (req.session && req.session.crn) {
        res.locals.crn = req.session.crn; // Make CRN available to routes
    }
    next();
});


const getTruckNumber = (request, response) => {
    const { crn } = request.query;
    console.log(`Fetching data for date range: ${crn}`);
  
    connection.query('SELECT truckNumber, status, truckstatus FROM truck WHERE crn = ?', [crn], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results);
      console.log(results);
    });
  };
  const getTruckStatus = (request, response) => {
    const {truckNumber } = request.query;
    console.log(`Fetching data for date range: ${truckNumber}`);
  
    connection.query('SELECT  status FROM truck WHERE truckNumber = ?', [truckNumber], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results);
      console.log(results); 
    });   
  };  
  
    
const getTruckNumber2 = (request, response) => {
    const { crn } = request.query;
    console.log('crn', crn)
    connection.query('select truckNumber from truck WHERE crn = ?', [crn], (error, results) => {
        if (error) {
            throw error
        }
        const truckNumbers = results.map((row) => row.truckNumber);
        console.log(truckNumbers)
        response.json(truckNumbers);
    })
}
const getTruckNumber1 = (request, response) => {
    const { crn } = request.query;

    connection.query(
        'select * from booking WHERE crn = ?',
        [crn],
        (error, results) => {
            if (error) {
                throw error;
            }

            const truckData = results.map((row) => ({
                truckNumber: row.truckNumber,
                truckName: row.truckName,
                date: row.date,
                from: row.from,
                to: row.to,
                status: row.status || "No Booking",
            }));
            response.json(truckData); 
        }
    );
}
const getTruck = (request, response) => {
    const {crn}= request.query;
    console.log(crn)
    connection.query('select * from truck where crn=$1 ',[crn], (error, results) => {
        if (error) {
            throw error
        }const trucksWithImageURLs = results.rows.map((truck) => {
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
    const getTruckverification = (request, response) => {
        const {feildcrn}= request.query;
        console.log(feildcrn)
        connection.query('SELECT t1.*, t2.ownername, t2.owneremail FROM truck AS t1 JOIN owner1 AS t2 ON t1.crn = t2.crn WHERE t1.feildcrn = ?' ,[feildcrn], (error, results) => {
            if (error) {
                throw error
            }const trucksWithImageURLs = results.map((truck) => {
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
const getSubLocations = (request, response) => {
    connection.query('select * from sub ', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSub = (request, response) => {
    const { loadingSublocations, unloadingSublocations } = request.query;
    connection.query(' SELECT distance FROM sub WHERE loadingSublocations = ?  AND unloadingSublocations = ? ', [loadingSublocations, unloadingSublocations], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
}
const getSubLocationsById = (request, respose) => {
    const id = parseInt(request.params.id)
    connection.query('select * from sub where id=?', [id], (error, results) => {
        if (error) {
            throw error
        }
        respose.status(200).json(results)
    })
}
const getVerified = (request, response) => {
    const { feildcrn, status } = request.query;
    
    if (status === 'Completed') {
        connection.query('SELECT * FROM truck WHERE status = ? and feildcrn = ?', [status, feildcrn], (error, results) => {
            if (error) {
                console.error('Error fetching verified trucks:', error);
                response.status(500).json({ error: 'An error occurred while fetching data' });
            } else {
                response.status(200).json(results);
            }
        });
    } else {
        // Handle other status conditions or return an empty array
        response.status(200).json([]);
    }
}

const createSublocations = (request, response) => {
    const {
        loadingSublocations,
        unloadingSublocations,
        distance,
    } = request.body
    connection.query('insert into sub (loadingSublocations ,unloadingSublocations,distance) values(?,?,?)', [loadingSublocations, unloadingSublocations, distance], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`sublocations add with id:${results.insertid}`)
    })
}
const deleteSubLocations = (request, response) => {
    const id = parseInt(request.params.id)
    connection.query('DELETE FROM sublocations  WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(` deleted  sublocation with id:${id}`)
    })
}
const getTruckById = (request, respose) => {
    const id = parseInt(request.params.id)
    connection.query('select * from truck where id=?', [id], (error, results) => {
        if (error) {
            throw error
        }
        respose.status(200).json(results.rows)
    })
}
const createTruck = (request, response) => {
    const {
        truckNumber,
        truckMaxWeight,
        truckWheels,
        truckPermitValidity,
        truckFitValidity,
        truckPollutionCertificateValidity, 
        truckInsuranceCertificateValidity,
        name,
        date,
        crn,
        feildcrn

    } = request.body;

    const { 
        uploadRegistration,
        truckFrontSideWithNumberPlate,
        truckBackSideWithNumberPlate,
        rightside,
        leftside,
        truckCabin,          // Cabin image
        truckOdometer,       // Odometer image
        truckVideo,           // Video file
        truckPermit,
        truckFit,
        truckPollutionCertificate,
        truckInsuranceCertificate,
        truckOwnerPassportSizePhoto,
    } = request.files;
    const filenames = {
        uploadRegistration: uploadRegistration[0].filename,
        truckFrontSideWithNumberPlate: truckFrontSideWithNumberPlate[0].filename,
        truckBackSideWithNumberPlate: truckBackSideWithNumberPlate[0].filename,
        truckCabin: truckCabin[0].filename,
        truckOdometer: truckOdometer[0].filename,
        truckVideo: truckVideo[0].filename,
        truckPermit: truckPermit[0].filename,
        truckFit: truckFit[0].filename,
        rightside: rightside[0].filename,
        leftside: leftside[0].filename,

        truckPollutionCertificate: truckPollutionCertificate[0].filename,
        truckInsuranceCertificate: truckInsuranceCertificate[0].filename,
        truckOwnerPassportSizePhoto: truckOwnerPassportSizePhoto[0].filename
    }
    connection.query('insert into truck (truckNumber, uploadRegistration, truckMaxWeight, truckWheels, truckFrontSideWithNumberPlate, truckBackSideWithNumberPlate, truckCabin, truckOdometer, truckVideo, truckPermit, truckFit, truckPollutionCertificate, truckInsuranceCertificate, truckOwnerPassportSizePhoto,truckPermitValidity,truckFitValidity,truckPollutionCertificateValidity,truckInsuranceCertificateValidity, crn,name,date,rightside,leftside,feildcrn) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [truckNumber, filenames.uploadRegistration, truckMaxWeight, truckWheels, filenames.truckFrontSideWithNumberPlate, filenames.truckBackSideWithNumberPlate, filenames.truckCabin, filenames.truckOdometer, filenames.truckVideo, filenames.truckPermit, filenames.truckFit, filenames.truckPollutionCertificate, filenames.truckInsuranceCertificate, filenames.truckOwnerPassportSizePhoto, truckPermitValidity, truckFitValidity, truckPollutionCertificateValidity, truckInsuranceCertificateValidity, crn,name,date,filenames.rightside,filenames.leftside,feildcrn],        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Truck added with ID: ${results.insertId}`);
        }
    );
};

const getBook = (request, response) => {
    connection.query('select * from booking ', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
}
const getDriver = (request, response) => {
    const { crn } = request.query;
    console.log(crn)
    connection.query('select * from driver where  crn=? ', [crn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
}
const getTbr = (request, response) => {
    const { crn, tbr } = request.query;
    console.log(crn)
    connection.query('select * from booking where  crn=? and tbr=? ', [crn,tbr], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
}
const getBookById = (request, respose) => {
    const id = parseInt(request.params.id)
    connection.query('select * from booking where id=?', [id], (error, results) => {
        if (error) {
            throw error
        }
        respose.status(200).json(results)
    })
}
const createDriver = (request, response) => {
    const {
        driverName,
        phoneNumber,
        email,
        licenseFront,
        licenseBack,
        licenseIssuedDate,
        licenseValidityDate,
        aadharFront,
        aadharBack,
        policeVerificationCertificate,
        healthCertificate,
        driverPhoto,
        dateOfJoining,
        crn,
    } = request.body
    connection.query('insert into driver (driverName,phoneNumber, email, licenseFront, licenseBack, licenseIssuedDate,licenseValidityDate,aadharFront, aadharBack, policeVerificationCertificate, healthCertificate,driverPhoto, dateOfJoining,crn) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [driverName, phoneNumber, email, licenseFront, licenseBack, licenseIssuedDate, licenseValidityDate, aadharFront, aadharBack, policeVerificationCertificate, healthCertificate, driverPhoto, dateOfJoining, crn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`truck add with id:${results.insertid}`)
    })
}
const createDriving = (request, response) => {
    const {
        name,
        phonenumber,
     tbr,
     localDate,
        crn,
    } = request.body
    connection.query('insert into driving (name, phonenumber, tbr, localDate, crn) values(?,?,?,?,?)', [name,phonenumber, tbr, localDate, crn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`truck add with id:${results.insertid}`)
    })
}
const createBook = (request, response) => {
    const now = new Date();
  const localDate = now.getDate().toString().padStart(2, '0');
  const localMonth = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const localYear = now.getFullYear().toString();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Create the TBR number
  const tbr = `TBR${localDate}${localMonth}${localYear}${hours}${minutes}`;
    const {
        truckNumber,
        truckWheels,
        fromSublocation,
        toSublocation,
        crn,
        date,
        from,
        time,
        to,
        fromPincode,
        toPincode,
        totalKilometers,
        totalPrice,
        name,   
        phonenumber,
        fromAddress,
        toAddress,
        truckMaxWeight,
        type,  
        agentId,    

    } = request.body  
    connection.query('insert into booking ( truckNumber, truckWheels, fromSublocation, toSublocation, crn, date,  `from`, time, `to`, fromPincode, toPincode, totalKilometers, totalPrice, name, fromAddress, toAddress,truckMaxWeight,phonenumber,type,tbr,agentId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [truckNumber, truckWheels, fromSublocation, toSublocation, crn, date, from, time, to, fromPincode, toPincode, totalKilometers, totalPrice, name, fromAddress, toAddress, truckMaxWeight, phonenumber, type,tbr,agentId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`truck add with id:${results.insertid}`)
    })
}
const delTruck = (request, response) => {
    const truckNumber = request.params.truckNumber;
    connection.query('DELETE FROM post1  WHERE truckNumber=?', [truckNumber], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(` deleted  truck with trucknumber:${truckNumber}`)
    })
} 
const updateTruck = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        truckNumber,
        uploadRegistration,
        truckMaxWeight,
        truckWheels,
        truckFrontSideWithNumberPlate,
        truckBackSideWithNumberPlate,
        truckCabin,
        truckOdometer,
        truckVideo,
        truckPermit,
        truckFit,
        truckPollutionCertificate,
        truckInsuranceCertificate,
        truckOwnerPassportSizePhoto,
        truckDriverLicenseFrontSide,
        truckDriverLicenseBackSide,
        TruckDriverPoliceVerificationCertificate,
        crn,
    } = request.body
    connection.query('update truck set "truckNumber"=$2, "uploadRegistration"=$3, "truckMaxWeight"=$4, "truckWheels"=$5, "truckFrontSideWithNumberPlate"=$6, "truckBackSideWithNumberPlate"=$7, "truckCabin"=$8, "truckOdometer"=$9, "truckVideo"=$10, "truckPermit"=$11, "truckFit"=$12, "truckPollutionCertificate"=$13, "truckInsuranceCertificate"=$14, "truckOwnerPassportSizePhoto"=$15, "truckDriverLicenseFrontSide"=$16, "truckDriverLicenseBackSide"=$17, "TruckDriverPoliceVerificationCertificate"=$18, crn=$19 where id=$1', [truckNumber, uploadRegistration, truckMaxWeight, truckWheels, truckFrontSideWithNumberPlate, truckBackSideWithNumberPlate, truckCabin, truckOdometer, truckVideo, truckPermit, truckFit, truckPollutionCertificate, truckInsuranceCertificate, truckOwnerPassportSizePhoto, truckDriverLicenseFrontSide, truckDriverLicenseBackSide, TruckDriverPoliceVerificationCertificate, crn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`truck updated with id:${id}`)
    })
}
const updateTruckStatus = (request, response) => {
    const id = parseInt(request.params.id);
    const { status,verificationDate } = request.body;
    connection.query('UPDATE truck SET status = ?, verificationDate = ? WHERE id = ?', [status,verificationDate, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Truck status updated with ID: ${id}`);
    });
};   
const updateLoadingStatus = (request, response) => {  
    const id = parseInt(request.params.id);
    const { loadingstatus } = request.body;
    connection.query('UPDATE booking SET loadingstatus = ? WHERE id = ?', [loadingstatus, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Truck status updated with ID: ${id}`);
    });   
}; 
const updateunloadingStatus = (request, response) => {
    const id = parseInt(request.params.id);
    const { unloadingstatus } = request.body;
    connection.query('UPDATE booking SET unloadingstatus = ? WHERE id = ?', [unloadingstatus, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Truck status updated with ID: ${id}`);
    }); 
};
const updatetruckStatus = (request, response) => {
    const { truckNumber, truckstatus } = request.body;
    console.log('Updating truck status for:', truckNumber);
    console.log('New status:', truckstatus);

    connection.query('UPDATE truck SET truckstatus = ? WHERE truckNumber = ?', [truckstatus, truckNumber], (error, results) => {
        if (error) {
            console.error('Error updating truck status:', error);
            response.status(500).send('Error updating truck status');
        } else {
            console.log('Truck status updated successfully');
            response.status(200).send(`Truck status updated with ID: ${truckNumber}`);
        }
    });   
};  

const updateDriverStatus = (request, response) => {
    

    const { tbr,driverphonenumber,driverName, driverstatus} = request.body;
    console.log('Received data:', tbr, driverphonenumber, driverName, driverstatus);
    connection.query('UPDATE booking SET driverphonenumber = ?,driverName=?, driverstatus=? WHERE tbr = ?', [driverphonenumber,driverName, driverstatus,tbr], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Truck status updated with ID: `);
    }); 
}; 
const updateDriverStatus1 = (request, response) => {
    const id = parseInt(request.params.id);
    const { status } = request.body;
    connection.query('UPDATE driver SET status = ? WHERE id = ?', [status, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Truck status updated with ID: ${id}`);
    }); 
}; 
const deleteTruck = (request, response) => {
    const id = parseInt(request.params.id)
    connection.query('DELETE FROM truck  WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(` deleted  truck with id:${id}`)
    })
}
// const deleteBooking=(request,response)=>{
//     const id=parseInt(request.params.id)
//     pool.query('DELETE FROM booking  WHERE id=$1',[id],(error,results)=>
//     {
//         if(error){  
//             throw error
//         }
//         response.status(200).send(` deleted  truck with id:${id}`)
//     })
// }
const getBooking = (request, response) => {
    const { crn } = request.params;
    console.log(crn)
    connection.query(`select * from booking WHERE crn = ? `, [crn], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results)
        console.log(results)
    })
}
const getBooking1 = (request, response) => {
    const { crn } = request.query;
    const {phonenumber} =request.query;
    console.log(`Fetching data for CRN: ${crn} and Phone Number: ${phonenumber}`); // Log the CRN and phone number
    connection.query(`select * from booking WHERE crn = ? and phonenumber=? `, [crn,phonenumber], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results)
        console.log(results)  
    })
}
const getPaymentUpdate = (req, res) => {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const updatePaymentStatusQuery = `
      UPDATE public.booking
      SET "paymentStatus" = 'payment completed'
      WHERE id = $1;
    `;

    connection.query(updatePaymentStatusQuery, [bookingId], (error, result) => {
        if (error) {
            console.error('Error updating payment status:', error);
            return res.status(500).json({ message: 'Error updating payment status' });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json({ message: 'Payment status updated to Payment Completed' });
    });
};


module.exports = {
    getBookById,
    createSublocations,
    createBook,
    getSub,
    getBooking,
    getTruckverification,
    deleteSubLocations,
    getSubLocationsById,
    getSubLocations,
    getTruckNumber,
    getTruck,
    getBook,
    delTruck,
    getTruckById,
    createTruck,  
    updateTruck,
    getTruckNumber1,  
    createDriver, 
    getVerified,         
    // deleteBooking,  
    deleteTruck,
    getDriver,   
    getPaymentUpdate,  
    getBooking1,   
    updateTruckStatus, 
    getTruckNumber2,  
    getTbr,
    updateLoadingStatus,
    updateunloadingStatus,
    createDriving,
    updateDriverStatus,
    updateDriverStatus1,
    updatetruckStatus,
    getTruckStatus
}  