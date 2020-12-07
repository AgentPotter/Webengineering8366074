// global arrays with the values of the coordinate axis
const xLabels = [];
const yValues = [];
// alphavantage API key
var key = "YT8JVQ53S04FDWBN";

// add event to input field
const searchbox = document.querySelector('.search-companyStock');
searchbox.addEventListener('keypress', setQuery);

// update chart with new stock when enter is pressed inside the input field
function setQuery(evt) {
  if (evt.keyCode == 13) {
	stock = searchbox.value
  // destroy the old chart if exist to prevent drawing issues
  myChart.destroy();
  drawChart(stock);
  }
}

// draw stock chart of IBM on start
drawChart("IBM");

// draw a chart with the given x- and y-coordinates
async function drawChart(symbol) {
  // get data from the API
  await getData(symbol);
  //draw the chart
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      // set the specific properties of the chart
      data: {
          labels: xLabels,
          datasets: [{
              label: "USD",
              data: yValues,
              borderColor: "#ed6e4d",
              borderWidth: 1,
              pointBorderColor: "#ed6e4d"
          }]
      },
      // optional properties to adapt the chart
      options: {
        lineTension: 0,
        responsive: true
      }
  });
}

// gets stock data from the alpha vantage API
async function getData(symbol, enteredDate) {
  // get data and parse it into a json file
  const response = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol + "&apikey=" + key);
  const data = await response.json();

  // errors for invalid input or when maximum of API calls is reached
  const error = "Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY_ADJUSTED.";
  const limit = "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.";

  // alert if the input was invalid
  if(data['Error Message'] == error){
    alert("The entered stock symbol doesn't exist! Look for the correct symbol in a stock symbol list!");
  }
  // alert if maximum API calls are reached
  else if (data.Note == limit) {
    alert("Max. limit reached! Please wait a minute or so!");
  }
  else {
    // clear x and y values
    while(yValues.length > 0 || xLabels.length > 0) {
      yValues.pop();
      xLabels.pop();
    }
    // reverse add all dates displayed in the json file into the x values
    // because the dates are displayed the other way around in the JSON file
    for(var date in data['Time Series (Daily)']) {
      xLabels.unshift(date);
    }
    // add all y values to the given x values
    for(i = 0; i < xLabels.length; i++) {
      var temp = data['Time Series (Daily)'][xLabels[i]]['2. high'];
      yValues.push(temp);
    }

    // get the current date from the json file
    var currentDate = data['Meta Data']['3. Last Refreshed'];

    // get some more informations to display next to the chart
    // safe them do <div> with specific Id
    document.getElementById('symbol').innerHTML = "Symbol: " + data['Meta Data']['2. Symbol'];
    document.getElementById('date').innerHTML = "Date: " + currentDate;
    document.getElementById('value').innerHTML = "Todays highest value: " + data['Time Series (Daily)'][currentDate]['2. high'];
    document.getElementById('max').innerHTML = "Max. last 95 days: " + Math.max(...yValues);
    document.getElementById('min').innerHTML = "Min. last 95 days: " + Math.min(...yValues);
  }
}
