from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import time

# Funciones auxiliares para interactuar con elementos
def ejecutarClick(selector):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector))).click()

def modificarCampo(valor, selector):
    campo = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    campo.clear()
    campo.send_keys(valor)

# Datos de prueba
usuario = "cliente@example.com"
contraseña = "Cliente123"
numeroT = "5031755734530604"
codigoT = "123"
vencT = "1125"
nombreTitular = "María López"
tipo_identificacion = "DNI"
numero_identificacion = "12345678"
# Inicializar el navegador
driver = webdriver.Chrome()
driver.get("http://localhost:4040/")

try:
    # Iniciar sesión
    ejecutarClick("div.login")
    modificarCampo(usuario, "input[name='username']")
    modificarCampo(contraseña, "input[name='password']")
    ejecutarClick("button[type='submit']")

    # Seleccionar evento y tipo de entrada
    ejecutarClick("a[href='/eventos']")
    ejecutarClick("a[href='/evento/108']")
    ejecutarClick("select[id='tipoEntrada']")
    ejecutarClick("option[value='STANDARD']")
    modificarCampo("1", "input[id='cantidadEntradas']")
    ejecutarClick("button")

    # Pagar con Mercado Pago
    time.sleep(5)  # Espera breve para carga
    ejecutarClick("button[aria-label='Pagar con Mercado Pago']")
    time.sleep(5)  # Espera para carga del formulario
    ejecutarClick("label[for='new_card_row']")

    # Nombre del titular
    modificarCampo(nombreTitular, "input[id='fullname']")

    # Cambiar al iframe del número de tarjeta
    iframe_tarjeta = WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR, "iframe[name='cardNumber']")))
    modificarCampo(numeroT, "input[name='cardNumber']")  # Selector ajustado según el formulario proporcionado
    driver.switch_to.default_content()

    # Cambiar al iframe de la fecha de vencimiento
    iframe_vencimiento = WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR, "iframe[name='expirationDate']")))
    modificarCampo(vencT, "input[name='expirationDate']")  # Selector ajustado según el formulario proporcionado
    driver.switch_to.default_content()

    # Cambiar al iframe del código de seguridad
    iframe_codigo = WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR, "iframe[name='securityCode']")))
    modificarCampo(codigoT, "input[name='securityCode']")  # Selector ajustado según el formulario proporcionado
    driver.switch_to.default_content()

    # Pagar
    ejecutarClick("button[type='submit']")
    time.sleep(5)
    # Seleccionar tipo de identificación
    #ejecutarClick("button[id='type-trigger']")
    #ejecutarClick(f"li[role='option'][data-value='{tipo_identificacion}']")
    modificarCampo(numero_identificacion, "input[id='number']")
    ejecutarClick("button[type='submit']")
    # Hacer clic en el label cuotas(1)
    ejecutarClick("label.options-list__label[for='1']")
    # Completar campo de correo electrónico
    modificarCampo("ByPassSIP@gmail.com", "input[name='[ui_components][group_content][group_scroller][group_animated_overlay_and_expand][group_not_animated_content][email_row][group_pay][email]']")
    ejecutarClick("button#pay.andes-button.andes-button--large.andes-button--loud")

    
    # Tiempo de espera opcional para verificación visual
    time.sleep(10)
    ejecutarClick("div.profile")
    #ejecutarClick("button.modalQR") 
    time.sleep(10000)

except Exception as e:
    print(f"Ocurrió un error: {str(e)}")

finally:
    # Cerrar navegador
    driver.quit()
