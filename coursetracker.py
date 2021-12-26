from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Firefox()
driver.get("https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept=CPSC&course=221&section=201")
print(driver.title)
element = driver.find_elements(By.XPATH, "//table[4]/tbody/tr[3]/td[2]")
for e in element:
    num_of_seats = e.text
print(num_of_seats)
driver.quit()
