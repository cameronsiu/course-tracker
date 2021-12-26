console.log('Server-side code running');

const express = require('express');
const {MongoClient} = require('mongodb');
const app = express();

// serve files from the public directory
app.use(express.static('public'));
app.use(express.json());

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

// selenium
const {Builder, By, Key, until} = require('selenium-webdriver');
let num_list = [-1,-1];
let driver_list = [];
let driver = new Builder().forBrowser('firefox').build();
let driver2 = new Builder().forBrowser('firefox').build();
driver_list.push(driver);
driver_list.push(driver2);

async function build() {
  try {
    await driver.get('https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept=CPSC&course=221&section=201');
    await driver2.get('https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept=CPSC&course=213&section=205');
  } catch (err) {
    console.log(err);
  }
};
build();

async function getSeats() {
  try {
    const toggles = await db.collection('toggles').find().toArray();
    for (let i = 0; i < toggles.length; i++) {
      if (toggles[i].toggle) {
        await driver_list[i].navigate().refresh();
        num_list[i] = await driver.findElement(By.xpath("//table[4]/tbody/tr[3]/td[2]")).getText();
        console.log("Seats for " + toggles[i].dept + toggles[i].course + ": "+ num_list[i]);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// connect to the db
let db;
let intervalID = null;

async function main() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = await client.db("courseTracker");
  } catch (e) {
    console.error(e);
  }
  await startIntervals().catch(console.error);
}
main().catch(console.error);

async function startIntervals() {
  try {
    const toggles = await db.collection('toggles').find().toArray();
    if (toggles.some(course => course.toggle) && intervalID === null) {
      console.log("Starting intervals");
      intervalID = setInterval(getSeats, 20000);
    } else if (toggles.every(course => !course.toggle)) {
      console.log("Stopping intervals");
      clearInterval(intervalID);
      intervalID = null;
    }
  } catch (e) {
    console.error(e);
  }
}

// serve the hompage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//record the toggled event
app.post('/toggled', async (req, res) => {
  const toggle = req.body.toggle;
  const course = req.body.course;
  const toggleTime = {toggleTime: new Date()};
  await updateToggle(course, Object.assign({toggle: toggle}, toggleTime));
  startIntervals(req.body);
});

async function updateToggle(course, toggle) {
  const result = await db.collection('toggles').updateOne({course: course}, {$set: toggle});
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

//send the toggled event
app.get('/toggles', async (req, res) => {
  const result = await db.collection('toggles').find().toArray();
  res.send(result);
});