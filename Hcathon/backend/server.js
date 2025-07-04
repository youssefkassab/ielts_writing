
const express=require("express") 
const app=express() //cereat app
app.listen(8080)
app.use((request,response,next)=>{
    response.setHeader("Access-control-Allow-Origin","*")
    response.setHeader("Access-control-Allow-Methods","*")
    response.setHeader("Access-control-Allow-Headers","*")
    next()
})
app.use(express.urlencoded({extended:false}))
app.use(express.json())

/////////////////////////////
const data=require("mysql") //calling the module
const db=data.createConnection({"host":"localhost","user":"root","database":"ilets"}) //give it data to conect
db.connect((err)=>{
    if (err)
    console.log(err)
    else
    console.log("database is connected")
})

app.post("/login", (req, res) => {
    const { email, password} = req.body;

    // Query to fetch user from database
    const query = `SELECT * FROM sign_up WHERE email = ? AND password = ?`;
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ success: false, message: 'Internal app error' });
            return;
        }

        if (results.length > 0) {
            // Send JSON response indicating successful login and redirect URL
            res.status(200).json({ success: true, message: 'Login successful!', redirectTo: '/Hcathon/frontend/index.html' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }
    });
});

app.post("/sign_up",(request,response)=>{
    const savequery="INSERT INTO sign_up SET ?"
    db.query(savequery,request.body, (err,data)=>{
        console.log(err)
    })
})  



