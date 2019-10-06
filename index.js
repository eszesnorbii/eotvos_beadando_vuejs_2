var Stack = require('spque').Stack;
let q = new Stack();
q.put(2);
q.put(4);
console.log(q.size, q.get());

const UjOsztaly = require('custom').UjOsztaly;
let ujOsztaly = new UjOsztaly();
console.log(ujOsztaly.f());

const express = require('express');
const app = express();

app.get('/', (req, res) => { res.send('Balhé! :)'); });
app.get('/cica', (req, res) => { res.send('Cica Balhé! :)'); });

app.listen(3000, () => console.log('App listening on port: 3000!'));
