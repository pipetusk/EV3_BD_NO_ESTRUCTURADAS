$(document).ready(function () {
    cargarInfoPaises();
    cargarInfoComunas();
});

function validarFormulario() {
    let campoNombre = $('#input_nombre');
    let campoCorreo = $('#input_correo');
    let campoContrasena = $('#input_contrasena');
    let campoRepetirContrasena = $('#input_rep_contrasena');
    let campoRut = $('#input_rut');
    let campoTelefono = $('#input_telefono');
    let selectGenero = $('#selectGenero');
    let selectNacionalidad = $('#selectNacionalidad');
    let campoFechaNacimiento = $('#inputNacimiento');
    let campoArchivo = $('#inputFoto');
    let campoError = $('#errorFormulario');
    let listaErrores = $('#listaErrores');
    let selectComuna = $('#selectComuna');
    let campoCalle = $('#input_calle');
    let formularioValido = true;

    campoError.hide();
    listaErrores.empty();

    if (!validarInput(campoNombre)) {
        agregarError('<li>El campo NOMBRE es requerido.</li>');
        formularioValido = false;
    }

    if (!validarCorreo(campoCorreo)) {
        agregarError('<li id="errorEmailRequerido">El campo EMAIL es requerido.</li>');
        formularioValido = false;
    }

    if (!validarContrasena(campoContrasena)) {
        agregarError('<li id="errorContrasenaRequerido">El campo CONTRASEÑA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarRepetirContrasena(campoRepetirContrasena)) {
        agregarError('<li id="errorRepetirContrasenaRequerido">El campo REPETIR CONTRASEÑA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(campoRut)) {
        agregarError('<li>El campo RUT es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(campoTelefono)) {
        agregarError('<li>El campo TELÉFONO es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(selectGenero)) {
        agregarError('<li>El campo GÉNERO es requerido.</li>');
        formularioValido = false;
    }
    
    if (!validarInput(selectNacionalidad)) {
        agregarError('<li>El campo NACIONALIDAD es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(campoFechaNacimiento)) {
        agregarError('<li>El campo FECHA DE NACIMIENTO es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(selectComuna)) {
        agregarError('<li>El campo COMUNA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(campoCalle)) {
        agregarError('<li>El campo CALLE es requerido.</li>');
        formularioValido = false;
    }

    if (formularioValido) {
        campoError.hide();
        listaErrores.empty();
        alert('Formulario válido. Enviando datos...');

        const formulario = $('#formularioRegistro')[0];
        const dataForm = new FormData(formulario);

        const direccion = {
            comuna: dataForm.get('comuna'),
            calle: dataForm.get('calle'),
            numero: dataForm.get('numero'),
            departamento: dataForm.get('departamento'),
            codigoPostal: dataForm.get('codigoPostal')
        }
        dataForm.set('direccion', JSON.stringify(direccion));

        const datos = Object.fromEntries(dataForm.entries());

        datos.activo = true;
        datos.fechaRegistro = new Date();

        const enviarFormulario = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarUsuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                const data = await respuesta.json();
                console.log('Datos alcenados correctamente: ', data);
                if (respuesta.ok) {
                    window.location.href = './listado.html';
                }
            } catch (error) {
                console.log('Ha ocurrido un error: ', error);
            }
        }
        enviarFormulario();
    } else {
        campoError.show();
    }
};

function validarInput(elemento) {
    const campo = $(elemento)
    if ($(elemento).val() == '') {
        campo.addClass('is-invalid');
        campo.removeClass('is-valid');
        return false
    } else {
        campo.removeClass('is-invalid');
        campo.addClass('is-valid');
        return true
    }
};

function validarCorreo(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const correo = $(elemento).val();
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regexCorreo.test(correo)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorEmailRequerido').remove();
            agregarError('<li>El EMAIL es inválido.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }else{

    }
};

function validarContrasena(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const password = $(elemento).val();
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        if (regexContrasena.test(password)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorContrasenaRequerido').remove();
            agregarError('<li>Su contraseña NO es segura, recuerde incluir al menos:<ul><li>1 Letra mayúscula.</li><li>1 Letra minúscula.</li><li>1 dígito.</li><li>1 caracter especial.</li><li>8 caracteres como mínimo.</li></ul></li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }
};

function validarRepetirContrasena(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        if ($(elemento).val() === $('#input_contrasena').val()) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorRepetirContrasenaRequerido').remove();
            agregarError('<li>Sus contraseñas no son iguales.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }
};

function agregarError(mensaje) {
    let mensajeError = '';
    let listaErrores = $('#listaErrores');
    mensajeError += mensaje;
    listaErrores.append(mensajeError);
}

async function cargarInfoPaises() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerPaises');
        const paises = await respuesta.json();
        console.log(paises);

        const select = $('#selectNacionalidad');
        $.each(paises, function (index,pais) {
            select.append($('<option>', {
                value: pais.iso2,
                text: pais.nacionalidad
            }));
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
};

async function cargarInfoComunas() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerComunas');
        const comunas = await respuesta.json();
        console.log(comunas);

        const select = $('#selectComuna');
        $.each(comunas, function (index,comuna) {
            select.append($('<option>', {
                value: comuna.codigo,
                text: comuna.nombre
            }));
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
};

const algoritmoRut = {
    valida: function (rutIngresado) {
        let rutLimpio = rutIngresado.replace(/[\.\s]/g, "").replace("‐", "-");

        if (!rutLimpio.includes("-") && rutLimpio.length > 1) {
            rutLimpio = rutLimpio.slice(0, -1) + "-" + rutLimpio.slice(-1);
        }

        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutLimpio)) {
            return false;
        }

        let partes = rutLimpio.split('-');
        let digitoVerificador = partes[1].toLowerCase(); 
        let numeroRut = partes[0];
        
        return (this.dv(numeroRut) == digitoVerificador);
    },
    
    dv: function(T) {
        let M = 0, S = 1;
        for(; T; T = Math.floor(T / 10)) {
            S = (S + T % 10 * (9 - M++ % 6)) % 11;
        }
        return S ? S - 1 : 'k';
    }
};

function validarRut(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const rut = campo.val();

        if (algoritmoRut.valida(rut)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true;
        } else {
            $('#errorRutRequerido').remove(); 
            agregarError('<li>El RUT es inválido, recuerde que el formato es XXXXXXXX-X</li>');
            
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false;
        }
    } else {
        return false;
    }
};

function esTelefonoChilenoValido(telefono) {
    let telefonoLimpio = telefono.replace(/[\s\-+]/g, '');

    const regex = /^56\d{9}$/;

    return regex.test(telefonoLimpio);
};

function validarTelefono(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const telefono = campo.val();

        if (esTelefonoChilenoValido(telefono)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true;
        } else {
            $('#errorTelefonoRequerido').remove();
            agregarError('<li>El TELÉFONO es inválido. Debe comenzar con 56 (ej: 56912345678).</li>');
            
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false;
        }
    } else {
        return false;
    }
};