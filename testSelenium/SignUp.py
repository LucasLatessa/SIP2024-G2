from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time
from selenium.webdriver.chrome.options import Options

def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(nombre,selector):
    campo = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(nombre)

usuario = "pepito1234@example.com"
contraseña = "Pepito#1234"

# Configuración para usar Brave
brave_path = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--incognito')  # Opcional: para usar el navegador en modo incógnito

#Abrir pagina

chrome_options.binary_location = brave_path

# Crear el driver de Brave
driver = webdriver.Chrome(options=chrome_options)

# Abrir página
driver.get("https://35.196.38.34:4040/")

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
#ejecutarClick("button[type='submit']")

time.sleep(3)

# Hacer clic en el checkbox de "Acepto los Términos y Condiciones"
ejecutarClick("label input[type='checkbox']")

# Hacer clic en el radio de "Cliente"
ejecutarClick("input[type='radio'][value='cliente']")
time.sleep(2)

# Hacer clic en el botón de "Crear Cuenta"
ejecutarClick("button") 

time.sleep(10000)