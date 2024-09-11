const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const fechaParser = fechaStr => {
    const fecha = new Date(fechaStr);


    const dia = String(fecha.getUTCDate());
    const mes = String(meses[fecha.getUTCMonth()]);
    const anio = fecha.getUTCFullYear();

    return `${dia} de ${mes} de ${anio}`;
}

export const badgeColors = [{estado: 'pendiente', class:'bg-primary'}, {estado: 'en revision', class:'bg-secondary'}, {estado: 'reparado', class:'bg-success'}, {estado: 'sin arreglo', class:'bg-danger'}]
