var express = require('express');
var app = express();

var routes = require('./routes');



app.use('/', routes);


app.listen(3000, function() {
    console.log("Swag Shop API running on port 3000...");
});