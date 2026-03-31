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

class CounterClass
{
    constructor(name, value = 0, limit = 0) {
        this.name = name;
        this.value = value;
        this.limit = limit;
    }

    updateValue(newValue)
    {
        this.value = newValue;
    }

    updateLimit(newLimit)
    {
        this.limit = newLimit;
    }
}

let counters = {};
if(fs.existsSync(CountersJsonPath)) {
    const data =JSON.parse( fs.readFileSync(CountersJsonPath, 'utf8'));
    for(let key in data)
    {
        const c = data[key];
        counters[key] = new CounterClass(c.name,c.value,c.limit);
    }
}

function saveCounters() {
    fs.writeFileSync(CountersJsonPath, JSON.stringify(counters, null, 2));
}



app.post('/counters/create/:name', (req, res) => {
    const name = req.params.name;

    if(counters[name] === undefined)
    {
        counters[name] = new CounterClass(name);
        saveCounters();
        res.json({success : true, counter: counters[name]});
    }
    else
    {
        res.status(400).json({success: false, message: 'Counter already exists'});

    }
});

// Gives back the current value of customersCounter
app.get('/counters',(req, res) => {
    res.json(counters);
});

// Gives back the current value of customersCounter
app.get('/counters/:name',(req, res) => {
    const name = req.params.name;
    const counter = counters[name];
    if(counter)
    {
        res.json(counter);
    }
    else
    {
        res.status(404).json({success: false, message: 'Counter does not exist'});
    }
});

// Delete counter
app.delete('/counters/delete/:name', (req, res) => {
    const name = req.params.name;
    if (counters[name] !== undefined) {
        delete counters[name]; // Törlés az objektumból
        saveCounters();        // Mentés a fájlba
        res.sendStatus(204);
    } else {
        res.status(404).json({ success: false, message: "Nincs ilyen számláló." });
    }
});

// Increase 1 to the customersCounter
app.post('/increasecounter/:name', (req, res) => {
    const name = req.params.name;
    if(counters[name])
    {
        counters[name].value++;
        saveCounters();
        res.json({success: true, value: counters[name].value});
    }
    else
    {
        res.status(404).send();
    }

});

// Increase 1 to the customersCounter
app.get('/increasecounter/:name', (req, res) => {
    const name = req.params.name;
    if(counters[name])
    {
        counters[name].value++;
        saveCounters();
        res.json({success: true, value: counters[name].value});
    }
    else
    {
        res.status(404).send();
    }
});

// Decrease 1 to the customersCounter
app.post('/decreasecounter/:name', (req, res) => {
    const name = req.params.name;
    if(counters[name])
    {
        counters[name].value--;
        saveCounters();
        res.json({success: true, value: counters[name].value});
    }
    else
    {
        res.status(404).send();
    }
});

// Decrease 1 to the customersCounter
app.get('/decreasecounter/:name', (req, res) => {
    const name = req.params.name;
    if(counters[name])
    {
        counters[name].value--;
        saveCounters();
        res.json({success: true, value: counters[name].value});
    }
    else
    {
        res.status(404).send();
    }
});

// Set the customersCounter to 0
app.post('/reset/:name', (req, res) => {
    const name = req.params.name;
    if(counters[name])
    {
        counters[name].value = 0;
        saveCounters();
        res.json({success: true, value: counters[name].value});
    }
    else
    {
        res.status(404).send();
    }
});

app.post('/setlimit/:name/:limit', (req, res) => {
    const name = req.params.name;
    const newLimit = parseInt(req.params.limit);
    if(counters[name])
    {
        counters[name].limit = newLimit;
        saveCounters();
        res.json({success: true, value: counters[name].limit});
    }
    else
    {
        res.status(404).send();
    }
});

// statikus fájlok (ha van public/)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`✅ Szerver fut: http://localhost:${PORT}`);
});



