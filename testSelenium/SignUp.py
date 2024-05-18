from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time

def ejecutarClick(driver, selector):
    try:
        # Espera hasta que el elemento sea clicable y desplázate hacia él
        elemento = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        driver.execute_script("arguments[0].scrollIntoView();", elemento)
        elemento.click()
        print(f"Clicked on element with selector: {selector}")
    except Exception as e:
        print(f"Failed to click on element with selector: {selector}")
        print(e)

def modificarCampo(driver, nombre, selector):
    try:
        campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        campo.clear()
        campo.send_keys(nombre)
        print(f"Modified field with selector: {selector} with value: {nombre}")
    except Exception as e:
        print(f"Failed to modify field with selector: {selector}")
        print(e)

usuario = "pepito123@gmail.com"
contraseña = "pepito123"

# Abrir página
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

# Inicio sesion
ejecutarClick(driver, "div.login")

# Espera explícita para asegurar que el registro link está disponible
#NO HACE EL CLICK, EL SELECTOR ESTA BIENN
ejecutarClick(driver, "a.c8861f699.c24d8133e")

# Correo
modificarCampo(driver, usuario, "input[name='email']")

# Contraseña
modificarCampo(driver, contraseña, "input[name='password']")

time.sleep(10)

# Cerrar el navegador
driver.quit()