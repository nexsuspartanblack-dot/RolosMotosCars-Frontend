
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rolos_motos_cars_servicios'
const CLIENTS_KEY = 'rolos_motos_cars_clientes'
const VEHICLES_KEY = 'rolos_motos_cars_vehiculos'

const emptyForm = {
  clienteId: '',
  vehiculoId: '',
  tipo: 'Mantenimiento general',
  fecha: new Date().toISOString().slice(0, 10),
  costo: '',
  estado: 'Pendiente',
  observaciones: '',
}

const tiposServicio = [
  'Mantenimiento general',
  'Cambio de aceite',
  'Diagnóstico mecánico',
  'Reparación mecánica',
  'Revisión de frenos',
  'Revisión eléctrica',
  'Cambio de llantas',
  'Otro',
]

const estadosServicio = [
  'Pendiente',
  'En proceso',
  'Finalizado',
]

function Servicios() {
  const [servicios, setServicios] = useState(() => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicios))
  }, [servicios])

  const vehiculosDelCliente = vehiculos.filter(
    (vehiculo) => vehiculo.propietarioId === formulario.clienteId
  )

  const obtenerCliente = (id) => {
    return clientes.find((cliente) => cliente.id === id)
  }

  const obtenerVehiculo = (id) => {
    return vehiculos.find((vehiculo) => vehiculo.id === id)
  }

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

  const guardarServicio = (e) => {
    e.preventDefault()

    const cliente = obtenerCliente(formulario.clienteId)
    const vehiculo = obtenerVehiculo(formulario.vehiculoId)

    if (!cliente) {
      setMensaje('Debes seleccionar un cliente válido.')
      return
    }

    if (!vehiculo || vehiculo.propietarioId !== formulario.clienteId) {
      setMensaje('Debes seleccionar un vehículo válido del cliente.')
      return
    }

    if (formulario.costo === '' || Number(formulario.costo) < 0) {
      setMensaje('Introduce un costo válido para el servicio.')
      return
    }

    const datos = {
      ...formulario,
      costo: Number(formulario.costo),
      observaciones: formulario.observaciones.trim(),
    }

    if (editando) {
      setServicios((anteriores) =>
        anteriores.map((servicio) =>
          servicio.id === editando
            ? { ...servicio, ...datos }
            : servicio
        )
      )

      setMensaje('Servicio actualizado correctamente.')
    } else {
      setServicios((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...datos,
          creadoEn: new Date().toISOString(),
        },
      ])

      setMensaje('Servicio registrado correctamente.')
    }

    setFormulario(emptyForm)
    setEditando(null)
  }

  const editarServicio = (servicio) => {
    setFormulario({
      clienteId: servicio.clienteId,
      vehiculoId: servicio.vehiculoId,
      tipo: servicio.tipo,
      fecha: servicio.fecha,
      costo: String(servicio.costo),
      estado: servicio.estado,
      observaciones: servicio.observaciones || '',
    })

    setEditando(servicio.id)
    setMensaje('')
  }

  const cancelarEdicion = () => {
    setFormulario(emptyForm)
    setEditando(null)
    setMensaje('')
  }

  const eliminarServicio = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este servicio?'
    )

    if (!confirmar) return

    setServicios((anteriores) =>
      anteriores.filter((servicio) => servicio.id !== id)
    )

    if (editando === id) {
      cancelarEdicion()
    }

    setMensaje('Servicio eliminado correctamente.')
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''

    const [anio, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${anio}`
  }

  const formatearCosto = (costo) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(costo)
  }

  const serviciosFiltrados = servicios.filter((servicio) => {
    const termino = busqueda.toLowerCase().trim()

    const cliente = obtenerCliente(servicio.clienteId)
    const vehiculo = obtenerVehiculo(servicio.vehiculoId)

    return (
      (cliente?.nombre || '').toLowerCase().includes(termino) ||
      (vehiculo?.placa || '').toLowerCase().includes(termino) ||
      (vehiculo?.marca || '').toLowerCase().includes(termino) ||
      (vehiculo?.modelo || '').toLowerCase().includes(termino) ||
      servicio.tipo.toLowerCase().includes(termino) ||
      servicio.estado.toLowerCase().includes(termino) ||
      servicio.fecha.toLowerCase().includes(termino)
    )
  })

  const totalServicios = servicios.reduce(
    (total, servicio) => total + servicio.costo,
    0
  )

  return (
    <section className="dashboard clients-module services-module">

      <div className="clients-intro">
        <div>
          <span className="eyebrow">CENTRO DE OPERACIONES</span>
          <h2>Gestión de servicios</h2>
          <p>Controla los trabajos y mantenimientos del taller.</p>
        </div>

        <div className="clients-counter">
          <strong>{servicios.length}</strong>
          <span>SERVICIOS REGISTRADOS</span>
        </div>
      </div>

      <div className="service-summary">

        <article className="service-stat">
          <span>PENDIENTES</span>
          <strong>
            {servicios.filter(
              (servicio) => servicio.estado === 'Pendiente'
            ).length}
          </strong>
        </article>

        <article className="service-stat">
          <span>EN PROCESO</span>
          <strong>
            {servicios.filter(
              (servicio) => servicio.estado === 'En proceso'
            ).length}
          </strong>
        </article>

        <article className="service-stat">
          <span>FINALIZADOS</span>
          <strong>
            {servicios.filter(
              (servicio) => servicio.estado === 'Finalizado'
            ).length}
          </strong>
        </article>

        <article className="service-stat">
          <span>VALOR REGISTRADO</span>
          <strong className="service-total">
            {formatearCosto(totalServicios)}
          </strong>
        </article>

      </div>

      <div className="clients-layout">

        <article className="panel-card client-form-card">

          <div className="panel-heading">
            <div>
              <span className="eyebrow">ORDEN DE TRABAJO</span>
              <h3>{editando ? 'Editar servicio' : 'Nuevo servicio'}</h3>
            </div>

            <span className="heading-symbol">⚙</span>
          </div>

          {clientes.length === 0 || vehiculos.length === 0 ? (

            <div className="clients-empty">
              <span>◈</span>
              <p>
                Primero debes registrar clientes y vehículos.
              </p>
            </div>

          ) : (

            <form className="client-form" onSubmit={guardarServicio}>

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
                <p className="service-warning">
                  Este cliente no tiene vehículos registrados.
                </p>
              )}

              <label>
                Tipo de servicio

                <select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={manejarCambio}
                  required
                >
                  {tiposServicio.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Fecha del servicio

                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                  required
                />
              </label>

              <label>
                Costo del servicio (COP)

                <input
                  type="number"
                  name="costo"
                  value={formulario.costo}
                  onChange={manejarCambio}
                  placeholder="Ej. 150000"
                  min="0"
                  step="1000"
                  required
                />
              </label>

              <label>
                Estado

                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  required
                >
                  {estadosServicio.map((estado) => (
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
                  placeholder="Describe el trabajo realizado o pendiente..."
                  rows="3"
                  maxLength="300"
                />
              </label>

              <div className="client-form-actions">

                <button className="primary-button" type="submit">
                  {editando ? 'Guardar cambios' : 'Registrar servicio'}
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
              <span className="eyebrow">HISTORIAL DE TRABAJOS</span>
              <h3>Servicios registrados</h3>
            </div>

            <span className="heading-symbol">▤</span>
          </div>

          <input
            className="client-search"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente, placa, servicio o estado..."
            aria-label="Buscar servicios"
          />

          {serviciosFiltrados.length === 0 ? (

            <div className="clients-empty">
              <span>⚙</span>
              <p>
                {servicios.length === 0
                  ? 'Todavía no hay servicios registrados.'
                  : 'No se encontraron servicios con esa búsqueda.'}
              </p>
            </div>

          ) : (

            <div className="clients-table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Cliente y vehículo</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Costo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {serviciosFiltrados.map((servicio) => {
                    const cliente = obtenerCliente(servicio.clienteId)
                    const vehiculo = obtenerVehiculo(servicio.vehiculoId)

                    return (
                      <tr key={servicio.id}>

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
                          <strong>{servicio.tipo}</strong>

                          {servicio.observaciones && (
                            <small>{servicio.observaciones}</small>
                          )}
                        </td>

                        <td>
                          <strong>{formatearFecha(servicio.fecha)}</strong>
                        </td>

                        <td>
                          <strong className="service-price">
                            {formatearCosto(servicio.costo)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`service-status service-${servicio.estado
                              .toLowerCase()
                              .replaceAll(' ', '-')}`}
                          >
                            {servicio.estado}
                          </span>
                        </td>

                        <td>
                          <div className="client-actions">

                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => editarServicio(servicio)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => eliminarServicio(servicio.id)}
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

    </section>
  )
}

export default Servicios
