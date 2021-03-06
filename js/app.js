//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGastos);
}

//Clases
class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=>
            total + gasto.cantidad,0);
        
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{//Imprime en HTML
    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad;//Declara 2 variables que son igual a la cantidad que pasan x parametro.
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipoMsj){
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center','alert');

        if(tipoMsj ==='error'){
            divAlerta.classList.add('alert-danger');
        }else{
            divAlerta.classList.add('alert-success');
        }
        //Msj error
        divAlerta.textContent = mensaje;
        //Insertar HTML
        document.querySelector('.primario').insertBefore(divAlerta,formulario);
        //Set TimeOut para quitar el msj
        setTimeout(()=>{
            divAlerta.remove();
        },2400);
    }

    agregarGastoListado(gastos){

        this.limpiarHTML();

        //Iterar sobre los gastos
        gastos.forEach(gasto =>{
            const {cantidad,nombre,id} = gasto;

            //Crear un Li
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className= 'list-group-item-d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id',id);Hace lo mismo que el codigo de abajo.
            nuevoGasto.dataset.id = id;
            
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>
            `
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        //Comprobar 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success','alert-danger');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Variable Global
let presupuesto;

//Instanciar clases
const ui = new UI();

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('??C??al es tu Presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario || presupuestoUsuario <= 0 )){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);//Paso como par??metro el presupuesto del prompt
    // console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGastos(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === '' || cantidad===''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no Valida','error');
        return;
    }

    //Generar un objeto con el gasto
    const gasto = {nombre , cantidad,id: Date.now()};//Une nombre y cantidad a gasto.
    // console.log(gasto);

    presupuesto.nuevoGasto(gasto);//A??ade un nuevo gasto
    ui.imprimirAlerta('Gasto agregado Correctamente');//Mensaje de Correcto al agregar un objeto.

    //Imprimir los gastos
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();//Reinicia el formulario al a??adir un objeto.
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    //Elimina los gastos de HTML
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}