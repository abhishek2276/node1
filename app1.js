const express = require('express')
const pg = require('pg')

const app = express()

var  items = [
    {
      id:1,
      name:"abhi",
      age:21
    },
    {
        id:2,
        name:"abhi1",
        age:22
    }

 
]

const PORT  = 8000

async function getitems(){
    const client = new pg.Client({
        host: 'localhost',
        port: 5432,
        database: 'hello',
        user: 'postgres',
        password: 'Abhi@2001',
      })

    await client.connect()
    let res = await client.query("SELECT * from helo")
    console.log(res);
    await client.end()
    return res.rows
}

app.listen(PORT , ()=>{
    console.log("Express app started");
})

app.get("/items" , async (req, res)=>{
     const data = await getitems()
    console.log("hii");
     res.send(data)
})


