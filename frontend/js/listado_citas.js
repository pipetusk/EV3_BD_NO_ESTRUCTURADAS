window.onload = function () {
    obtenerCitasMedicas();
};

async function obtenerCitasMedicas() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerCitas');
        const citas = await respuesta.json();

        new DataTable('#tablaCitas', {
            data: citas,
            columns: [
                { 
                    data: 'datosUsuario[0].nombre',
                    defaultContent: 'Usuario no encontrado'
                },
                { 
                    data: 'datosUsuario[0].rut',
                    defaultContent: 'Sin RUT registrado'
                },
                { 
                    data: 'especialidad',
                    defaultContent: 'Sin especialidad'
                },
                { 
                    data: 'medico',
                    defaultContent: 'Sin médico' 
                },
                { 
                    data: 'centroMedico',
                    defaultContent: 'Sin centro médico' 
                },
                { 
                    data: 'fecha',
                    defaultContent: 'Sin fecha',
                    render: function (data) {
                        if (!data) return 'Sin fecha';
                        const fechaObj = new Date(data);
                        const dia = String(fechaObj.getUTCDate()).padStart(2, '0');
                        const mes = String(fechaObj.getUTCMonth() + 1).padStart(2, '0');
                        const anio = fechaObj.getUTCFullYear();
                        return `${dia}-${mes}-${anio}`;
                    }
                },
                { 
                    data: 'hora',
                    defaultContent: 'Sin hora'
                },
                { 
                    data: 'costo',
                    defaultContent: '0',
                    render: function(data) {
                        if (!data) return '$0';
                        return `$${data.toLocaleString('es-CL')}`;
                    }
                }
            ]
        });
    } catch (error) {
        console.log('Error al recuperar los registros de citas médicas: ', error);
    }
};