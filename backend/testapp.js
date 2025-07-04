const ort = require('onnxruntime-node');

(async () => {
    try {
        console.log("✅ Loading model...");
        const session = await ort.InferenceSession.create('./ielts_model_GradientBoost2.onnx');

        console.log("✅ Model loaded.");

        const assignment = `There is a moral necessity today for the richer countries of the world to help the poorer countries develop in terms of feeding the population, education and health care. To what extent do you agree or disagree with this statement?Give reasons for your answer and include any relevant examples from your knowledge or experience.You should write at least 250 words.`;
        const full_text = `For centuries, artworks have been titled  'Work of Art' based on their extraordinary qualities. However, some people argue that nowadays, the standards are decreasing and the labelling of substandard artworks as 'masterpieces' has become ubiquitous. The upcoming full_text will discuss why I agree that original paintings are being neglected while usual ones are being praised.
Firstly, the superficial nature of humans is responsible for this change. These days, people do not see the meaning behind the painting or the message the artist is trying to convey rather they buy those paintings which are popular and contemporary. To illustrate it further, in art auctions it can be seen that when one person bids on one painting, no matter whether it is good or bad, others also start putting their money on it. Thus it is clear that normal art forms are winning prizes due to public attention.
Secondly, some artists might bribe the organizers of exhibitions to promote their canvas. Indeed, there have been some recorded instances when artists were caught while signing up deals to increase the sales of their work. If a certain artwork receives publicity then it is impossible that it would not have an influence on the public. This type of promotion skews a person's opinion about a certain picture and so are forced to think about purchasing it, leaving behind original ones. Therefore, it is apparent that the diabolical activities of painters are responsible for their works being labelled as masterpieces.
To conclude, the maintenance of social position and influence of painters are the prime causes for the popularity of ordinary artworks and the negligence of true works. Hence I agree with the given statement.`;
console.log("📄assignment:", assignment);

        // 🔥 EXACT tensor shapes & types matching your ONNX export
       const feeds = {
    assignment: new ort.Tensor('string', [assignment], [1, 1]),
    full_text: new ort.Tensor('string', [full_text], [1, 1])
};

     
        
        console.log("✅ Running inference...");
        const results = await session.run(feeds);

        // console.log("Result keys:", Object.keys(results));

        // Use the actual output name from your ONNX model
        // Print result keys for debugging
        console.log('Result keys:', Object.keys(results));
        // Try to access the correct output name
        const outputName = Object.keys(results)[0];
        const prediction = results[outputName].data[0];
        console.log(`🎯 Prediction: ${prediction}`, results);

    } catch (err) {
        console.error("❌ Inference error:", err);
    }
})();
