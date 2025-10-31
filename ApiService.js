const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8100;

// ✅ Engedélyezzük, hogy más origin is elérje
app.use(cors());
app.use(express.json());


let counters = {
    customersCounter : 0,
    tempCount : 0,
};

// Gives back the current value of customersCounter
app.get('/counters',(req, res) => {
    res.json({counters});
});

// Gives back the current value of customersCounter
app.get('/counters/:name',(req, res) => {
    name = req.params.name;
    res.json({name,value: counters[name]});
});

// Increase 1 to the customersCounter
app.post('/increasecounter/:name', (req, res) => {
    name = req.params.name;
    counters[name]++;
    res.json({success: true,value: counters[name]});
});

// Decrease 1 to the customersCounter
app.post('/decreasecounter/:name', (req, res) => {
    name = req.params.name;
    counters[name]--;
    res.json({success: true,value: counters[name]});
});

// Set the customersCounter to 0
app.post('/reset/:name', (req, res) => {
    name = req.params.name;
    counters[name] = 0;
    res.json({value: counters[name]});
});

/*
app.get('/reset', (req, res) => {
    customersCounter = 0;
    res.json({value: customersCounter});
});
*/


// statikus fájlok (ha van public/)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`✅ Szerver fut: http://localhost:${PORT}`);
});



