from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
import time
import logging
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
#Abrir pagina
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://35.196.38.34:4040/")
time.sleep(100000)