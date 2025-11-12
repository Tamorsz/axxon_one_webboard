const localhostAdd = 'http://localhost';

let address = localhostAdd +':8100';

async function Counter()
{
    const res = await fetch(address + '/counters/customersCounter');
    const data = await res.json();
    const count = document.getElementById('counter');
    count.textContent = data.value;
}

async function ResetCounter(counterName)
{
    const res = await fetch(address + `/reset/${counterName}`, { method: 'POST' });
    const data = await res.json();
    document.getElementById('counter').textContent = data.value;
}

async function IncreaseCounter(counterName) {
    const res = await fetch(address + `/increasecounter/${counterName}`, {method: 'POST'});
    const data = await res.json();
}

async function DecreaseCounter(counterName)
{
    const res = await fetch(address + `/decreasecounter/${counterName}`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
    });
    const data = await res.json();
}

async function AddCounter()
{
    let name = document.getElementById('CounterName').value.trim();
    const res = await fetch(address + '/counters/add/' + name, {method: 'POST'});
}


setInterval(Counter, 1000);