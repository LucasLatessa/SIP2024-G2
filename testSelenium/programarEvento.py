from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time
from selenium.webdriver.support.ui import Select

def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(nombre,selector):
    campo = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(nombre)

def seleccionarOpcion(texto_visible, selector):
    campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    select = Select(campo)
    select.select_by_visible_text(texto_visible)

def setearFecha(fecha, selector):
    campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(fecha)

def setearHora(hora, selector):
    campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(hora)

def subirArchivo(ruta_archivo, selector):
    campo = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    campo.send_keys(ruta_archivo)

usuario = "testprodu@example.com"
contraseña = "Produ123"

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

#Voy a perfil:
ejecutarClick("div.profile")

#Cliqueo programar evento
ejecutarClick("a[href='/programarEvento']")

#Modifico datos evento
modificarCampo("Selenium","input[name='nombre']")
seleccionarOpcion("Monumental", "select[name='lugar']")
setearFecha("14-12-2024", "input[name='fecha']")
modificarCampo("DescripcionSelenium","input[name='descripcion']")
setearHora("15:30", "input[name='hora']")
# Subir una imagen
subirArchivo("C:/prueba.png", "input[name='imagen']")
#Entradas
modificarCampo(2, "input[name='cantidadEntradasVIP']")
modificarCampo(150, "input[name='precioVIP']")

modificarCampo(2, "input[name='cantidadEntradasPLATINIUM']")
modificarCampo(250, "input[name='precioPLATINIUM']")

modificarCampo(2, "input[name='cantidadEntradasSTANDARD']")
modificarCampo(350, "input[name='precioSTANDARD']")
# Hacer clic en el botón de enviar
ejecutarClick("button.buttonCrearEvento[type='submit']")




time.sleep(10000)

#Click en siguiente
#siguiente = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='button']"))).click()

#time.sleep(10000)


