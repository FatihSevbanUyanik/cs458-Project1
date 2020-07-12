import time
import datetime
from selenium import webdriver

# =========================================
# Setting Up Driver
# =========================================
pageURL = "http://localhost:3000/sign-in"
driver = webdriver.Chrome('chromedriver.exe')
driver.get(pageURL)


# =========================================
# Properties
# =========================================

# sign in prperties
email_or_username_input_id = "exampleInputUserId"
password_input_id = "exampleInputPassword1"
login_button_id = "login-btn"
logout_button_id = "logout-button"
remember_me_check_box_id = 'gridCheck'

# forgot password properties
forgot_password_link_id = "forgot"
reset_password_email_button_id = 'request-btn'
reset_password_change_button_id = "change-btn"
reset_password_input_id = "exampleInputPassword1"
reset_password_email_input_id = "exampleInputUserId"
reset_password_confirm_input_id = "exampleInputPassword2"

email = 'fatihsevban15@gmail.com'
newPassword = 'naruto1212'
class_name = 'SignInCredentialsTest'
test_logs = []

def test_forgot_password(email, password):
   error = ""
   
   try:
      # click forgot password link.
      forgot_password_link = driver.find_element_by_id(forgot_password_link_id)
      forgot_password_link.click()
      time.sleep(2)
        
      # enter email for password reset.
      reset_password_email_input = driver.find_element_by_id(reset_password_email_input_id)
      reset_password_email_input.send_keys(email)
      time.sleep(2)
        
      # clicking button for password reset.  
      reset_password_email_button = driver.find_element_by_id(reset_password_email_button_id)
      reset_password_email_button.click()
      time.sleep(2)
        
      # updating password reset.
      password_reset_input = driver.find_element_by_id(reset_password_input_id)
      password_reset_confirm_input = driver.find_element_by_id(reset_password_confirm_input_id)
      password_reset_change_button = driver.find_element_by_id(reset_password_change_button_id)

      password_reset_confirm_input.send_keys(newPassword)
      password_reset_input.send_keys(newPassword)
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
      'new_password': password
   }
   
   add_to_logs(result_dict, False)

   
def test_login(username_or_email, password, check_remember_me):
   error = ""
   is_logged_in = False
   remember_me_works = False
   
   try:
      email_or_username_input = driver.find_element_by_id(email_or_username_input_id)
      remember_me_check_box = driver.find_element_by_id(remember_me_check_box_id)
      password_input = driver.find_element_by_id(password_input_id)
      login_button = driver.find_element_by_id(login_button_id)

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
   
      if (pageURL != driver.current_url):
         logout_button = driver.find_element_by_id(logout_button_id)
         logout_button.click()
         is_logged_in = True
         time.sleep(3)
      
      if check_remember_me:
         username_input_compare = email_or_username_input.text
         password_input_compare = password_input.text
         if ((not (username_input_compare != "")) & (not (password_input_compare != ""))):
            remember_me_works = True
   
   except Exception as e:
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
      'check_remember_me': str(check_remember_me)
   }
   
   add_to_logs(result_dict, True)


def add_to_logs(result_dict, is_log_in): 
   date = datetime.datetime.now().strftime("%c")

   result = f"{date}:\n" + \
            f"{class_name}:\n"
   
   if is_log_in: 
      result += f"username_or_email={ result_dict['username_or_email'] }\n" +\
                f"password={ result_dict['password'] }\n" +\
                f"is_logged_in: { result_dict['is_logged_in'] }\n" +\
                f"error: { result_dict['error'] }\n"
            
      if (result_dict['check_remember_me'] == 'True'):
         result += f"Remember me feature works: { result_dict['remember_me_works'] }\n"
   
   else: 
      result += f"email={ result_dict['email'] }\n" +\
                f"new_password={ result_dict['new_password'] }\n" +\
                f"error: { result_dict['error'] }\n"
   
   result += "***************************"
   test_logs.append(result)


def write_logs_file():
   try:
      with open(class_name + "_logs.txt", "w", encoding="UTF-8") as file:
         for log in test_logs:
            file.write(log + "\n")
   except:
      print(class_name + "An error is occured while writing log file")


# =========================================
# TEST 1 --> Test Empty Credentials
# username = ""
# password = ""
# =========================================
test_login("", "", False)


# =========================================
# TEST 2 --> Test Empty Username
# username = ""
# password = "12"
# =========================================
test_login("", "12", False)


# =========================================
# TEST 3 --> Test Empty Password
# username = "enes"
# password = ""
# =========================================
test_login("enes", "", False)


# =========================================
# TEST 4 --> Test Wrong Credentials
# username = "enes"
# password = "12345"
# =========================================
test_login("enes", "12345", False)


# =========================================
# TEST 5 --> Test Login without remember me
# username = "enes"
# password = "123456"
# =========================================
test_login("enes", "123456", False)


# =========================================
# TEST 6 --> Test Login with remember me
# username = "enes"
# password = "123456"
# =========================================
test_login("enes", "123456", True)


# =========================================
# TEST 7 --> Test Forgot Password
# username = "enes"
# password = "123456"
# =========================================
test_forgot_password('fatihsevban15@gmail.com', 'naruto1212')
print(test_logs)

write_logs_file()