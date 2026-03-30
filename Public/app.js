const localhostAdd = window.location.hostname;

let address = 'http://' + localhostAdd +':8100';

let CountersNumberOnTheView = 1;

let lastDataString=[];

document.addEventListener("DOMContentLoaded", () => { AddCounterToView(); });

async function Counter()
{
    const data = await GetAllCounters();
    Object.entries(data).forEach(([key, body]) => {
        const header = document.getElementById(key+"Key")
        const counter = document.getElementById(key)

        header.textContent = key;
        counter.textContent = body.value;
    });
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
    document.getElementById('CounterName').value = '';
    await AddCounterToView();
}
async function DeleteCounter(counterName)
{
    let name = document.getElementById('CounterName').value.trim();
    const res = await fetch(address + '/counters/delete/' + name, {method: 'DELETE'});
    document.getElementById('CounterName').value = '';
    await AddCounterToView();
}

async function GetAllCounters()
{
    const res = await fetch(address + '/counters');
    const data = await res.json();
    return data;
}

async function AddCounterToView()
{
    const data = await GetAllCounters();

    let currentDataString=[];
    Object.entries(data).forEach(([key, body])=>{currentDataString.push(key)});

    if (currentDataString.toString() !== lastDataString.toString()) {
        lastDataString = currentDataString;
        ClearView();

        Object.entries(data).forEach(([key, body]) => {
            console.log(body.value);
            let mainDiv = document.getElementById('MainDiv');
            let cardBodyElement = document.createElement('div');
            let cardHeaderElement = document.createElement('div');
            let counterBodyElement = document.createElement('div');
            let counterElement = document.createElement('h5');


            cardBodyElement.classList.add('card');
            if(body.value>1) {
                cardBodyElement.classList.add('card-bg-alarm');
            }
            else {
                cardBodyElement.classList.add('card-bg');
            }
            cardBodyElement.classList.add('col-md-12');
            cardBodyElement.classList.add('text-center');
            cardBodyElement.id = key + 'Card'

            cardHeaderElement.classList.add('card-header');
            cardHeaderElement.classList.add('h1');
            cardHeaderElement.id = key + "Key";

            counterBodyElement.classList.add('card-body');
            counterBodyElement.classList.add('row');
            counterBodyElement.classList.add('m-4');

            counterElement.classList.add('h2');
            counterElement.classList.add('text-center');
            counterElement.textContent = 0;
            counterElement.id = key;


            cardHeaderElement.appendChild(counterBodyElement);
            cardBodyElement.appendChild(cardHeaderElement);
            cardBodyElement.appendChild(counterElement);
            mainDiv.appendChild(cardBodyElement);
        });
    }
}

async function ClearView()
{
    let mainDiv = document.getElementById('MainDiv');

    // Csak a generált kártyákat töröljük, a "Számlálók szerkesztése" részt NE!
    // Ehhez érdemes a generált kártyáknak egy külön konténert adni a HTML-ben,
    // vagy csak azokat a gyerekeket törölni, amiknek van 'card' osztálya.
    const cards = mainDiv.querySelectorAll('.card');
    cards.forEach(card => card.remove());
}

setInterval(Counter, 1000);
setInterval(AddCounterToView, 2000);