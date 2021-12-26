// selenium 
const {Builder, By, Key, until} = require('selenium-webdriver');
let num;

async function main() {
    let driver = await new Builder().forBrowser('firefox').build();  
    try {
        await driver.get('https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept=CPSC&course=221&section=201');
        num = await driver.findElement(By.xpath("//table[4]/tbody/tr[3]/td[2]")).getText();
        console.log(num);
    } catch (err) {
        console.log(err);
    }
};
main();