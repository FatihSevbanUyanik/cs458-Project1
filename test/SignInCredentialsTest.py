import time
import datetime
import unittest

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


'''
This is the test class for empty credentials in Sign In Page
'''
class SignInCredentialsTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("chromedriver")

    def test_search_in_python_org(self):
        # driver
        driver = self.driver
        
        # ids
        self.pageURL = "http://localhost:3000/sign-in"
        self.linkForgotPasswordId = "forgot"
        self.userInputId = "exampleInputUserId"
        self.resetPasswordEmailBtnId = 'request-btn'
        self.passwordResetChangeBtnId = "change-btn"
        self.passwordInputId = "exampleInputPassword1"
        self.passwordResetInputId = "exampleInputPassword1"
        self.passwordResetEmailInputId = "exampleInputUserId"
        self.passwordResetConfirmInputId = "exampleInputPassword2"
        
        # connect to web site
        self.try_connect(driver, self.pageURL)

        self.test_logs = []
        # check conditions

        # username = ""
        # password = ""
        self.test_login_credentials(driver, "", "", "SignInCredentialsTest")

        # username = "enes"
        # password = "12"
        self.test_login_credentials(driver, "", "12", "SignInCredentialsTest")

        # username = "enes"
        # password = ""
        self.test_login_credentials(driver, "enes", "", "SignInCredentialsTest")

        # username = "enes"
        # password = "12345"
        self.test_login_credentials(driver, "enes", "12345", "SignInCredentialsTest")

        # username = "enes"
        # password = "123456"
        self.test_login_credentials(driver, "enes", "123456", "SignInCredentialsTest")
        time.sleep(3)

        # Check remember me feature
        # username = "enes"
        # password = "123456"
        self.test_login_remember_me(driver, "enes", "123456", "SignInCredentialsTest")
        
        self.test_forgot_password(driver, 'fatihsevban15@gmail.com', 'naruto1212')

        self.write_logs_file(self.test_logs, "SignInCredentialsTest")


    def test_login_remember_me(self, driver, username, password, className):
        result_login = self.test_login(driver, username, password, className, True)
        date = datetime.datetime.now().strftime("%c")
        
        result = f"{date}:\n" + \
                 f"{className}:\n" +\
                 f"username={username}\n" +\
                 f"password={password}\n" +\
                 f"logged_in: {result_login['isLoggedIn']}\n" +\
                 f"error: {result_login['error']}\n" +\
                 f"Remember me feature works: {str(result_login['rememberMeWorks'])}\n" +\
                 "***************************"
        
        self.test_logs.append(result)
        
    
    def test_login_credentials(self, driver, username, password, className):
        result_login = self.test_login(driver, username, password, className, False)
        date = datetime.datetime.now().strftime("%c")

        result = f"{date}:\n" + \
                 f"{className}:\n" +\
                 f"username={username}\n" +\
                 f"password={password}\n" +\
                 f"logged_in: {result_login['isLoggedIn']}\n" +\
                 f"error: {result_login['error']}\n" +\
                 "***************************"
                 
        self.test_logs.append(result)
        

    def test_login(self, driver, username, password, className, checkRememberMe):
        error = ""
        remember_me = False
        logged_in = False
        remember_me_works = False
        
        password_message_is_displayed = False
        username_message_is_displayed = False


        try:
            # get the username element
            username_input = driver.find_element_by_id(self.userInputId)

            # fill the username element
            username_input.clear()
            username_input.send_keys(username)

            # get the password element
            password_input = driver.find_element_by_id(self.passwordInputId)

            # fill the password element
            password_input.clear()
            password_input.send_keys(password)

            remember_me_checkbox = driver.find_element_by_id("gridCheck")
            if ( not remember_me_checkbox.is_selected() & checkRememberMe):
                remember_me_checkbox.click()

            # click login
            login_button = driver.find_element_by_id("login-btn")
            login_button.click()
            print("Checkbox: " + str(remember_me_checkbox.is_selected()), end="\n")

            # check whether a new page has opened or not
            # wait for 5 sec
            time.sleep(5)

            logged_in = True
            if self.pageURL == driver.current_url:
                logged_in = False
                password_message = driver.find_element_by_id("vPassMessage")
                if password_message != "":
                    password_message_is_displayed = True
                username_message = driver.find_element_by_id("vEmailMessage")
                if username_message != "":
                    username_message_is_displayed = True
            else:
                # driver.get(self.pageURL)  --> Old method
                time.sleep(3)
                driver.find_element_by_id("logout-button").click()
                if checkRememberMe:
                    username_input_compare = driver.find_element_by_id(self.userInputId).text
                    password_input_compare = driver.find_element_by_id(self.passwordInputId).text
                    if ((not (username_input_compare != "")) & (not (password_input_compare != ""))):
                        remember_me_works = True
                
        except Exception as e:
            error = str(e)
        finally:
            if error == "":
                error = "No Error"
            
            return {"isLoggedIn": str(logged_in), "error": error, "rememberMeWorks": remember_me_works,
                    "username_message": str(username_message_is_displayed), "password_message": str(password_message_is_displayed)}
        
    def test_forgot_password(self, driver, email, newPassword):
        # wating the page to load.
        time.sleep(2)

        # click forgot password link.
        forgot_password_link = driver.find_element_by_id(self.linkForgotPasswordId)
        forgot_password_link.click()
        time.sleep(2)
        
        # enter email for password reset.
        password_reset_email_input = driver.find_element_by_id(self.passwordResetEmailInputId)
        password_reset_email_input.send_keys(email)
        time.sleep(2)
        
        # clicking button for password reset.
        reset_password_email_button = driver.find_element_by_id(self.resetPasswordEmailBtnId)
        reset_password_email_button.click()
        time.sleep(2)
        
        # updating password reset.
        password_reset_input = driver.find_element_by_id(self.passwordResetInputId)
        password_reset_confirm_input = driver.find_element_by_id(self.passwordResetConfirmInputId)
        password_reset_change_button = driver.find_element_by_id(self.passwordResetChangeBtnId)

        password_reset_confirm_input.send_keys(newPassword)
        password_reset_input.send_keys(newPassword)
        password_reset_change_button.click()
        time.sleep(2)


    def write_logs_file(self, logs, className):
        try:
            with open(className + "_logs.txt", "w", encoding="UTF-8") as file:
                for log in logs:
                    file.write(log + "\n")
        except:
            print(className + "An error is occured while writing log file")


    def try_connect(self, driver, pageURL):
        try:
            driver.get(pageURL)
        except:
            raise Exception("Couldn't connect. Check your Internet connection")


    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
