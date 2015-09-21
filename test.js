var app = require('.')()

app.get('/', function * () {
  this.body = 'Hello World!'
})

app.run()
