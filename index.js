import express from 'express';
import {engine} from 'express-handlebars';
import got from 'got';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 80;
const APITOKEN = process.env.IEX_CLOUD_API_TOKEN

// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// create call_api function
function call_api(finishedAPI, ticker) {
	// Pleae use your own API token from https://iexcloud.io/cloud-login#/register/ . It's easy and free.
	// The API token should look like this example token: pk_062031d20883444f9ea74e2610fe2011
	got.get('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=' + APITOKEN, {responseType: 'json'}).then(res => {
		if (res.err) {return console.log(res.err);}
		// status codes 200-299
		if (res.ok) {
			// console.log(res.body);
			finishedAPI(res.body);
		};
	}).catch(err => {
		console.log('Error: ', err.message, " | Ticker: ", ticker);
	});
};

// set handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// set handlebar index GET route
app.get('/', function (req, res) {
	call_api(function(doneAPI) {
			res.render('home', {
	    	stock: doneAPI,
    	});
	}, "aapl");
});

// set handlebar index POST route
app.post('/', function (req, res) {
	call_api(function(doneAPI) {
			// console.log(doneAPI);
			// posted_stuff = req.body.stock_ticker;
			res.render('home', {
	    	stock: doneAPI,
    	});
	}, req.body.stock_ticker);
});

// create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

app.listen(PORT, () => console.log('Server listening on port ' + PORT));