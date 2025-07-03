const express = require('express');
const onnx = require('onnxruntime-node');
const app = express();

app.use(express.json());
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
        session = await onnx.InferenceSession.create('./ielts_model.onnx');
        console.log("ONNX model loaded.");
    } catch (err) {
        console.error("Failed to load ONNX model:", err);
    }
})();

app.post('/result', async (req, res) => {
    try {
        const questionText = req.body.Question || "";
        const essayText = req.body.Essay || "";

        const feeds = {
            'Question': new onnx.Tensor('string', [questionText], [1]),
            'Essay': new onnx.Tensor('string', [essayText], [1])
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


app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
