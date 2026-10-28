# portafolio_de_MorraLenteja

## Configurar Supabase y el panel

1. En Supabase → Authentication → Users, crear la cuenta de `morra.lenteja@gmail.com` con una contraseña privada. No guardar la contraseña en GitHub.
2. En SQL Editor, ejecutar todo el archivo `supabase/setup.sql`. La operación falla sin realizar cambios si la cuenta aún no existe. La política identifica a esa cuenta por su ID y permite lectura pública, pero solo ella puede actualizar la configuración.
3. Desactivar el registro público de cuentas en Authentication → Sign In / Providers → Allow new users to sign up, una vez creada la cuenta. Si se elimina y vuelve a crear, ejecutar de nuevo el SQL para actualizar la política con el nuevo ID.
4. Entrar en `admin.html` con el correo y la contraseña de Supabase. Editar disponibilidad, precios y entrega, y comprobar los cambios desde otra sesión.

Las claves publishable son públicas y deben usarse con las políticas de seguridad de la tabla. Nunca publicar claves secret o service_role. El panel mantiene la sesión solo en la página y requiere iniciar sesión de nuevo al recargar o caducar el acceso.

## Formulario de contacto

El formulario sigue usando Google Apps Script. Para que el cierre de comisiones también se respete en el servidor:

1. Abrir el proyecto de Apps Script existente, reemplazar su código por `ContactoScript.gs` y guardar.
2. En Gestionar implementaciones, editar la aplicación web, seleccionar Nueva versión y publicar. Mantener «Ejecutar como: yo» y acceso para cualquier usuario.
3. Autorizar el acceso a servicios externos si Google lo solicita y probar un envío desde la página. Comprobar también que se rechacen solicitudes cuando las comisiones estén cerradas.

No publicar la nueva página antes de configurar Supabase y actualizar Apps Script: mientras no pueda consultar la disponibilidad, el sitio deshabilitará los botones de contacto. La imagen promocional original incluye precios dentro del PNG y debe actualizarse manualmente si cambian; los textos se actualizan desde el panel. El endpoint de contacto público requiere medidas adicionales contra spam y está sujeto a las cuotas de Gmail.
