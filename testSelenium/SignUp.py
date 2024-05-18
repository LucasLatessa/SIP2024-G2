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

usuario = "pepito123456@gmail.com"
contraseña = "Pepito123456"

# Configuración para usar Brave
brave_path = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
options = webdriver.ChromeOptions()
options.binary_location = brave_path

# Crear el driver de Brave
driver = webdriver.Chrome(options=options)

# Abrir página
driver.get("http://localhost:4040/")

# Inicio sesion
ejecutarClick("div.login")

time.sleep(2)

# Registrese
ejecutarClick("a[href*='u/signup']")

# Correo
modificarCampo(usuario, "input[name='email']")

# Contraseña
modificarCampo(contraseña, "input[name='password']")

time.sleep(2)

#IniciarSesion/Registrarse
ejecutarClick("button[type='submit']")

#Autorizar aplicación
ejecutarClick("button[type='submit']")

time.sleep(3)

# Hacer clic en el checkbox de "Acepto los Términos y Condiciones"
ejecutarClick("label input[type='checkbox']")

time.sleep(2)

# Hacer clic en el botón de "Crear Cuenta"
ejecutarClick("button") 

time.sleep(10000)