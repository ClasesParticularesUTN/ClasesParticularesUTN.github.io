let indice = 0;
class Producto {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.total = null;
    }
    calcularTotal(){
        this.total = precio * cantidad;
    }
    getNombre() {
        return this.nombre;
    }
    getTotal(){
        this.calcularTotal();
        return this.total;
    }
    getPrecio() {
        return this.precio;
    }
    setPrecio(nuevoPrecio) {
        this.precio = nuevoPrecio;
    }

    getCantidad() {
        return this.cantidad;
    }
    setCantidad(nuevaCantidad) {
        this.cantidad = nuevaCantidad;
    }


}

class Carrito {
    constructor() {
        this.productos = [];
        this.total = 0;
    }
    agregarProducto(producto){
        this.productos.push(producto);
    }
    calcularTotal(){
        this.productos.forEach((producto)=>{
            this.total += producto.getTotal();
        })
    }
    getTotal(){
        return this.total;
    }

    getProductos(){
        let listado = [];
        this.productos.forEach((producto)=>{
            listado.push({
                nombre: producto.getNombre(),
                precio: producto.getPrecio()
            })
        })
        return listado;
    }
}   

class Cliente{
    constructor(nombre, apellido){
        this.nombre = nombre;
        this.apellido = apellido;
        this.idCliente = indice+1;
        this.carrito = new Carrito;
    }
    getNombre(){
        return this.nombre;
    }
    setNombre(nuevoNombre){
        this.nombre = nuevoNombre;
    }
    agregarProducto(producto){
        this.carrito.agregarProducto(producto);
    }
    devolverCarrito(){
        return this.carrito.getProductos(); 
    }

}


class Negocio{
    constructor(nombre){
        this.nombre = nombre;
    }
    mostrarCarrito(cliente){
        let listadoProductos = cliente.devolverCarrito(); 
        listadoProductos.forEach(producto => {
            document.body.innerHTML += `<p>Nombre: ${producto.nombre}, Precio: ${producto.precio}</p>`;
        });
    }
}


//Playground
let verduleria = new Negocio("Santa Rita");
let cliente1 = new Cliente("Sofia", "Maciel");
let producto1 = new Producto("Manzana", 100, 3);
let producto2 = new Producto("Banana", 80, 5);
let producto3 = new Producto("Naranja", 120, 2);
let producto4 = new Producto("Pera", 90, 4);


cout(cliente1.getNombre());
cliente1.agregarProducto(producto1);
cliente1.agregarProducto(producto3);

function cout(mensaje) {
    document.body.innerHTML += `<p>${mensaje}</p>`;
}

document.querySelector(".carrito").onclick = function() {
    verduleria.mostrarCarrito(cliente1);
};