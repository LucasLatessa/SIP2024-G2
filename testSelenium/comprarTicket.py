from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
import time
import logging

def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(nombre,selector):
    campo = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(nombre)
def ejecutarClickSeguro(selector):
    try:
        ejecutarClick(selector)
    except NoSuchElementException:
        logging.warning(f"El botón con el selector {selector} no se encontró.")
def modificarCampoSeguro(valor, selector):
    try:
        modificarCampo(valor, selector)
    except NoSuchElementException:
        logging.warning(f"El elemento con el selector {selector} no se encontró, continuando con el siguiente.")


usuario = "cliente@example.com"
contraseña = "Cliente123"
usuarioMP = "TESTUSER320418584"
contraseñaMP = "qSuDm2hNuV"
verificacionMP="663413"
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')

#Abrir pagina
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://35.196.38.34:4040/")

#Inicio sesion
ejecutarClick("div.login")

#Correo
modificarCampo(usuario,"input[name='username']")

#Contraseña
modificarCampo(contraseña,"input[name='password']")
time.sleep(2)
#IniciarSesion
ejecutarClick("button[type='submit']")

#Voy a evento
ejecutarClick("a[href='/eventos']")
time.sleep(2)
#Selecciono 1 evento
ejecutarClick("a[href='/evento/1']")
time.sleep(2)
#Selecciono tipo de entrada
ejecutarClick("select[id='tipoEntrada']")
ejecutarClick("option[value='VIP']")

#Cantidad entrdas
modificarCampo("1", "input[id='cantidadEntradas']")

time.sleep(2)

#Comprar
ejecutarClick("button")

time.sleep(3)

#MP
ejecutarClick("button[aria-label='Pagar con Mercado Pago']")

time.sleep(2)
 
#Cuenta MP
#ejecutarClick("div[class='title']") 

time.sleep(4)

#Cuenta MP
modificarCampo(usuarioMP,"input[type='email']")
ejecutarClick("button[type='submit']")
time.sleep(2)
modificarCampo(contraseñaMP,"input[type='password']")
ejecutarClick("button[type='submit']")

time.sleep(3)

#Pagar
ejecutarClick("button#\\:rb\\:")
time.sleep(2)
# Ingresar código de verificación de Mercado Pago

#-----------------COMENTAR SI DEJA DE PEDIR LA VERIFICACION-----------------
for i in range(len(verificacionMP)):
    selector = f"input[id=':R6muh:-digit-{i}']"
    modificarCampo(verificacionMP[i], selector)

# Intenta ejecutar el click, y maneja la excepción si no se encuentra el botón
ejecutarClick("button[data-testid='submit_button']")
 
#--------------------------------------------------------------------------- 

time.sleep(15)

#Veo la entrada
ejecutarClick("div.profile")
#ejecutarClick("button.modalQR")
 
time.sleep(100000)

#time.sleep(10000)


