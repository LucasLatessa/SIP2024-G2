from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time

def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(nombre,selector):
    campo = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(nombre)

#Abrir pagina
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

#Inicio sesion
ejecutarClick("div.login")

#Iniciar con google
ejecutarClick("button.c0bb02cc9.cb6427d24.cc25322e6")

#Correo
modificarCampo("ByPassSIP@gmail.com","input[type='email']")

#Siguiente
ejecutarClick("button[type='button']")

#Click entendido
ejecutarClick("div[role='button']")

time.sleep(10000)

#Click en siguiente
#siguiente = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='button']"))).click()

#time.sleep(10000)


