genomica
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



TABLA info_secuencias
-- id int
-- id_analisis int
-- type (enum 1 datos crudos, 2 secuencias ensambladas)
--extensión (.fasta, .fastaq)
--encabezado
--secuencias 


tabla de imagenes
-id int
-id_analisis
--nombre
--base64
--descripcion
