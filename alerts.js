const express = require('express')
const app = express()
const handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.set('port', 3737)     // Set Node.js to load page on local host port 3737
app.use(express.static('views'))

// Load main page (/views/index.handlebars)
app.get('/', function(req, res){
    var context = {};

    var rows_list = []
    const Papa = require('papaparse');
    const fs = require('fs');
    var data = Papa.parse(fs.createReadStream('views/csv/result_agg.csv'), {
        delimiter: ',',
        dynamicTyping: true,
        newline: '\n',
        skipEmptyLines: false,
        complete: function (results) {
            context['headers'] = results.data[0];
            for (var i = 1; i < results.data.length; i ++) {
                var rows = {};
                rows['number'] = results.data[i][0];
                rows['id'] = results.data[i][1];
                rows['alerts'] = results.data[i][2];
                rows['datapoints'] = results.data[i][3];
                rows['devices'] = results.data[i][4];
                rows_list.push(rows);
            }
            context['dataList'] = rows_list;
            res.render('index', context);
        }
    });
});

// 404 Page Not Found Error Handler
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

// 500 Server Error handler
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port'));
});