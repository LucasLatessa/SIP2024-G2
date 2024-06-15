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

usuario = "cliente@example.com"
contraseña = "Cliente123"
usuarioMP = "TESTUSER320418584"
contraseñaMP = "qSuDm2hNuV"
verificacionMP="663413"
#Abrir pagina
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

#Inicio sesion
ejecutarClick("div.login")

#Correo
modificarCampo(usuario,"input[name='username']")

#Contraseña
modificarCampo(contraseña,"input[name='password']")

#IniciarSesion
ejecutarClick("button[type='submit']")

#Voy a evento
ejecutarClick("a[href='/eventos']")

#Selecciono 1 evento
ejecutarClick("a[href='/evento/108']")

#Selecciono tipo de entrada
ejecutarClick("select[id='tipoEntrada']")
ejecutarClick("option[value='STANDARD']")

#Cantidad entrdas
modificarCampo("1", "input[id='cantidadEntradas']")

time.sleep(2)

#Comprar
ejecutarClick("button")

time.sleep(2)

#MP
ejecutarClick("button[aria-label='Pagar con Mercado Pago']")

time.sleep(2)
 
#Cuenta MP
ejecutarClick("div[class='title']")

time.sleep(2)

#Cuenta MP
modificarCampo(usuarioMP,"input[type='email']")
ejecutarClick("button[type='submit']")
modificarCampo(contraseñaMP,"input[type='password']")
ejecutarClick("button[type='submit']")

time.sleep(2)

#Pagar
ejecutarClick("button[type='submit']")
time.sleep(2)
# Ingresar código de verificación de Mercado Pago
#-----------------COMENTAR SI DEJA DE PEDIR LA VERIFICACION-----------------
for i in range(len(verificacionMP)):
    selector = f"input[id=':R6muh:-digit-{i}']"
    modificarCampo(verificacionMP[i], selector)
ejecutarClick("button[data-testid='submit_button']")
#---------------------------------------------------------------------------
time.sleep(15)

#Veo la entrada
ejecutarClick("div.profile")
#ejecutarClick("button.modalQR")
 
time.sleep(100000)

#time.sleep(10000)


