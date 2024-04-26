from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time

#Abrir pagina
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

#Click en iniciar sesion
login = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.login"))).click()

#Correo y contraseña
correo = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='username']")))
correo.clear()
correo.send_keys("ByPassSIP@gmail.com")

contraseña = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))
contraseña.clear()
contraseña.send_keys("ByPass2024")

#Click en iniciar sesion
loginComun = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.ce93f590b.c18381d7b.ce10713cf.c0dfda957.cac611a27"))).click()

time.sleep(5)

#Logout
#Click en cerrar sesion
login = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.logout"))).click()

time.sleep(100)