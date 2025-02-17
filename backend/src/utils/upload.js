const fs = require('fs'); // Para trabajar con el sistema de archivos
const path = require('path'); // Para manejar rutas de archivos
const multer = require('multer'); // Middleware para manejar la carga de archivos

// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id; // ID del usuario autenticado
    const uploadPath = path.join(__dirname, '../../public/uploads', userId.toString());

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Carpeta de destino
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extensión del archivo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nombre del archivo
  },
});

// Middleware de Multer para cargar archivos
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo permitidos
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF).'), false);
    }
  },
}).array('files', 5); // Permitir hasta 5 archivos por solicitud

// Función para subir archivos y devolver las URLs
exports.uploadFile = (file, userId) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(__dirname, '../../public/uploads', userId.toString());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + ext;
    const filePath = path.join(uploadPath, fileName);

    // Mover el archivo a la carpeta de destino
    file.mv(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        const fileUrl = `/uploads/${userId}/${fileName}`; // URL relativa del archivo
        resolve(fileUrl);
      }
    });
  });
};

// Middleware para manejar la carga de archivos
exports.uploadMiddleware = uploadMiddleware;