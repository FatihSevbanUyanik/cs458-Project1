import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import datetime

import time

'''
This is the test class for empty credentials in Sign In Page
'''


class SignInCredentialsTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("chromedriver")

    def test_search_in_python_org(self):
        driver = self.driver
        self.pageURL = "http://www.python.org"

        self.try_connect(driver, pageURL)

        test_logs = []

        # check conditions

        # username = ""
        # password = ""
        test_login(driver, test_logs, username="", password="", className="SignInCredentialsTest")

        # username = ""
        # password = "12345"
        test_login(driver, test_logs, username="", password="12345", className="SignInCredentialsTest")

        # username = "username"
        # password = ""
        test_login(driver, test_logs, username="username", password="", className="SignInCredentialsTest")

        # username = "username"
        # password = "12345"
        test_login(driver, test_logs, username="", password="12345", className="SignInCredentialsTest")

        write_logs_file(test_logs, "SignInCredentialsTest")

    def write_logs_file(self, logs, className):
        try:
            with open(className + "_logs.txt", "w", encoding="UTF-8") as file:
                for log in logs:
                    file.write(log + "\n")
        except:
            print(className + "An error is occured while writing log file")

    def test_login(self, driver, logs, username, password, className):
        error = ""
        try:
            # get the username element
            # username_input = driver.find_element_by_xpath(...)

            # fill the username element
            # username_input.send_keys(username)

            # get the password element
            # password_input = driver.find_element_by_xpath(...)

            # fill the password element
            # password_input.send_keys(password)

            # click login
            # login_button = driver.find_element_by_xpath(...)
            # login_button.click()

            # check whether a new page has opened or not
            # wait for 5 sec
            time.sleep(5)
            
            logged_in = True
            if self.pageURL != driver.current_url :
                logged_in = False
        except Exception as e:
            error = str(e)
        
        if error == "":
            error = "No Error"

        result = datetime.datetime.now().strftime("%c") + ":" + className + ": \n" \
            + "username=" + username + "\npassword=" + password + "\nlogged_in: " + logged_in + "\nerror: " + error
        return

    def try_connect(self, driver, pageURL):
        try:
            driver.get(pageURL)
        except:
            raise Exception("Couldn't connect. Check your Internet connection")

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
