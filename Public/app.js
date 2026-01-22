const localhostAdd = 'http://localhost';

let address = localhostAdd +':8100';

let CountersNumberOnTheView = 1;

async function Counter()
{
    const res = await fetch(address + '/counters/customersCounter');
    const data = await res.json();
    const count = document.getElementById(`counter`);
    count.textContent = data.value;
}

async function ResetCounter(counterName)
{
    const res = await fetch(address + `/reset/${counterName}`, { method: 'POST' });
    const data = await res.json();
    document.getElementById(`counter${CountersNumberOnTheView}`).textContent = data.value;
}

async function ExportCounter(counterName)
{
    return;
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

async function CreateCounter()
{
    let name = document.getElementById('CounterName').value.trim();
    const res = await fetch(address + '/counters/create/' + name, {method: 'POST'});
}

async function GetAllCounters()
{
    const res = await fetch(address + '/counters');
    const data = await res.json();
    console.log(data);
}

async function AddCounterToView(counter)
{
   // await GetAllCounters();
    let cardBody = document.getElementById('countersBody');
    let counterElement = document.createElement('H5');
    counterElement.textContent = counter.value;
    counterElement.id = 'counter';
    cardBody.appendChild(counterElement);
}

setInterval(Counter, 1000);