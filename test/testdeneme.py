import time
from selenium import webdriver

# Example codes
# driver = webdriver.Chrome('chromedriver')  # Optional argument, if not specified will search path.
# driver.get('http://www.google.com/');
# time.sleep(5) # Let the user actually see something!
# search_box = driver.find_element_by_name('q')
# search_box.send_keys('srs')
# search_box.submit()
# time.sleep(5) # Let the user actually see something!
# driver.quit() 

# pageURL = "localhost:.."
pageURL = "https://twitter.com/login?lang=tr"

user_id = "asfasfa"
user_password = "lelele"

driver = webdriver.Chrome('chromedriver')
driver.get(pageURL);
time.sleep(5);

id_input       = driver.find_element_by_xpath("//*[@id='react-root']/div/div/div[2]/main/div/div/form/div/div[1]/label/div/div[2]/div/input")
id_input.send_keys(user_id)
password_input = driver.find_element_by_xpath("//*[@id='react-root']/div/div/div[2]/main/div/div/form/div/div[2]/label/div/div[2]/div/input")
password_input.send_keys(user_password)

login_button = driver.find_element_by_xpath("//*[@id='react-root']/div/div/div[2]/main/div/div/form/div/div[3]/div/div")
login_button.click()

# To scroll down the page
# lenOfPage = browser.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
# match=False
# while(match==False):
#     lastCount = lenOfPage
#     time.sleep(3)
#     lenOfPage = browser.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
#     if lastCount == lenOfPage:
#         match=True
# time.sleep(5)


time.sleep(10)
driver.quit() 
