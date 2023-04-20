import Ticket from "../models/Ticket.js";

 // Genera un nuevo número de comprobante incrementando el valor
 const generateTicket = async () => {
  try {
    // Obtiene el comprobante con el mayor número actual
    const ticket = await Ticket.findOne({
      order: [['numberTicket', 'DESC']],
      attributes: ['numberTicket']
    });

    console.log(ticket);

    let newNumber = 1; // Si no hay comprobantes previos, comienza desde 1
    if (ticket) {
      newNumber = Number(ticket.numberTicket) + 1; // Incrementa el número en 1
    }

    return newNumber;
  } catch (error) {
    console.error('Error al generar el número de comprobante:', error);
    throw error;
  }
}

export default generateTicket