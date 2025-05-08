const api_url ="https://zenquotes.io/api/quotes/";

async function getapi(url)
{
    const response = await fetch(url);
    var data = await response.json();
    console.log(data);
    document.getElementById("qotp").innerText = `"${data[0].q}" — ${data[0].a}`;
}

getapi(api_url);

if (annyang) {
    const commands = {
        'hello': () => { alert('Hello world!'); },
        'change the color to *color': (color) => {document.body.style.backgroundColor = color;},
        'navigate to *page': (page) => {
            const lowercase = page.toLowerCase();
            if (lowercase === 'home') {
                window.location.href = 'inst377_a2.html'
            } else if (pageLower === 'stocks') {
                window.location.href = 'inst377_a2_stocks.html';
            } else if (pageLower === 'dogs') {
                window.location.href = 'inst377_a2_dogs.html';
            }
        },
        'load dog breed *breed': (breed) => loadDogInfo(breed)
    };
    annyang.addCommands(commands);
}

async function enableListening() {
    if(annyang) {
        annyang.start();
    }
}

async function disableListening() {
    if(annyang) {
        annyang.abort();
    }
}

// stocks

async function getStocks() {
    const ticker = document.getElementById('ticker');
    const days = parseInt(document.getElementById('days').value);
    const startDay = new Date();
    const endDay = new Date();
    startDay.setDate(endDay.getDate() - days);

    const start = startDay.toISOString().split('T')[0];
    const end = endDay.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120&apiKey=mEvTefkOdYfuSghmmZs65JfcdPjeesLM}`;

    const response = await fetch(url);
    const data = await response.json();

    const labels = data.results.map(line => new Date(line.t).toLocaleDateString());
    const prices = data.results.map(line => line.c);

    makeChart(labels, prices);
}

async function makeChart(labels, prices) {
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Prices',
          data: prices,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
}

async function getTopFive() {
    const url = "https://tradestie.com/api/v1/apps/reddit?date=2022-04-03";

    const response = await fetch(url);
    var data = await response.json();

    data = data.slice(0,5);
    const table = document.getElementById('table');
    const tableBody = table.appendChild(document.createElement('tbody'));

    data.forEach(stock => {
        const tableRow = document.createElement("tr");
        const rowTicker = document.createElement("td");
        rowTicker.innerHTML = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
        tableRow.appendChild(rowTicker);
    
        const rowComments = document.createElement("td");
        rowComments.textContent = stock.no_of_comments;
        tableRow.appendChild(rowComments);
    
        const rowSentiment = document.createElement("td");
        const sentiment = stock.sentiment;
        const trend = document.createElement("img");
    
        if (sentiment === "Bullish") {
            trend.src = "https://cdn-icons-png.freepik.com/128/1606/1606571.png";
        } else {
            trend.src = "https://cdn-icons-png.freepik.com/128/1606/1606570.png";
        }
    
        rowSentiment.append(trend);
        tableRow.appendChild(rowSentiment);
        tableBody.appendChild(tableRow);
        });
}
getTopFive();

// dogs

async function makeCarousel() {
    const carousel = document.getElementById('carousel');

    for(let i = 0; i < 10; i++) {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        const img = document.createElement('img');
        img.src = data.message;
        carousel.appendChild(img);
    }

    simpleslider.getSlider({
        container: carousel,
        transitionTime: 1,
        delay: 3.5
    });
}

makeCarousel();

async function loadDogBreeds() {
    const response = await fetch('https://dogapi.dog/api/v2/breeds');
    const data = await response.json();
    const breeds = data.data;
    const dogButtons = document.getElementById('dog-buttons');

    breeds.forEach(breed => {
        const button = document.createElement('button');
        button.setAttribute('class', 'button-92');
        button.setAttribute('data-breed-id', breed.id);
        button.textContent = breed.attributes.name;
        button.addEventListener('click', () => loadDogInfo(breed));

        dogButtons.appendChild(button);
    });
}

loadDogBreeds();

async function loadDogInfo(breed) {
    const info = document.getElementById('info');
    info.innerHTML = `
      <p>${breed.attributes.name}</p>
      <p>${breed.attributes.description || "n/a"}</p>
      <p>min life: ${breed.attributes.life.min} years</p>
      <p>max life: ${breed.attributes.life.max} years</p>
    `;
}