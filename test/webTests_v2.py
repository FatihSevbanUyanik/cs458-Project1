import time
import datetime
from selenium import webdriver


class Tester:
   
   def __init__(self):
      super().__init__()
      
      # =========================================
      # Properties
      # =========================================
      self.pageURL = "http://localhost:3000/sign-in"
      self.class_name = 'SignInCredentialsTest'
      self.test_logs = []
      self.setup_tester()
      
      # sign in properties
      self.email_or_username_input_id = "exampleInputUserId"
      self.password_input_id = "exampleInputPassword1"
      self.login_button_id = "login-btn"
      self.logout_button_id = "logout-button"
      self.remember_me_check_box_id = 'gridCheck'
      self.username_warning_message_id = "vEmailMessage"
      self.password_warning_message_id = "vPassMessage"

      # forgot password properties
      self.forgot_password_link_id = "forgot"
      self.reset_password_email_button_id = 'request-btn'
      self.reset_password_change_button_id = "change-btn"
      self.reset_password_input_id = "exampleInputPassword1"
      self.reset_password_email_input_id = "exampleInputUserId"
      self.reset_password_confirm_input_id = "exampleInputPassword2"
   
   def setup_tester(self):
      try:
         self.driver = webdriver.Chrome('chromedriver.exe')
      except:
         raise Exception("Couldn't connect. Check your Internet connection")
      
   def tearDown(self):
      self.driver.close()
   
      
   def test_forgot_password(self, email, new_password):
      error = ""
   
      try:
         # click forgot password link.
         forgot_password_link = self.driver.find_element_by_id(self.forgot_password_link_id)
         forgot_password_link.click()
         time.sleep(2)
        
         # enter email for password reset.
         reset_password_email_input = self.driver.find_element_by_id(self.reset_password_email_input_id)
         reset_password_email_input.send_keys(email)
         time.sleep(2)
        
         # clicking button for password reset.  
         reset_password_email_button = self.driver.find_element_by_id(self.reset_password_email_button_id)
         reset_password_email_button.click()
         time.sleep(2)
        
         # updating password reset.
         password_reset_input = self.driver.find_element_by_id(self.reset_password_input_id)
         password_reset_confirm_input = self.driver.find_element_by_id(self.reset_password_confirm_input_id)
         password_reset_change_button = self.driver.find_element_by_id(self.reset_password_change_button_id)

         password_reset_confirm_input.send_keys(new_password)
         password_reset_input.send_keys(new_password)
         password_reset_change_button.click()
         time.sleep(2)
   
      except Exception as e:
         error = str(e)
      finally:
         if error == "":
            error = "No Error"
   

      result_dict = { 
         'error': error, 
         'email': email, 
         'new_password': new_password
      }
   
      self.add_to_logs(result_dict, False)


   def test_login(self, username_or_email, password, check_remember_me):
      error = ""
      is_logged_in = False
      remember_me_works = False

      username_warning_message_is_displayed = False
      password_warning_message_is_displayed = False

      try:
         email_or_username_input = self.driver.find_element_by_id(self.email_or_username_input_id)
         remember_me_check_box = self.driver.find_element_by_id(self.remember_me_check_box_id)
         password_input = self.driver.find_element_by_id(self.password_input_id)
         login_button = self.driver.find_element_by_id(self.login_button_id)

         email_or_username_input.clear()
         email_or_username_input.send_keys(username_or_email)
   
         password_input.clear()   
         password_input.send_keys(password)
   
         if (not remember_me_check_box.is_selected() and check_remember_me):
            remember_me_check_box.click()
   
         if (remember_me_check_box.is_selected() and not check_remember_me):
            remember_me_check_box.click()

         time.sleep(0.2)
         login_button.click()
         time.sleep(3)
   
         if (self.pageURL != self.driver.current_url):
            logout_button = self.driver.find_element_by_id(self.logout_button_id)
            logout_button.click()
            is_logged_in = True
            time.sleep(3)
      
            if check_remember_me:
               email_or_username_input = self.driver.find_element_by_id(self.email_or_username_input_id)
               password_input = self.driver.find_element_by_id(self.password_input_id)
               username_input_compare = email_or_username_input.text
               password_input_compare = password_input.text
               if ((not (username_input_compare != "")) & (not (password_input_compare != ""))):
                  remember_me_works = True
         else:
            if self.driver.find_element_by_id(self.username_warning_message_id) != "":
               username_warning_message_is_displayed = True
            if self.driver.find_element_by_id(self.password_warning_message_id) != "":
               password_warning_message_is_displayed = True
   
      except Exception as e:
         print(str(e))
         error = str(e)
      finally:
         if error == "":
            error = "No Error"
   
      result_dict = { 
         'error': error, 
         'password': password,
         'is_logged_in': str(is_logged_in), 
         'username_or_email': username_or_email,
         'remember_me_works': str(remember_me_works), 
         'check_remember_me': str(check_remember_me),
         'username_warning': str(username_warning_message_is_displayed),
         'password_warning': str(password_warning_message_is_displayed)
      }
   
      self.add_to_logs(result_dict, True)
      
      
   def add_to_logs(self, result_dict, is_log_in): 
      date = datetime.datetime.now().strftime("%c")
      result = f"{date}:\n" + f"{self.class_name}:\n"
      if is_log_in:
         username_log = ""
         password_log = ""

         if result_dict['username_or_email'] == "":
            if result_dict['username_warning'] == "True":
               username_log = "Username empty warning was displayed\n"
            else:
               username_log = "Username empty warning was NOT displayed\n"
         else:
            username_log = f"username_or_email={ result_dict['username_or_email'] }\n"

         if result_dict['password'] == "":
            if result_dict['password_warning'] == "True":
               password_log = "password empty warning was displayed\n"
            else:
               password_log = "password empty warning was NOT displayed\n"
         else:
            password_log = f"password={ result_dict['password'] }\n"
             
         result += username_log +\
                   password_log +\
                   f"is_logged_in: { result_dict['is_logged_in'] }\n" +\
                   f"error: { result_dict['error'] }\n"
            
         if (result_dict['check_remember_me']):
            result += f"Remember me feature works: { result_dict['remember_me_works'] }\n"
   
      else: 
         result += f"email={ result_dict['email'] }\n" +\
                   f"new_password={ result_dict['new_password'] }\n" +\
                   f"error: { result_dict['error'] }\n"
   
      result += "***************************"
      self.test_logs.append(result)
      
      
   def write_logs_file(self):
      try:
         with open(self.class_name + "_logs.txt", "w", encoding="UTF-8") as file:
            for log in self.test_logs:
               file.write(log + "\n")
      except:
         print(self.class_name + "An error is occured while writing log file")
            

   def run_tests(self):
      self.driver.get(self.pageURL)
      time.sleep(2)
         
      # =========================================
      # TEST 1 --> Test Empty Credentials
      # username = ""
      # password = ""
      # =========================================
      self.test_login("", "", False)


      # =========================================
      # TEST 2 --> Test Empty Username
      # username = ""
      # password = "12"
      # =========================================
      self.test_login("", "12", False)


      # =========================================
      # TEST 3 --> Test Empty Password
      # username = "enes"
      # password = ""
      # =========================================
      self.test_login("enes", "", False)


      # =========================================
      # TEST 4 --> Test Wrong Credentials
      # username = "enes"
      # password = "12345"
      # =========================================
      self.test_login("enes", "12345", False)


      # =========================================
      # TEST 5 --> Test Login without remember me
      # username = "enes"
      # password = "123456"
      # =========================================
      self.test_login("enes", "123456", False)


      # =========================================
      # TEST 6 --> Test Login with remember me
      # username = "enes"
      # password = "123456"
      # =========================================
      self.test_login("enes", "123456", True)


      # =========================================
      # TEST 7 --> Test Forgot Password
      # username = "enes"
      # password = "123456"
      # =========================================
      self.test_forgot_password('fatihsevban15@gmail.com', 'naruto1212')


      self.write_logs_file()
      self.tearDown()




tester = Tester()
tester.run_tests()