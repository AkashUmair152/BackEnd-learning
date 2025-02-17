const express = require('express');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Routes for different pages
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('me');
});

app.get('/form', (req, res) => {
    res.render('form');
});
app.get("/get-form-data", (req, res) => {
    console.log(req.query);
    res.send("Data received successfully!");
}   )
// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
