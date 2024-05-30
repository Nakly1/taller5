document.addEventListener('DOMContentLoaded', function() {
    const botones = document.getElementById('botones');
    const botonEliminar = document.getElementById('borrar');
    const registro = document.getElementById('titulo-formulario');
    const name = document.getElementById('name');
    const entradaFechaEvento = document.getElementById('fecha-evento');
    const entradaHoraEvento = document.getElementById('tiempo');
    const calendarioMensual = document.getElementById('mensual');
    const Anual = document.getElementById('Anual');
    const formularioEvento = document.getElementById('registro');
    const cancel = document.getElementById('cancel');
    const calendarioDiario = document.getElementById('diario');
    const contenedorFormularioEvento = document.getElementById('agrupar');

    const entradaDescripcionEvento = document.getElementById('notas');
    const personas = document.getElementById('integrantes');

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let elementoEventoActual = null;
    let eventos = {};
    let mesActual = 4; 
    const mesActualElemento = document.createElement('div');
    mesActualElemento.id = 'mes-actual';
    calendarioMensual.appendChild(mesActualElemento);

    function cambiarVista(vista) {
        const vistas = document.querySelectorAll('.calendario-vista');
        vistas.forEach(v => v.style.display = 'none');
        document.getElementById(vista).style.display = 'grid';
    }

    document.getElementById('vista-anual').addEventListener('click', () => cambiarVista('Anual'));
    document.getElementById('vista-mensual').addEventListener('click', () => mostrarCalendarioMensual(mesActual));
    document.getElementById('vista-diaria').addEventListener('click', () => mostrarCalendarioDiario(new Date().toISOString().split('T')[0]));

    function generarAnual() {
        for (let mes = 0; mes < 12; mes++) {
            const mesElemento = document.createElement('div');
            mesElemento.classList.add('mes');
            mesElemento.dataset.mes = mes;
            mesElemento.textContent = new Date(2024, mes).toLocaleString('es-ES', { month: 'long' });
            mesElemento.addEventListener('click', () => mostrarCalendarioMensual(mes));
            Anual.appendChild(mesElemento);
        }
    }

    function actualizarMesActual() {
        mesActualElemento.textContent = meses[mesActual];
    }

    function cambiarMes(direccion) {
        mesActual += direccion;
        if (mesActual < 0) {
            mesActual = 11;
        } else if (mesActual > 11) {
            mesActual = 0;
        }
        mostrarCalendarioMensual(mesActual);
        actualizarMesActual();
    }

    function generarColorAleatorio() {
        const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function mostrarCalendarioMensual(mes) {
        calendarioMensual.innerHTML = '';

        const botonAnterior = document.createElement('button');
        botonAnterior.textContent = 'Anterior';
        botonAnterior.addEventListener('click', () => cambiarMes(-1));
        calendarioMensual.appendChild(botonAnterior);

        const botonSiguiente = document.createElement('button');
        botonSiguiente.textContent = 'Siguiente';
        botonSiguiente.addEventListener('click', () => cambiarMes(1));
        calendarioMensual.appendChild(botonSiguiente);

        actualizarMesActual();
        calendarioMensual.appendChild(mesActualElemento);

        const diasEnMes = new Date(2024, mes + 1, 0).getDate();
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const diaElemento = document.createElement('div');
            const fecha = `2024-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            diaElemento.textContent = dia;
            diaElemento.dataset.fecha = fecha;
            if (eventos[fecha]) {
                diaElemento.classList.add('con-evento');
                diaElemento.style.backgroundColor = eventos[fecha][Object.keys(eventos[fecha])[0]].color;
            }
            diaElemento.addEventListener('click', () => abrirFormularioEvento(diaElemento));
            calendarioMensual.appendChild(diaElemento);
        }
        cambiarVista('mensual');
    }

    cancel.addEventListener('click', () => {
        contenedorFormularioEvento.style.display = 'none';
    });

    generarAnual();
    mostrarCalendarioMensual(mesActual);

    const opcionesHora = [
        "01:00 am", "02:00 am", "03:00 am", "04:00 am", "05:00 am", "06:00 am", "07:00 am", "08:00 am",
        "09:00 am", "10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm",
        "05:00 pm", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
    ];

    function mostrarCalendarioDiario(fecha) {
        calendarioDiario.innerHTML = '';
        const horasDia = [
            "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM",
            "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
            "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
        ];

        for (const hora of horasDia) {
            const horaElemento = document.createElement('div');
            horaElemento.textContent = hora;
            horaElemento.dataset.hora = hora;
            horaElemento.dataset.fecha = fecha;
            const evento = eventos[fecha]?.[hora];
            if (evento) {
                horaElemento.classList.add('con-evento');
                horaElemento.textContent += ` - ${evento.titulo}`;
                horaElemento.style.backgroundColor = evento.color;
            }
            horaElemento.addEventListener('click', () => abrirFormularioEvento(horaElemento, 'diario'));
            calendarioDiario.appendChild(horaElemento);
        }
        cambiarVista('diario');
    }

    function abrirFormularioEvento(elemento, vista = 'mensual') {
        elementoEventoActual = elemento;
        entradaFechaEvento.value = vista === 'diario' ? elemento.dataset.fecha : '';
        entradaHoraEvento.value = vista === 'diario' ? elemento.dataset.hora : '';
        registro.textContent = 'Crea tu evento';
        formularioEvento.reset();
        contenedorFormularioEvento.style.display = 'block';
    }

    formularioEvento.addEventListener('submit', function(event) {
        event.preventDefault();
        const titulo = name.value;
        const fecha = entradaFechaEvento.value;
        const hora = entradaHoraEvento.value;
        const descripcion = entradaDescripcionEvento.value;
        const participantes = personas.value;

        if (!eventos[fecha]) {
            eventos[fecha] = {};
        }
        eventos[fecha][hora] = {
            titulo,
            descripcion,
            participantes,
            color: generarColorAleatorio()
        };
        contenedorFormularioEvento.style.display = 'none';
        if (calendarioMensual.style.display === 'grid') {
            mostrarCalendarioMensual(mesActual);
        } else if (calendarioDiario.style.display === 'grid') {
            mostrarCalendarioDiario(fecha);
        }
    });

    opcionesHora.forEach(hora => {
        const opcion = document.createElement('option');
        opcion.textContent = hora;
        entradaHoraEvento.appendChild(opcion);
    });
});
