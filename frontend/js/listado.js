window.onload = function () {
    obtenerUsuarios();
}

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        const usuarios = await respuesta.json();

        new DataTable('#tablaUsuarios', {
            data: usuarios,
            columns: [
                { data: 'nombre' },
                { data: 'correo' },
                { data: 'rut' },
                { data: 'telefono' },
                {
                    data: 'genero',
                    'render': function (data, type, row) {
                        let respuesta = '';
                        switch (data) {
                            case 'masc':
                                respuesta = 'Masculino';
                                break;
                            case 'fem':
                                respuesta = 'Femenino';
                                break;
                            case 'otro':
                                respuesta = 'Otro';
                                break;
                        }
                        return respuesta;
                    }
                },
                { 
                    data: 'fechaNacimiento',
                    render: function (data) {
                        if (!data) return 'Sin fecha';
                        const fecha = new Date(data);
                        const dia = String(fecha.getUTCDate()).padStart(2, '0');
                        const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
                        const anio = fecha.getUTCFullYear();
                        
                        return `${dia}-${mes}-${anio}`;
                    }
                },
                { data: 'gentilicio[0].nombre' },
                { data: 'activo' },
                {
                    data: 'fechaRegistro',
                    defaultContent: 'Sin fecha',
                    render: function (data, type, row) {
                        if (!data) return 'Sin fecha';

                        const fecha = new Date(data);

                        const opciones = {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        };

                        return fecha.toLocaleDateString('es-CL', opciones);
                    }
                }
            ]
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
}

function cargarGenero(genero) {
    respuesta = '';
    switch (genero) {
        case 'masc':
            respuesta = 'Masculino';
        case 'fem':
            respuesta = 'Femenino';
        case 'otro':
            respuesta = 'Otro';
    }
    return respuesta;
}