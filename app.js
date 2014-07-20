var express = require('express'),
	app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index', {
		data: {
			title: 'Particle System',
			caption: 'Built with Three.js'
		}
	});
});

console.log('Listening to port 3000')
app.listen(3000);