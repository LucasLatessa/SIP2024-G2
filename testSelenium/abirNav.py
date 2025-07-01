from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
#Abrir pagina
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://35.196.38.34:4040/")
time.sleep(100000)