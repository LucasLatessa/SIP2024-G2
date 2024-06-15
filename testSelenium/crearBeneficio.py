from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time
from selenium.webdriver.support.ui import Select

def ejecutarClick(selector):
    try:
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()
    except Exception as e:
        print(f"Error al hacer clic en el selector {selector}: {e}")

def ejecutarClickPorTexto(texto):
    try:
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//button[text()='{texto}']"))).click()
    except Exception as e:
        print(f"Error al hacer clic en el botón con texto '{texto}': {e}")

def modificarCampo(valor, selector):
    try:
        campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        campo.clear()
        campo.send_keys(valor)
    except Exception as e:
        print(f"Error al modificar el campo {selector} con valor {valor}: {e}")

def seleccionarOpcion(texto_visible, selector):
    try:
        campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        select = Select(campo)
        select.select_by_visible_text(texto_visible)
    except Exception as e:
        print(f"Error al seleccionar la opción {texto_visible} en {selector}: {e}")

def subirImagen(ruta_archivo, selector):
    try:
        campo = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        campo.send_keys(ruta_archivo)
    except Exception as e:
        print(f"Error al subir la imagen {ruta_archivo} en {selector}: {e}")

usuario = "testprodu@example.com"
contraseña = "Produ123"

# Abrir página
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

# Inicio de sesión
ejecutarClick("div.login")
# Correo
modificarCampo(usuario, "input[name='username']")
# Contraseña
modificarCampo(contraseña, "input[name='password']")
# Iniciar sesión
ejecutarClick("button[type='submit']")

# Ir al perfil
ejecutarClick("div.profile")

# Clic en crear beneficio
ejecutarClick("a[href='/crearBeneficio']")
time.sleep(10)

# Cargar los datos del beneficio
seleccionarOpcion("Milei", "select[name='evento-select']")
modificarCampo("Coca Cola", "input[name='nombre']")
modificarCampo("Descuento en bebida Coca Cola", "input[name='descripcion']")
time.sleep(1)
modificarCampo("50", "input[name='porcentajeDescuento']")
modificarCampo("151525", "input[name='codigoDescuento']")

# Subir una imagen
subirImagen("C:/prueba.png", "input[name='imagen']")
time.sleep(5)

# Hacer clic en el botón de enviar
ejecutarClick("section.buttonCrearBeneficio button[type='submit']")

time.sleep(10000)

# Cerrar el navegador
driver.quit()
