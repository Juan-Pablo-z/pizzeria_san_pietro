export const groupByWeek = (data: any[]) => {
  const groupedFinance: any = {
    fecha_rd: 0,
    salarios_rd: 0,
    arriendo_rd: 0,
    gas_rd: 0,
    servicios_rd: 0,
    vehiculo_rd: 0,
    banco_rd: 0,
    compras_rd: 0,
    varios_rd: 0,
    ventas_rd: 0,
  };

  const grouped = data.reduce((acc: any, item: any) => {
    // Obtener la fecha del reporte
    const date = new Date(item.fecha_rd);

    // Calcular el primer día de la semana (lunes)
    const dayOfWeek = date.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7; // Lunes es 0, Domingo es 6
    date.setDate(date.getDate() - diffToMonday); // Ajustar la fecha al lunes de esa semana

    // Usar el lunes de la semana como identificador
    const startDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const endDate = new Date(date); // Copiar la fecha
    endDate.setDate(date.getDate() + 6); // Sumar 6 días para obtener el domingo

    if (!acc[startDate]) {
      acc[startDate] = {
        startDate: date,
        endDate: endDate,
        dailyReports: [],
      };
    }

    // Agregar el reporte diario a la semana correspondiente
    acc[startDate].dailyReports.push(item);

    // Sumar los valores del reporte diario a los totales de la semana
    Object.keys(item).forEach((key) => {
      if (key !== "fecha_rd") {
        groupedFinance[key] += item[key];
        acc[startDate][key] = (acc[startDate][key] || 0) + item[key];
      }
    });

    return acc;
  }, {});

  return {
    finances: groupedFinance,
    reportes: Object.values(grouped),
  };
};