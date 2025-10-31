const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8100;

// ✅ Engedélyezzük, hogy más origin is elérje
app.use(cors());
app.use(express.json());
const CountersJsonPath = path.join(__dirname, 'counters.json');

let counters = {};
if(fs.existsSync(CountersJsonPath)) {
    const data = fs.readFileSync(CountersJsonPath, 'utf8');
    counters = JSON.parse(data);
}

function saveCounters() {
    fs.writeFileSync(CountersJsonPath, JSON.stringify(counters, null, 2));
}


app.post('/counters/add/:name', (req, res) => {
    name = req.params.name;
    if(counters[name] !== undefined)
    {
        res.json({success : true});
    }
    else
    {
        counters[name] = 0;
        saveCounters();
        res.json({success : true});

    }
})

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
    saveCounters();
    res.json({success: true,value: counters[name]});
});

// Decrease 1 to the customersCounter
app.post('/decreasecounter/:name', (req, res) => {
    name = req.params.name;
    counters[name]--;
    saveCounters();
    res.json({success: true,value: counters[name]});
});

// Set the customersCounter to 0
app.post('/reset/:name', (req, res) => {
    name = req.params.name;
    counters[name] = 0;
    saveCounters();
    res.json({value: counters[name]});
});

// statikus fájlok (ha van public/)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`✅ Szerver fut: http://localhost:${PORT}`);
});



