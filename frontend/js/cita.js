$(document).ready(function () {
    cargarPacientes();
});

async function cargarPacientes() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        const usuarios = await respuesta.json();

        const select = $('#selectUsuario');
        $.each(usuarios, function (index, usuario) {
            select.append($('<option>', {
                value: usuario._id, 
                text: `${usuario.nombre} (RUT: ${usuario.rut})` 
            }));
        });
    } catch (error) {
        console.log('Error al cargar la lista de pacientes: ', error);
    }
}

function validarFormularioCita() {
    let selectUsuario = $('#selectUsuario');
    let campoEspecialidad = $('#input_especialidad');
    let campoMedico = $('#input_medico');
    let campoCentro = $('#input_centro');
    let campoFecha = $('#input_fecha');
    let campoHora = $('#input_hora');
    let campoCosto = $('#input_costo');
    let campoError = $('#errorFormulario');
    let listaErrores = $('#listaErrores');
    let formularioValido = true;

    campoError.hide();
    listaErrores.empty();

    if (!validarInput(selectUsuario)) {
        agregarCitaError('<li>Debe seleccionar un paciente obligatoriamente.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoEspecialidad)) {
        agregarCitaError('<li>El campo ESPECIALIDAD es requerido.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoMedico)) {
        agregarCitaError('<li>El campo MÉDICO es requerido.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoCentro)) {
        agregarCitaError('<li>El campo CENTRO MÉDICO es requerido.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoFecha)) {
        agregarCitaError('<li>El campo FECHA es requerido.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoHora)) {
        agregarCitaError('<li>El campo HORA es requerido.</li>');
        formularioValido = false;
    }
    if (!validarInput(campoCosto)) {
        agregarCitaError('<li>El campo COSTO es requerido.</li>');
        formularioValido = false;
    }

    if (formularioValido) {
        campoError.hide();
        
        const formulario = $('#formularioCita')[0];
        const dataForm = new FormData(formulario);
        const datos = Object.fromEntries(dataForm.entries());

        const enviarCita = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarCita', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                if (respuesta.ok) {
                    alert('Cita Médica registrada exitosamente, enviando datos.');
                    window.location.href = './listado_citas.html';
                }
            } catch (error) {
                console.log('Error de red al intentar registrar la cita: ', error);
            }
        };
        enviarCita();
    } else {
        campoError.show();
    }
}

function validarInput(elemento) {
    const campo = $(elemento);
    if (campo.val() == '') {
        campo.addClass('is-invalid').removeClass('is-valid');
        return false;
    } else {
        campo.removeClass('is-invalid').addClass('is-valid');
        return true;
    }
}

function agregarCitaError(mensaje) {
    $('#listaErrores').append(mensaje);
}