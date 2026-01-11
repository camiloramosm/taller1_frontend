// Configuración centralizada del sitio
export const SITE_CONFIG = {
  nombre: 'El Campo de Don Ramón',
  descripcion: 'Café premium colombiano de origen',
  
  // Datos de contacto
  contacto: {
    email: 'contacto@elcampodedonramon.com',
    telefono: '+57 318 741 0586',
    whatsapp: '573187410586',
  },
  
  // Redes sociales
  redesSociales: {
    instagram: 'https://instagram.com/elcampodedonramon',
    facebook: 'https://facebook.com/elcampodedonramon',
  },
  
  // Ubicación
  ubicacion: {
    direccion: 'Armenia, Quindío, Colombia',
    ciudad: 'Armenia',
    departamento: 'Quindío',
    pais: 'Colombia',
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
