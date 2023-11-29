const express= require('express')
const app =express()
const PORT=6000
var item=[
    {
    name:"iphone 13",
    proce:1000
},{
    name:"laptop",
    price:2000
},{
    name:"lap",
    price:200
}
]
app.listen(PORT,()=>{
    console.log("app started");

})
app.post("/item",(req,res)=>{
console.log("hello");

res.send(item)
})