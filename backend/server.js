// Importar depedencias del backend, cada librería se almacenará en una constante
// La dependencia se almacenará como un objeto
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Iniciamos nuestra aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de nuetra aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Conexion a MongoDB
mongoose.connect('mongodb://localhost:27017/IEI_N3_C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse a la DB: ', excepcion));

// Testtear si efectivamente la APP está corriendo en el puerto especificado
const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, () => console.log(`Corriendo en el puerto: ${PORT}`));

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String,
    codigoPostal: String
});

const usuario = new mongoose.Schema({
    nombre: String,
    correo: String,
    contrasena: String,
    rut: String,
    telefono: String,
    genero: String,
    fechaNacimiento: String,
    nacionalidad: String,
    direccion:[direccion],
    activo: Boolean,
    fechaRegistro: Date
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const Pais = mongoose.model('Pais', pais, 'paises');

const comuna = new mongoose.Schema({
    codigo: String,
    nombre: String,
    region: String
});

const Comuna = mongoose.model('Comuna', comuna, 'comunas');

// Método POST para guardar datos de USUARIO
// Definimos el "ENDPOINT" o ruta final donde se canalizará la REQUEST (solicitud)
aplicacion.post('/guardarUsuario', async (request, response) => {
    try {
        //
        const { nombre, correo, contrasena, rut, telefono, genero, fechaNacimiento, nacionalidad, direccion, activo, fechaRegistro } = request.body;
        // Encriptamos la contraseña recibida desde frontend
        const salt = bcrypt.genSaltSync(10);
        const contrasenaHash = bcrypt.hashSync(contrasena, salt);

        const objetoDireccion = JSON.parse(direccion);
        const nuevoUsuario = new Usuario({ nombre, correo, contrasena: contrasenaHash, rut, telefono, genero, fechaNacimiento, nacionalidad, direccion: objetoDireccion, activo, fechaRegistro });

        await nuevoUsuario.save();
        response.status(200).json({ message: 'Datos Ingresados Correctamente' });
    }
    catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible guardar los datos: ', excepcion });
    }
});

// Método POST para guardar datos de PAISES
// Definimos el "ENDPOINT" o ruta final donde se canalizará la REQUEST (solicitud)
aplicacion.post('/guardarPaises', async (request, response) => {
    try {
        //
        const { nombre, iso2, iso3, codigoPais, nacionalidad } = request.body;
        const nuevoPais = new Pais({ nombre, iso2, iso3, codigoPais, nacionalidad });

        await nuevoPais.save();
        response.status(200).json({ message: 'Datos Ingresados Correctamente' });
    }
    catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible guardar los datos: ', excepcion });
    }
});

// Método GET para leer datos de USUARIOS
aplicacion.get('/obtenerUsuarios', async (request, response) => {
    try {
        // Obtenemos una lista de objetos de tipo Usuario
        const usuarios = await Usuario.aggregate([{
            $lookup:{
                from:'paises', // Colección desde la que queremos traer datos
                localField:'nacionalidad', // Campo de la colección con la info a buscar
                foreignField:'iso2', // Campo de la colección referenciada que quiero mostrar
                as:'gentilicio' // Nuevo nombre del campo con la info
            }
        }]);
        // En la RESPONSE (res) formateamos los usuarios como JSON y los enviamos
        response.json(usuarios);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Método GET para leer datos de PAISES
aplicacion.get('/obtenerPaises', async (request, response) => {
    try {
        // Obtenemos una lista de objetos de tipo Pais
        const paises = await Pais.find();
        // En la RESPONSE (res) formateamos los paises como JSON y los enviamos
        response.json(paises);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Método GET para leer datos de COMUNAS
aplicacion.get('/obtenerComunas', async (request, response) => {
    try {
        // Obtenemos una lista de objetos de tipo Comuna
        const comunas = await Comuna.find();
        // En la RESPONSE (res) formateamos las comunas como JSON y las enviamos
        response.json(comunas);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Si hay un error ERR_CONNECTION_REFUSED, puede ser porque el puerto estaba en uso...
// Usando el terminal de windows, buscamos el ID de la aplicación: netstat -ano | findstr :3000
// Teniendo el ID de la aplicación: taskkill /PID id_app /F