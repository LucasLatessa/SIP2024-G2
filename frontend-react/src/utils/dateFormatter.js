import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un string de fecha y hora del tipo "AAAA-MM-DD - HH:MM:SS" 
 * y retorna un objeto con el día, el mes (abreviado en mayúsculas) y la hora.
 * * @param {string} fechaCompleta El string de fecha y hora completo.
 * @returns {{dia: string, mes: string, hora: string}} Un objeto con los tres campos.
 */
export const formatearFechaParaCard = (fechaCompleta) => {
  if (!fechaCompleta || typeof fechaCompleta !== 'string') {
    return { dia: '', mes: '', hora: '' };
  }
    
  // 1. Limpiar y Parsear
  const fechaLimpia = fechaCompleta.replace(' - ', 'T'); 
  const fechaObj = parseISO(fechaLimpia);
  
  if (isNaN(fechaObj.getTime())) { // Uso .getTime() para una verificación más robusta
    console.error('Fecha inválida detectada:', fechaCompleta);
    return { dia: '---', mes: '---', hora: '--:--' };
  }

  // 2. Formato de Día: "DD"
  const dia = format(fechaObj, 'dd');

  // 3. Formato de Mes: "MMM" (abreviado en español y mayúsculas)
  const mes = format(fechaObj, 'MMM', { locale: es }).toUpperCase();
  
  // 4. Formato de Hora: "HH:MM"
  const hora = format(fechaObj, 'HH:mm');

  // Retornamos un ÚNICO objeto con los tres valores
  return {
    dia, // Ejemplo: "14"
    mes, // Ejemplo: "SEP"
    hora, // Ejemplo: "20:00"
  };
};