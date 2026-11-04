
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rolos_motos_cars_citas'
const CLIENTS_KEY = 'rolos_motos_cars_clientes'
const VEHICLES_KEY = 'rolos_motos_cars_vehiculos'

const emptyForm = {
  clienteId: '',
  vehiculoId: '',
  fecha: '',
  hora: '',
  servicio: 'Mantenimiento general',
  estado: 'Programada',
  observaciones: '',
}

const serviciosDisponibles = [
  'Mantenimiento general',
  'Cambio de aceite',
  'Diagnóstico mecánico',
  'Reparación mecánica',
  'Revisión de frenos',
  'Revisión eléctrica',
  'Otro',
]

const estadosDisponibles = [
  'Programada',
  'Confirmada',
  'En proceso',
  'Completada',
  'Cancelada',
]

function Citas() {
  const [citas, setCitas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  const [clientes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || []
    } catch {
      return []
    }
  })

  const [vehiculos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(VEHICLES_KEY)) || []
    } catch {
      return []
    }
  })

  const [formulario, setFormulario] = useState(emptyForm)
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citas))
  }, [citas])

  const vehiculosDelCliente = vehiculos.filter(
    (vehiculo) => vehiculo.propietarioId === formulario.clienteId
  )

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => {
      if (name === 'clienteId') {
        return {
          ...anterior,
          clienteId: value,
          vehiculoId: '',
        }
      }

      return {
        ...anterior,
        [name]: value,
      }
    })

    setMensaje('')
  }

  const obtenerCliente = (id) => {
    return clientes.find((cliente) => cliente.id === id)
  }

  const obtenerVehiculo = (id) => {
    return vehiculos.find((vehiculo) => vehiculo.id === id)
  }

  const guardarCita = (e) => {
    e.preventDefault()

    if (!obtenerCliente(formulario.clienteId)) {
      setMensaje('Debes seleccionar un cliente válido.')
      return
    }

    const vehiculo = obtenerVehiculo(formulario.vehiculoId)

    if (!vehiculo || vehiculo.propietarioId !== formulario.clienteId) {
      setMensaje('Debes seleccionar un vehículo válido del cliente.')
      return
    }

    const citaDuplicada = citas.some(
      (cita) =>
        cita.vehiculoId === formulario.vehiculoId &&
        cita.fecha === formulario.fecha &&
        cita.hora === formulario.hora &&
        cita.estado !== 'Cancelada' &&
        cita.id !== editando
    )

    if (citaDuplicada) {
      setMensaje(
        'Este vehículo ya tiene una cita activa en esa fecha y hora.'
      )
      return
    }

    const datos = {
      ...formulario,
      observaciones: formulario.observaciones.trim(),
    }

    if (editando) {
      setCitas((anteriores) =>
        anteriores.map((cita) =>
          cita.id === editando
            ? { ...cita, ...datos }
            : cita
        )
      )

      setMensaje('Cita actualizada correctamente.')
    } else {
      setCitas((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...datos,
          creadaEn: new Date().toISOString(),
        },
      ])

      setMensaje('Cita registrada correctamente.')
    }

    setFormulario(emptyForm)
    setEditando(null)
  }

  const editarCita = (cita) => {
    setFormulario({
      clienteId: cita.clienteId,
      vehiculoId: cita.vehiculoId,
      fecha: cita.fecha,
      hora: cita.hora,
      servicio: cita.servicio,
      estado: cita.estado,
      observaciones: cita.observaciones || '',
    })

    setEditando(cita.id)
    setMensaje('')
  }

  const cancelarEdicion = () => {
    setFormulario(emptyForm)
    setEditando(null)
    setMensaje('')
  }

  const eliminarCita = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar esta cita?'
    )

    if (!confirmar) return

    setCitas((anteriores) =>
      anteriores.filter((cita) => cita.id !== id)
    )

    if (editando === id) {
      cancelarEdicion()
    }

    setMensaje('Cita eliminada correctamente.')
  }

  const citasFiltradas = citas.filter((cita) => {
    const termino = busqueda.toLowerCase().trim()

    const cliente = obtenerCliente(cita.clienteId)
    const vehiculo = obtenerVehiculo(cita.vehiculoId)

    const nombreCliente = cliente?.nombre || 'Cliente no disponible'
    const placa = vehiculo?.placa || ''
    const marca = vehiculo?.marca || ''
    const modelo = vehiculo?.modelo || ''

    return (
      nombreCliente.toLowerCase().includes(termino) ||
      placa.toLowerCase().includes(termino) ||
      marca.toLowerCase().includes(termino) ||
      modelo.toLowerCase().includes(termino) ||
      cita.servicio.toLowerCase().includes(termino) ||
      cita.fecha.toLowerCase().includes(termino) ||
      cita.estado.toLowerCase().includes(termino)
    )
  })

  const formatearFecha = (fecha) => {
    if (!fecha) return ''

    const [anio, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${anio}`
  }

  return (
    <section className="dashboard clients-module appointments-module">

      <div className="clients-intro">
        <div>
          <span className="eyebrow">PLANIFICACIÓN Y SERVICIO</span>
          <h2>Gestión de citas</h2>
          <p>
            Programa y administra los servicios de tus clientes.
          </p>
        </div>

        <div className="clients-counter">
          <strong>{citas.length}</strong>
          <span>CITAS REGISTRADAS</span>
        </div>
      </div>

      <div className="appointment-summary">

        <article className="appointment-stat">
          <span>PROGRAMADAS</span>
          <strong>
            {citas.filter((cita) => cita.estado === 'Programada').length}
          </strong>
        </article>

        <article className="appointment-stat">
          <span>CONFIRMADAS</span>
          <strong>
            {citas.filter((cita) => cita.estado === 'Confirmada').length}
          </strong>
        </article>

        <article className="appointment-stat">
          <span>EN PROCESO</span>
          <strong>
            {citas.filter((cita) => cita.estado === 'En proceso').length}
          </strong>
        </article>

        <article className="appointment-stat">
          <span>COMPLETADAS</span>
          <strong>
            {citas.filter((cita) => cita.estado === 'Completada').length}
          </strong>
        </article>

      </div>

      <div className="clients-layout">

        <article className="panel-card client-form-card">

          <div className="panel-heading">
            <div>
              <span className="eyebrow">AGENDA DE SERVICIO</span>
              <h3>{editando ? 'Editar cita' : 'Programar nueva cita'}</h3>
            </div>

            <span className="heading-symbol">◷</span>
          </div>

          {clientes.length === 0 || vehiculos.length === 0 ? (
            <div className="clients-empty">
              <span>◈</span>
              <p>
                Primero debes registrar clientes y vehículos para poder
                programar citas.
              </p>
            </div>
          ) : (

            <form className="client-form" onSubmit={guardarCita}>

              <label>
                Cliente

                <select
                  name="clienteId"
                  value={formulario.clienteId}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccionar cliente</option>

                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.identificacion}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Vehículo

                <select
                  name="vehiculoId"
                  value={formulario.vehiculoId}
                  onChange={manejarCambio}
                  required
                  disabled={!formulario.clienteId}
                >
                  <option value="">
                    {formulario.clienteId
                      ? 'Seleccionar vehículo'
                      : 'Primero selecciona un cliente'}
                  </option>

                  {vehiculosDelCliente.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                    </option>
                  ))}
                </select>
              </label>

              {formulario.clienteId && vehiculosDelCliente.length === 0 && (
                <p className="appointment-warning">
                  Este cliente todavía no tiene vehículos registrados.
                </p>
              )}

              <label>
                Fecha de la cita

                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                  required
                />
              </label>

              <label>
                Hora

                <input
                  type="time"
                  name="hora"
                  value={formulario.hora}
                  onChange={manejarCambio}
                  required
                />
              </label>

              <label>
                Tipo de servicio

                <select
                  name="servicio"
                  value={formulario.servicio}
                  onChange={manejarCambio}
                  required
                >
                  {serviciosDisponibles.map((servicio) => (
                    <option key={servicio} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Estado de la cita

                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  required
                >
                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Observaciones

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={manejarCambio}
                  placeholder="Describe brevemente el motivo de la cita..."
                  rows="3"
                  maxLength="300"
                />
              </label>

              <div className="client-form-actions">

                <button className="primary-button" type="submit">
                  {editando ? 'Guardar cambios' : 'Registrar cita'}
                </button>

                {editando && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}

              </div>

              {mensaje && (
                <p className="client-message" role="status">
                  {mensaje}
                </p>
              )}

            </form>
          )}

        </article>

        <article className="panel-card client-list-card">

          <div className="panel-heading">
            <div>
              <span className="eyebrow">CONTROL DE AGENDA</span>
              <h3>Citas registradas</h3>
            </div>

            <span className="heading-symbol">▤</span>
          </div>

          <input
            className="client-search"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, placa, servicio o estado..."
            aria-label="Buscar citas"
          />

          {citasFiltradas.length === 0 ? (

            <div className="clients-empty">
              <span>◷</span>

              <p>
                {citas.length === 0
                  ? 'Todavía no hay citas registradas.'
                  : 'No se encontraron citas con esa búsqueda.'}
              </p>
            </div>

          ) : (

            <div className="clients-table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Cliente y vehículo</th>
                    <th>Fecha y hora</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {citasFiltradas.map((cita) => {
                    const cliente = obtenerCliente(cita.clienteId)
                    const vehiculo = obtenerVehiculo(cita.vehiculoId)

                    return (
                      <tr key={cita.id}>

                        <td>
                          <strong>
                            {cliente?.nombre || 'Cliente no disponible'}
                          </strong>

                          <small>
                            {vehiculo
                              ? `${vehiculo.marca} ${vehiculo.modelo} · ${vehiculo.placa}`
                              : 'Vehículo no disponible'}
                          </small>
                        </td>

                        <td>
                          <strong>{formatearFecha(cita.fecha)}</strong>
                          <small>{cita.hora}</small>
                        </td>

                        <td>
                          <strong>{cita.servicio}</strong>

                          {cita.observaciones && (
                            <small>{cita.observaciones}</small>
                          )}
                        </td>

                        <td>
                          <span
                            className={`appointment-status status-${cita.estado
                              .toLowerCase()
                              .replaceAll(' ', '-')}`}
                          >
                            {cita.estado}
                          </span>
                        </td>

                        <td>
                          <div className="client-actions">

                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => editarCita(cita)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => eliminarCita(cita.id)}
                            >
                              Eliminar
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>
          )}

        </article>

      </div>

      {mensaje && (
        <p className="appointment-bottom-message" role="status">
          {mensaje}
        </p>
      )}

    </section>
  )
}

export default Citas
