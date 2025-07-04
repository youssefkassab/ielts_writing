const express = require('express');
const onnx = require('onnxruntime-node');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, '/../frontend')));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

let session;

// Load the ONNX model once on startup
(async () => {
    try {
        session = await onnx.InferenceSession.create('./ielts_model_GradientBoost2.onnx');
        console.log("ONNX model loaded.");
    } catch (err) {
        console.error("Failed to load ONNX model:", err);
    }
})();
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
        if (err) {
            console.error('Error executing MySQL query:', err);
            return response.status(500).json({ success: false, message: 'Internal server error' });
        } else{
            response.status(200).json({ success: true, message: 'Sign up successful!' });
        }
    })
})
app.post('/result', async (req, res) => {
    try {
        const questionText = req.body.Question || "";
        const essayText = req.body.Essay || "";

        const feeds = {
            'assignment': new onnx.Tensor('string', [questionText], [1,1]),
            'Essay': new onnx.Tensor('string', [essayText], [1,1])
        };

        const results = await session.run(feeds);
        console.log("Result keys:", Object.keys(results));

        const predictionLabel = results.label.data[0]; // adjust 'label' to your output name
        console.log(`🎯 Prediction raw value: ${predictionLabel}`);

        let ILTSRESULT;
        if (predictionLabel >= 0 && predictionLabel < 6) {
            ILTSRESULT = 'Need improvement';
        } else if (predictionLabel >= 6 && predictionLabel < 7) {
            ILTSRESULT = 'Good';
        } else {
            ILTSRESULT = 'Excellent';
        }

        res.json({
            band: predictionLabel,
            message: ILTSRESULT
        });

    } catch (err) {
        console.error("❌ Error during inference:", err);
        res.status(500).send("Prediction failed.");
    }
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend', 'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend', 'signup.html'));
});
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
