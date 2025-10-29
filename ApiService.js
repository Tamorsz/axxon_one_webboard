const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8100;

// ✅ Engedélyezzük, hogy más origin is elérje
app.use(cors());
app.use(express.json());


let counter = 0;

// Gives back the current value of counter
app.get('/counter',(req, res) => {
    res.json({value: counter});
});

// Adds 1 to the counter
app.post('/linecross', (req, res) => {
    counter++;
    res.json({value: counter});
});

// Set the counter to 0
app.post('/reset', (req, res) => {
    counter = 0;
    res.json({value: counter});
});


// statikus fájlok (ha van public/)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`✅ Szerver fut: http://localhost:${PORT}`);
});



