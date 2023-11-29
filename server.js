const http = require('http');
const dotenv = require('dotenv');

process.on("uncaughtException", err => {
     console.log('[uncaughtException] Shutting down server... ');

console.log(err.name, err.message);

console.log(err);
 process.exit(1);
})
dotenv.config();
dotenv.config({ path: './.env' });

const app = require("./app")

var httpServer = http.createServer(app);

const server = httpServer.listen(process.env.PORT,()=>{
    console.log("server up ad running:",process.env.PORT);

})

process.on('unhandledRejection', err=>{
    console.log(`[unhandledRejection] Shutting down server...`);
    console.log(err);
    server.close(() => {
    process.exit(1);
    
    })
    
    });