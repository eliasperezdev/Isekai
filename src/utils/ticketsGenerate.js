/**
 * https://parzibyte.me/blog
 */
const pdf = require("html-pdf");
const fs = require("fs");
const templateLocation = require.resolve("../views/factura.html");
let contentHTML = fs.readFileSync(templateLocation, 'utf8')
// Estos productos podrían venir de cualquier lugar
const productos = [
    {
        descripcion: "Nintendo Switch",
        cantidad: 2,
        precio: 9000,
    },
    {
        descripcion: "Videojuego: Hollow Knight",
        cantidad: 1,
        precio: 150,
    },
    {
        descripcion: "Audífonos HyperX",
        cantidad: 5,
        precio: 1500,
    },
];
export default ticketGenerate = (order) => {
    // Nota: el formatter solo es para, valga la redundancia, formatear el dinero. No es requerido, solo que quiero que se vea bonito
    const formatter = new Intl.NumberFormat("en", { style: "currency", "currency": "ARS" });
    // Generar el HTML de la tabla
    let tabla = "";
    let subtotal = 0;
    for (const producto of productos) {
        // Aumentar el total
        const totalProducto = producto.cantidad * producto.precio;
        subtotal += totalProducto;
        // Y concatenar los productos
        tabla += `<tr>
        <td>${producto.descripcion}</td>
        <td>${producto.cantidad}</td>
        <td>${formatter.format(producto.precio)}</td>
        <td>${formatter.format(totalProducto)}</td>
        </tr>`;
    }
    const descuento = 0;
    const subtotalConDescuento = subtotal - descuento;
    const impuestos = subtotalConDescuento * 0.16
    const total = subtotalConDescuento + impuestos;
    // Remplazar el valor {{tablaProductos}} por el verdadero valor
    contentHTML = contentHTML.replace("{{tablaProductos}}", tabla);
    
    // Y también los otros valores
    contentHTML = contentHTML.replace("{{cliente}}", formatter.format());
    contentHTML = contentHTML.replace("{{fecha}}", formatter.format());
    contentHTML = contentHTML.replace("{{numeroFactura}}", formatter.format());
    
    
    contentHTML = contentHTML.replace("{{subtotal}}", formatter.format(subtotal));
    contentHTML = contentHTML.replace("{{descuento}}", formatter.format(descuento));
    contentHTML = contentHTML.replace("{{subtotalConDescuento}}", formatter.format(subtotalConDescuento));
    contentHTML = contentHTML.replace("{{impuestos}}", formatter.format(impuestos));
    contentHTML = contentHTML.replace("{{total}}", formatter.format(total));
    pdf.create(contentHTML).toFile("salida.pdf", (error) => {
        if (error) {
            console.log("Error creando PDF: " + error)
        } else {
            console.log("PDF creado correctamente");
        }
    });
}