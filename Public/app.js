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

async function SubmitLimit(id)
{
    let currentLimit = document.getElementById(id+'limit');
    let currentOperation = document.getElementById(id+'operation');
    let opForLink = currentOperation.options[currentOperation.selectedIndex].value;
    let name = id;
    const res = await fetch(address + '/setlimit/' +name+'/'+ currentLimit.value+'/'+opForLink, {method: 'POST'});

    await AddCounterToView();
}

async function AddCounterToView()
{
    const data = await GetAllCounters();

    let currentDataString=[];
    Object.entries(data).forEach(([key, body])=>{

        currentDataString.push(key+body.limit+body.operation+IsAlarm(body));
    });

    if (currentDataString.toString() !== lastDataString.toString()) {
        lastDataString = currentDataString;
        ClearView();

        Object.entries(data).forEach(([key, body]) => {
            let mainDiv = document.getElementById('MainDiv');

            let cardBodyElement = CounterCardCreation(key,body)

            cardBodyElement.appendChild(CardHeaderCreation(key,body));
            cardBodyElement.appendChild(CounterDisplayCreation(key));
            mainDiv.appendChild(cardBodyElement);
        });
    }
}

function CounterCardCreation(key,body)
{
    let counterCard = document.createElement('div');
    counterCard.classList.add('card');
    if(IsAlarm(body)) {
        counterCard.classList.add('card-bg-alarm');
    }
    else {
        counterCard.classList.add('card-bg');
    }
    counterCard.classList.add('col-md-12');
    counterCard.classList.add('text-center');
    counterCard.id = key + 'Card'
    return counterCard;
}

function CounterDisplayCreation(key)
{
    let counterDisplay = document.createElement('H5');
    counterDisplay.classList.add('h2');
    counterDisplay.classList.add('text-center');
    counterDisplay.textContent = 0;
    counterDisplay.id = key;
    return counterDisplay;
}

function CardHeaderCreation(key,body)
{
    let cardHearder = document.createElement('table');

    let headerTableRow = document.createElement('tr');
    let headerTableCell0 = document.createElement('th');
    let headerTableCell1 = document.createElement('th');
    let headerTableCell2 = document.createElement('th');

    let cardHeaderElement = document.createElement('div');

    cardHeaderElement.classList.add('card-header');
    cardHeaderElement.classList.add('h1');
    cardHeaderElement.id = key + "Key";


    headerTableRow.appendChild(headerTableCell0);
    headerTableCell1.appendChild(cardHeaderElement)
    headerTableRow.appendChild(headerTableCell1);
    headerTableCell2.appendChild(CounterSettingsCreation(key,body))
    headerTableRow.appendChild(headerTableCell2);
    headerTableRow.classList.add('header-row');
    cardHearder.appendChild(headerTableRow);

    return cardHearder;
}

function CounterSettingsCreation(key,body)
{
    let settingsDetails = document.createElement('details');

    let limitOperation = document.createElement('select');
    let limitInput = document.createElement('input');
    let limitButton = document.createElement('button');
    let limitLabel = document.createElement('label');

    let counterSettings = document.createElement('summary');
    let settingsElement = document.createElement('div');
    let settingsImg = document.createElement('img');

    let operations = ['nan','>','<','==','>=','<=','!=']
    for(i in operations)
    {
        let limitOperationOptions = document.createElement('option');
        limitOperationOptions.textContent = operations[i];
        limitOperationOptions.value = operations[i];
        limitOperation.appendChild(limitOperationOptions);
        console.log(body.operation);
    }
    limitOperation.value = body.operation;

    limitOperation.id=key+'operation';
    limitLabel.textContent = 'Alarm when value';
    limitLabel.classList.add('limit-label');
    limitButton.textContent = 'Submit';
    limitButton.classList.add('btn');
    limitButton.classList.add('submit-btn');
    limitButton.onclick = () => SubmitLimit(key);

    limitInput.type = 'number';
    limitInput.value = body.limit;
    limitInput.id = key + 'limit';


    settingsElement.appendChild(limitLabel);
    settingsElement.appendChild(limitOperation);
    settingsElement.appendChild(limitInput);
    settingsElement.appendChild(limitButton);

    settingsImg.src="Resources/Pictures/Icons/settings_icon.png"

    counterSettings.classList.add('btn');
    counterSettings.style.scale = '0.5';
    counterSettings.appendChild(settingsImg);

    settingsDetails.appendChild(counterSettings);
    settingsDetails.appendChild(settingsElement);

    return settingsDetails;
}



function IsAlarm(body)
{
    switch(body.operation) {
        case '>':  return body.value > body.limit;
        case '<':  return body.value < body.limit;
        case '==': return body.value == body.limit;
        case '>=': return body.value >= body.limit;
        case '<=': return body.value <= body.limit;
        case '!=': return body.value != body.limit;
        default:   return false; // 'nan' vagy ismeretlen esetén
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

