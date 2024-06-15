from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time

def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(valor, selector):
    campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(valor)

# Datos de inicio de sesión
usuario = "ByPassSIP@gmail.com"
contraseña = "ByPass2024"

# Datos del beneficio
nombre_beneficio = "Beneficio de Prueba"
descripcion_beneficio = "Descripción del beneficio de prueba"
porcentaje_descuento = "10"
codigo_descuento = "CODIGOPRUEBA"
ruta_imagen = "./backend-djangoAPI/bypass/media/beneficios/image.jpg"  # Asegúrate de cambiar esto por una ruta válida en tu sistema

# Abrir página
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

# Iniciar sesión
ejecutarClick("div.login")
modificarCampo(usuario, "input[name='username']")
modificarCampo(contraseña, "input[name='password']")
ejecutarClick("button[type='submit']")

# Esperar a que la página se cargue y redirija después del inicio de sesión
time.sleep(5)

# Navegar a la página de creación de beneficios
driver.get("http://localhost:4040/crear-beneficio")

# Rellenar el formulario de creación de beneficios
modificarCampo(nombre_beneficio, "input[name='nombre']")
modificarCampo(descripcion_beneficio, "input[name='descripcion']")
modificarCampo(porcentaje_descuento, "input[name='porcentajeDescuento']")
modificarCampo(codigo_descuento, "input[name='codigoDescuento']")

# Seleccionar un evento (asumiendo que hay al menos un evento disponible)
select_evento = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'evento-select')))
select_evento.click()
time.sleep(1)  # Esperar a que las opciones se carguen
select_evento.find_element_by_tag_name("option").click()

# Subir una imagen
input_imagen = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='imagen']")))
input_imagen.send_keys(ruta_imagen)

# Confirmar la creación del beneficio
ejecutarClick("button[type='submit']")

# Esperar un momento para asegurarse de que la creación se complete
time.sleep(5)

# Verificar que se ha redirigido
