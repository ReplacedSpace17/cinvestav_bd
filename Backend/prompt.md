mira, tengo que hacer una plataforma para cargar informacion recolectada de biologia , pero actualmente se tiene un fomrulario como este para recolectar datos, actualmente son 6 tipos de formulario, pero como son unos idiotas los biologos, no saben normalizar una tabla, entonces ahorita quieren una base de datos para centrallizar l a informacions

El id de usuario, para ṕara saber que usuario registro la info, es decir, es otro tabla llamasa usuarios, nombre, appellido p, y materno, y ocntraseña
enotnces necesito hacer la bd pero acorde a lo que ellos registrarn , puedes ayudareme?
metagenomica
    --datos generales
        link detalle de muestreo
        mes y año
        id_usuario
    --caracterisica de la muetsra
        id_muestra(escrita por usuario)
        genero
        numero de cepario gob
        sitio
        sitio especifico
        tipo de muestra
        caracteristica de la muestra
    --datsos de secuencia
        tipo de analisis
        metodo de extracion
        plataforma de ecuenciacion
        lugar de secuenciacion
        link_datos crudos
        link_secuencias ensambladas
        software o pipeline utiizado
        bioproject
        biosample
        sra
        ncbi assembly
    -- datos administrativos
        software o pipeline usado
        publicaciones asociadas
        notas o comentarios
    link auxiliar

16s
    --datos generales
        fecha mes y año
        nombre de cepa
        estrategia de muestreo
        id_usuario
    --informacion del sitio
        sitio
        sitio especifico
        profundidad
        tipo de muestra
    --datos de secuencia
        tratamiento
        fenotipo 1
        fenotipo 2
        fenotipo 3
        secuencia
        longitud de secuencia
    --enlaces
        link imagenes cepas puras
        link imagenes muestreo
        links ufc
        link detalles
    link auxiliar

16s articulo
    id_usuario
    --informacion del sitio
        fecha mes y año
        sitio
        sitio especifico
        profundidad
        tipo de muestra
        secuencia
        longitud de secuencia
    --informacion ncbi
        bioproject
        biosample
        sra
        ncbi assembly
        accession
        genomas
        taxonomias
    link auxiliar

18s
    --datos generales
        id_usuario
        fecha mes y año
        nombre de cepa
        estrategia de muestreo
    --infomracion del sitio
        sitio
        sitio especifico
        profundidad
        tipo de muestra
    --datos de secuencia
        tratamiento
        fenotipo 1
        fenotipo 2
        fenotipo 3
        secuencia
        longitud de secuencia
    --enlaces
        link imagenes cepas puras
        link imagenes muestreo
        links ufc
        link detalles

metagenomas
    --datos generales
        id_usuario
        link detalle de muestreo
        mes y año
    --caracterisica de la muetsra
        id_muestra(escrita por usuario)
        sitio
        sitio especifico
        tipo de muestra
        caracteristicas especificas de la muestra
    --datos de secuencia
        tipo de analisis
        metodo de extracion
        plataforma de secuenciacion
        lugar de secuenciacion
        link_datos crudos
        link_secuencias ensambladas
        software o pipeline utiizado
        bioproject
        biosample
        sra
        ncbi assembly
    -- datos administrativos
        software o pipeline usado
        publicaciones asociadas
        notas o comentarios
    link auxiliar

its
    --datos generales
        link detalle de muestreo
        mes y año
        id_usuario
    --caracterisica de la muetsra
        id_muestra(escrita por usuario)
        sitio
        sitio especifico
        tipo de muestra
        caracteristica de la muestra
    --datos de secuencia
        tipo de analisis
        metodo de extracion
        plataforma de secuenciacion
        lugar de secuenciacion
        link_datos crudos
        link_secuencias ensambladas
        software o pipeline utiizado
        bioproject
        biosample
        sra
        ncbi assembly
    -- datos administrativos
        software o pipeline usado
        publicaciones asociadas
        notas o comentarios
    link auxiliar 


puedes plantearme algo bien normalizado y me das een sql porfa


Y no le llames formularios, si no analisis