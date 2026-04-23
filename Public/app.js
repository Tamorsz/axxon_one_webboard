const localhostAdd = window.location.hostname;

let address = 'http://' + localhostAdd +':8100';

let CountersNumberOnTheView = 1;

let lastDataString = [];

let isFirstLoad = false;

let loggedIn = false;


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
    loggedIn = document.getElementById("userCheckbox").checked;
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

async function IncreaseCounter(counterName)
{
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
    await AddCounterToView();
}

async function UserLogin(username, password)
{
    const res = await fetch(address + '/users/login/'+username+'/'+password, {method: 'POST'});
}

async function DeleteCounter(counterName)
{
    console.log(counterName);
    const res = await fetch(address + '/counters/delete/' + counterName, {method: 'DELETE'});
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

    let mainDiv = document.getElementById('MainDiv');
    let menuBarGrid = document.createElement('div');
    let menuGrid = document.createElement('div');
    menuBarGrid.classList.add('menuBarGrid');
    // menuGrid.classList.add('menuGrid');

    if(!isFirstLoad) {
        menuBarGrid.appendChild(CounterCreatorButton());
        menuBarGrid.appendChild(UserCardButton());
        menuBarGrid.appendChild(ExportAllCountersButtons());
        menuGrid.appendChild(CounterCreatorCreation());

        menuGrid.appendChild(UserCardCreation());

        mainDiv.appendChild(menuBarGrid);
        mainDiv.appendChild(menuGrid);
        isFirstLoad = true;
    }

    let currentDataString=[];
    Object.entries(data).forEach(([key, body])=>{

        currentDataString.push(key+body.limit+body.operation+IsAlarm(body)+loggedIn);
    });



    if (currentDataString.toString() !== lastDataString.toString()) {
        lastDataString = currentDataString;
        ClearView();

        Object.entries(data).forEach(([key, body]) => {

            let cardBodyElement = CounterCardCreation(key,body)



            cardBodyElement.appendChild(CardHeaderCreation(key,body));
            cardBodyElement.appendChild(CounterDisplayCreation(key));
            cardBodyElement.appendChild(CounterSettingsCreation(key,body));
            mainDiv.appendChild(cardBodyElement);
        });
    }
}

function CounterCreatorCreation()
{
    let addDiv = document.createElement('div');
    addDiv.id = 'CounterCreatorCreationCard';

    let counterAdditionMenu = document.createElement('div');
    counterAdditionMenu.id='counterAdditionMenu';
    counterAdditionMenu.hidden=true;


    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('card-bg');
    cardDiv.classList.add('text-center');

    let cardHead = document.createElement('div');
    cardHead.classList.add('card-header');
    cardHead.classList.add('h1');
    cardHead.innerText = 'New counter';

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.classList.add('row');
    cardBody.classList.add('m-4');

    let cardInput = document.createElement('input');
    cardInput.type='text';
    cardInput.id='CounterName';

    let createButton = document.createElement('button');
    createButton.classList.add('btn');
    createButton.classList.add('text-bg-warning');
    createButton.innerText = 'Create';
    createButton.onclick=()=>{
        CreateCounter();
        counterAdditionMenu.hidden=true;
        cardInput.value = '';
    }

    cardBody.appendChild(cardInput);
    cardBody.appendChild(createButton);


    cardDiv.appendChild(cardHead);

    cardDiv.appendChild(cardBody);
    counterAdditionMenu.appendChild(cardDiv);

    // addDiv.appendChild(plusImg);
    addDiv.appendChild(counterAdditionMenu);
    return addDiv;

}

function CounterCreatorButton()
{
    let addDiv = document.createElement('div');

    let plusImg = document.createElement('img');
    plusImg.src='Resources/Pictures/Icons/plusSign.png';
    plusImg.classList.add('clickable-img');
    plusImg.height=50;
    plusImg.width=50;

    plusImg.onclick = () => {
        let counterAdditionMenu = document.getElementById('counterAdditionMenu');
        let userCardMenu = document.getElementById('UserCardCreationCard');
        if(loggedIn) counterAdditionMenu.hidden = !counterAdditionMenu.hidden;
        userCardMenu.hidden = true;
    }

    addDiv.appendChild(plusImg);

    // console.log(counterAdditionMenu.hidden)

    return addDiv;
}

