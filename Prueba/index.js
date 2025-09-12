class Producto {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }
    getNombre() {
        return this.nombre;
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getPrecio() {
        return this.precio;
    }
    setPrecio(precio) {
        this.precio = precio;
    }
    getCantidad() {
        return this.cantidad;
    }
    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
}

class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto){
        this.productos.push(producto);
    }

    devolverProducto(){
        let lista = [];
        this.productos.forEach((producto)=>{
            lista.push({
                nombre: producto.getNombre(),
                cantidad: producto.getCantidad()
            })
        })
        return lista;
    }

}

class Cliente {
    constructor(nombre, apellido) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.carrito = new Carrito;
    }
    getNombre(){
        return this.nombre;
    }
    setNombre(nombre){
        this.nombre = nombre; 
    }
    getCarrito(){
        return this.carrito.devolverProducto();
    }
    agregarProducto(producto){
        this.carrito.agregarProducto(producto)
    }
}

class Negocio {
    constructor(nombre) {
        this.nombre = nombre;
    }
    mostrarCarrito(cliente){
        let lista = cliente.getCarrito();
        lista.forEach(item => {
            document.body.innerHTML += `<p>Nombre: ${item.nombre}, Cantidad: ${item.cantidad}</p>`;
        });
    }
}


//PlayGround
let Verduleria = new Negocio("Santa Rita");
let producto1 = new Producto("Manzana", 100, 5);
let producto2 = new Producto("Banana", 80, 3);
let producto3 = new Producto("Naranja", 90, 4);
let cliente1 = new Cliente ("Sofia", "Maciel");
let nombre = cliente1.getNombre();4
TranscriptShow(nombre);
cliente1.agregarProducto(producto1);
cliente1.agregarProducto(producto2);

document.querySelector(".carrito").addEventListener("click",()=>{
    Verduleria.mostrarCarrito(cliente1);

})



function TranscriptShow(mensjae) {
    document.body.innerHTML += `<p>${mensjae}</p>`;
}

//PlayGround