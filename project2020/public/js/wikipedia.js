// the URL to get the description from
let searchUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
// error message which is displayed for wrong inputs
const error = "https://mediawiki.org/wiki/HyperSwitch/errors/not_found";

// get input from input-field
function setQuery() {
	var arg = document.getElementById("search-wikipedia").value;
  fetchData(arg);
}

// open given URL + search argument form input-field and parse it to json file
function fetchData(arg) {
  // open URL
  fetch(searchUrl + arg)
    // parse it
    .then(res => res.json())
    .then((out) => {
      // give json to gotSearch func
      gotSearch(out);
  })
  .catch(function() {
	});
}

// open parts of the json file and read it out loud
function gotSearch(data) {
  console.log(data.extract);
  // if first element of json file matches error text show error
  if (data.type != error) {
    // setup Text-to-speech
    var msg = new SpeechSynthesisUtterance();
    msg.text = data.extract;
    msg.lang = "en";
    msg.volume = 0.8;

    // speech output
    window.speechSynthesis.speak(msg);

    // deactivate button when speaking to prevent many inputs and to prevent queing
    msg.onstart = function() {
      console.log("Onend");
      document.getElementById("searchButton").disabled = true;
    }
    // activate it again after speech output is done
    msg.onend = function() {
      console.log("Onstart");
      document.getElementById("searchButton").disabled = false;
    }
  }
  // error message for wrong inputs
  else {
    alert("There is no result for the entered word!");
  }
}