function UserCardCreation()
{
    let userDiv = document.createElement("div");
    userDiv.id = 'UserCardCreationCard';
    userDiv.hidden = true;

    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('card-bg');
    cardDiv.classList.add('text-center');

    let cardHead = document.createElement('div');
    cardHead.classList.add('card-header');
    cardHead.classList.add('h1');
    cardHead.innerText = 'User';

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.classList.add('row');
    cardBody.classList.add('m-4');

    let userCheckbox = document.createElement('input');
    userCheckbox.type='checkbox';
    userCheckbox.id='userCheckbox';
    userCheckbox.innerText = 'Administrator';

    let userCheckboxLabel = document.createElement('label');
    userCheckboxLabel.classList.add('userCheckboxLabel');
    userCheckboxLabel.innerText = 'Administrator';

    if(!loggedIn) {
        userCheckbox.checked=false;
    }


    cardBody.appendChild(userCheckboxLabel);
    cardBody.appendChild(userCheckbox);

    cardDiv.appendChild(cardHead);
    cardDiv.appendChild(cardBody);

    userDiv.appendChild(cardDiv);

    return userDiv;
}

function UserCardButton()
{
    let userDiv = document.createElement("div");
    let userIcon = document.createElement('img');
    userIcon.src='Resources/Pictures/Icons/userIcon.png';
    userIcon.classList.add('clickable-img');
    userIcon.height=50;

    userIcon.onclick=()=>{
        let userCardMenu = document.getElementById('UserCardCreationCard');
        let counterAdditionMenu = document.getElementById('counterAdditionMenu');
        userCardMenu.hidden = !userCardMenu.hidden;
        counterAdditionMenu.hidden=true;
    }


    userDiv.appendChild(userIcon);
    return userDiv;
}


function CounterCardCreation(key,body)
{
    let counterCard = document.createElement('div');
    counterCard.classList.add('card');
    counterCard.classList.add('counter-card');
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
    if(loggedIn) headerTableCell2.appendChild(CounterSettingsButton(key));
    headerTableRow.appendChild(headerTableCell2);
    headerTableRow.classList.add('header-row');
    cardHearder.appendChild(headerTableRow);

    return cardHearder;
}

function CounterSettingsCreation(key,body)
{
    let settingsDetails = document.createElement('div');

    let limitOperation = document.createElement('select');
    let limitInput = document.createElement('input');
    let limitButton = document.createElement('button');
    let limitLabel = document.createElement('label');

    let settingsElement = document.createElement('div');

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
    limitLabel.textContent = 'Alarm if: ' + body.name;
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

    settingsDetails.appendChild(settingsElement);
    settingsDetails.id = key+'Settings-Details';
    settingsDetails.hidden = true;

    settingsDetails.appendChild(CounterEditElements(key,body));


    return settingsDetails;
}

function CounterSettingsButton(key)
{
    let counterSettingsButton = document.createElement('img');
    counterSettingsButton.src='Resources/Pictures/Icons/settings_icon.png'
    counterSettingsButton.classList.add('clickable-img');
    counterSettingsButton.height = 50;
    counterSettingsButton.style.margin='10px';

    counterSettingsButton.onclick = () => {
        let details = document.getElementById(key+'Settings-Details');
        console.log('asd');
        details.hidden = !details.hidden;
    };

    return counterSettingsButton;
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

function CounterEditElements(key,body)
{
    let editDetails = document.createElement('div');
    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    console.log(body.name);
    deleteButton.onclick = () => DeleteCounter(body.name);

    editDetails.appendChild(deleteButton);
    editDetails.id = key+'EditElements';
    return editDetails;
}

async function ExportAllCounters() {
    let data = await GetAllCounters();
    console.log(data);
    let csvString = 'Counter name;Count'
    Object.entries(data).forEach(([key, body]) => {
        csvString += "\n" + key + ";" + body.value;
    });
    console.log(csvString);
    return csvString;
}

function ExportAllCountersButtons()
{
    let exportToCsvButton = document.createElement('img');
    exportToCsvButton.src='Resources/Pictures/Icons/saveToCsv.png'
    exportToCsvButton.classList.add('clickable-img');
    exportToCsvButton.height = 50;
    exportToCsvButton.onclick = async () => {
        let d = new Date();
        DownloadFile(await ExportAllCounters(), "All_counters_" + d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds());
    };

    return exportToCsvButton;
}

function DownloadFile(content, fileName) {
    const blob = new Blob(["\ufeff" +content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Itt javasolhatsz nevet
    a.click();
    window.URL.revokeObjectURL(url);
}


async function ClearView()
{
    let mainDiv = document.getElementById('MainDiv');

    // Csak a generált kártyákat töröljük, a "Számlálók szerkesztése" részt NE!
    // Ehhez érdemes a generált kártyáknak egy külön konténert adni a HTML-ben,
    // vagy csak azokat a gyerekeket törölni, amiknek van 'card' osztálya.
    const cards = mainDiv.querySelectorAll('.counter-card');
    cards.forEach(card => card.remove());
}

setInterval(Counter, 1000);
setInterval(AddCounterToView, 2000);

