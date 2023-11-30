import axios from "axios";

class CalcularReserva {
  constructor() {
    this.url =
      "https://luegopago.blob.core.windows.net/luegopago-uploads/Pruebas%20LuegoPago/data.json";
  }

  async calcularEspaciosDisponibles(diaConsulta) {
    const response = await axios.get(this.url).catch((error) => {
      console.log(error);
      return [];
    });

    const citasDia = response.data.filter(
      (cita) => cita.Day.toLowerCase() === diaConsulta.toLowerCase()
    );

    const horaInicioAtencion = new Date("1970-01-01T09:00:00");
    const horaFinAtencion = new Date("1970-01-01T17:00:00");

    let tiempoActual = horaInicioAtencion;
    let bloquesDisponibles = 0;

    citasDia.forEach((cita) => {
      const horaInicioCita = new Date(`1970-01-01T${cita.Hour}`);
      const duracionCita = parseInt(cita.Duration);

      const tiempoDisponibleAntes =
        (horaInicioCita - tiempoActual) / (1000 * 60);

      bloquesDisponibles += Math.floor(tiempoDisponibleAntes / 30);

      tiempoActual = new Date(horaInicioCita.getTime() + duracionCita * 60000);
    });

    const tiempoDisponibleDespuesUltimaCita =
      (horaFinAtencion - tiempoActual) / (1000 * 60);
    bloquesDisponibles += Math.floor(tiempoDisponibleDespuesUltimaCita / 30);

    return bloquesDisponibles;
  }

  recolectar_Json = async (req, res) => {
    const diaConsulta = req.body.dia;
    const bloquesDisponiblesDia = await this.calcularEspaciosDisponibles(
      diaConsulta
    );

    return res.success(
      `Espacios disponibles el ${diaConsulta}: ${bloquesDisponiblesDia}`
    );
  };
}

export default new CalcularReserva();
