class Productos {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
    
    setNombre(nombre) {
        this.nombre = nombre;
    }

    setPrecio(precio) {
        this.precio = precio;
    }

    getNombre() {
        return this.nombre;
    }

    getPrecio() {
        return this.precio;
    }


}


class Carrito {
    constructor() {
        this.Productos = [];
    }
    agregarProducto(producto){
        this.Productos.push(producto);
    }
    mostrarProductos(){
        cout("Productos del carrito: ")
        this.Productos.forEach((producto)=>{
            cout(producto.getNombre() + "$" + producto.getPrecio());
        })
    }
}

class Cliente {
    constructor(nombre, apellido, idCliente) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.idCliente = idCliente;
        this.carrito = new Carrito;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre){
        this.nombre = nombre;
    }
    
    agregarProducto(producto){
        this.carrito.agregarProducto(producto);
    }
    
    mostrarProductos(){
        this.carrito.mostrarProductos();
    }
}


let producto1 = new Productos("Manzana", 100);
let producto2 = new Productos("Banana", 80);
let producto3 = new Productos("Leche", 150);
let producto4 = new Productos("Pan", 120);


let Persona1 = new Cliente("Valentin", "Da Silva", "47593");

Persona1.setNombre("Sofia");
Persona1.agregarProducto(producto1);
Persona1.agregarProducto(producto1);
Persona1.agregarProducto(producto2);

function cout(mensaje) {
    let p = document.createElement('p');
    p.textContent = mensaje;
    document.body.appendChild(p);
}

document.querySelector(".carrito").addEventListener("click", ()=>{
    Persona1.mostrarProductos();
})