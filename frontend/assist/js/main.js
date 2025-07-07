// Utility: Check if user is authenticated (token exists)
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Example: Use this to access a protected API endpoint
function fetchProtectedResource(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to access this resource.');
        return Promise.reject('No token');
    }
    return fetch(endpoint, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': 'Bearer ' + token
        }
    });
}

// Call this on protected pages to enforce login
function requireAuthOrRedirect() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
}

  fetchProtectedResource('/api/protected-content').then(response => {
      if (!response.ok) {
        // Not authenticated, redirect to login
        window.location.href = '/login';
        return;
      }
      return response.json();
    }).then(data => {
      if (data && data.success) {
        // Show the protected content
       
      }
    })
    .catch(() => {
      window.location.href = '/login';
    });
    function scoreAnswer() {
        const Question = document.getElementById('questionBox').value;
        const Essay = document.getElementById('answer').value;
    fetch("/result", {
        method: 'POST',     
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ Question, Essay })
        
    })
    .then(response => response.json()).then(data => {
        console.log("result :",data);
    //  function scoreAnswer() {
    //         const answer = document.getElementById('answer').value.trim();
    //         if (!answer) {
    //             document.getElementById('scoreSection').textContent = "Please write an answer to get your score.";
    //             return;
    //         }
            // Simple scoring: based on length and use of tech keywords
            // const keywords = ["AI", "machine learning", "data", "algorithm", "technology", "cloud", "security", "network"];
            // let score = Math.min(100, answer.length * 0.5);
            // keywords.forEach(k => {
            //     if (answer.toLowerCase().includes(k.toLowerCase())) score += 10;
            // });
            // score = Math.round(Math.min(score, 100));
            document.getElementById('scoreSection').textContent = `Your AI Writing Score: ${data.message} you got ${data.band}/10`;
        }).catch(error => {
            console.error('Error:', error);
        })
    }
// document.getElementById('score').addEventListener('submit', function (e) {
//     e.preventDefault(); // Prevent form submission
//     const Question = document.getElementById('questionBox').value;
//     const Essay = document.getElementById('answer').value;
//     fetch("/result", {
//         method: 'POST',     
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ Question, Essay })
//     })
//     .then(response => response.json()).then(data => {
//         console.log(data);
//     //  function scoreAnswer() {
//     //         const answer = document.getElementById('answer').value.trim();
//     //         if (!answer) {
//     //             document.getElementById('scoreSection').textContent = "Please write an answer to get your score.";
//     //             return;
//     //         }
//             // Simple scoring: based on length and use of tech keywords
//             // const keywords = ["AI", "machine learning", "data", "algorithm", "technology", "cloud", "security", "network"];
//             // let score = Math.min(100, answer.length * 0.5);
//             // keywords.forEach(k => {
//             //     if (answer.toLowerCase().includes(k.toLowerCase())) score += 10;
//             // });
//             // score = Math.round(Math.min(score, 100));
//             document.getElementById('scoreSection').textContent = `Your AI Writing Score: ${data}/100`;
//         }).catch(error => {
//             console.error('Error:', error);
//         })
    
//     })

// Example usage: Fetch user profile (protected)
// fetchProtectedResource('/profile')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

// You can use fetchProtectedResource for any protected API call in your app.
// For page navigation, use AJAX to get data and render it, not window.location.href.

// Example: On pro.html, call requireAuthOrRedirect() at the top of your script
// <script src="/assist/js/main.js"></script>
// <script>requireAuthOrRedirect();</script>