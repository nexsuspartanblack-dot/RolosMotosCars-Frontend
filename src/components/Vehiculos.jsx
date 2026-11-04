
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rolos_motos_cars_vehiculos'
const CLIENTS_KEY = 'rolos_motos_cars_clientes'

const emptyForm = {
  propietarioId: '',
  tipo: 'Motocicleta',
  marca: '',
  modelo: '',
  anio: '',
  placa: '',
  color: '',
}

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState(() => {
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

  const [formulario, setFormulario] = useState(emptyForm)
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehiculos))
  }, [vehiculos])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  const guardarVehiculo = (e) => {
    e.preventDefault()

    const placa = formulario.placa.trim().toUpperCase()

    const duplicado = vehiculos.some(
      (vehiculo) =>
        vehiculo.placa === placa &&
        vehiculo.id !== editando
    )

    if (duplicado) {
      setMensaje('Ya existe un vehículo registrado con esa placa.')
      return
    }

    const datos = {
      ...formulario,
      placa,
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      anio: formulario.anio.trim(),
      color: formulario.color.trim(),
    }

    if (editando) {
      setVehiculos((anteriores) =>
        anteriores.map((vehiculo) =>
          vehiculo.id === editando
            ? { ...vehiculo, ...datos }
            : vehiculo
        )
      )
      setMensaje('Vehículo actualizado correctamente.')
    } else {
      setVehiculos((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...datos,
        },
      ])
      setMensaje('Vehículo registrado correctamente.')
    }

    setFormulario(emptyForm)
    setEditando(null)
  }

  const editarVehiculo = (vehiculo) => {
    setFormulario({
      propietarioId: vehiculo.propietarioId,
      tipo: vehiculo.tipo,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      placa: vehiculo.placa,
      color: vehiculo.color,
    })

    setEditando(vehiculo.id)
    setMensaje('')
  }

  const cancelarEdicion = () => {
    setFormulario(emptyForm)
    setEditando(null)
    setMensaje('')
  }

  const eliminarVehiculo = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este vehículo?'
    )

    if (!confirmar) return

    setVehiculos((anteriores) =>
      anteriores.filter((vehiculo) => vehiculo.id !== id)
    )

    if (editando === id) {
      cancelarEdicion()
    }

    setMensaje('Vehículo eliminado correctamente.')
  }

  const obtenerPropietario = (id) => {
    return clientes.find((cliente) => cliente.id === id)?.nombre ||
      'Cliente no disponible'
  }

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const termino = busqueda.toLowerCase()

    return (
      vehiculo.placa.toLowerCase().includes(termino) ||
      vehiculo.marca.toLowerCase().includes(termino) ||
      vehiculo.modelo.toLowerCase().includes(termino) ||
      vehiculo.tipo.toLowerCase().includes(termino) ||
      vehiculo.color.toLowerCase().includes(termino) ||
      obtenerPropietario(vehiculo.propietarioId).toLowerCase().includes(termino)
    )
  })

  return (
    <section className="dashboard clients-module vehicles-module">
      <div className="clients-intro">
        <div>
          <span className="eyebrow">CONTROL AUTOMOTOR</span>
          <h2>Gestión de vehículos</h2>
          <p>Administra las motocicletas y automóviles de tus clientes.</p>
        </div>

        <div className="clients-counter">
          <strong>{vehiculos.length}</strong>
          <span>VEHÍCULOS REGISTRADOS</span>
        </div>
      </div>

      <div className="clients-layout">
        <article className="panel-card client-form-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">FICHA DEL VEHÍCULO</span>
              <h3>{editando ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
            </div>
            <span className="heading-symbol">◈</span>
          </div>

          <form className="client-form" onSubmit={guardarVehiculo}>
            <label>
              Propietario
              <select
                name="propietarioId"
                value={formulario.propietarioId}
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
              Tipo de vehículo
              <select
                name="tipo"
                value={formulario.tipo}
                onChange={manejarCambio}
                required
              >
                <option value="Motocicleta">Motocicleta</option>
                <option value="Automóvil">Automóvil</option>
              </select>
            </label>

            <label>
              Marca
              <input
                type="text"
                name="marca"
                value={formulario.marca}
                onChange={manejarCambio}
                placeholder="Ej. Honda, Yamaha, Toyota"
                required
                maxLength={50}
              />
            </label>

            <label>
              Modelo
              <input
                type="text"
                name="modelo"
                value={formulario.modelo}
                onChange={manejarCambio}
                placeholder="Ej. XTZ 150, Corolla"
                required
                maxLength={50}
              />
            </label>

            <label>
              Año
              <input
                type="number"
                name="anio"
                value={formulario.anio}
                onChange={manejarCambio}
                placeholder="Ej. 2024"
                min="1950"
                max={new Date().getFullYear() + 1}
                required
              />
            </label>

            <label>
              Placa
              <input
                type="text"
                name="placa"
                value={formulario.placa}
                onChange={manejarCambio}
                placeholder="Ej. ABC123"
                required
                maxLength={10}
              />
            </label>

            <label>
              Color
              <input
                type="text"
                name="color"
                value={formulario.color}
                onChange={manejarCambio}
                placeholder="Ej. Negro, rojo, azul"
                required
                maxLength={30}
              />
            </label>

            <div className="client-form-actions">
              <button className="primary-button" type="submit">
                {editando ? 'Guardar cambios' : 'Registrar vehículo'}
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
        </article>

        <article className="panel-card client-list-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">INVENTARIO AUTOMOTOR</span>
              <h3>Vehículos registrados</h3>
            </div>
            <span className="heading-symbol">▤</span>
          </div>

          <input
            className="client-search"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por placa, marca, modelo o propietario..."
            aria-label="Buscar vehículos"
          />

          {vehiculosFiltrados.length === 0 ? (
            <div className="clients-empty">
              <span>◈</span>
              <p>
                {vehiculos.length === 0
                  ? 'Todavía no hay vehículos registrados.'
                  : 'No se encontraron vehículos con esa búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="clients-table-wrapper">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Vehículo</th>
                    <th>Placa</th>
                    <th>Propietario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {vehiculosFiltrados.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                      <td>
                        <strong>{vehiculo.marca} {vehiculo.modelo}</strong>
                        <small>
                          {vehiculo.tipo} · {vehiculo.anio} · {vehiculo.color}
                        </small>
                      </td>
                      <td>
                        <strong className="vehicle-plate">
                          {vehiculo.placa}
                        </strong>
                      </td>
                      <td>
                        <strong>{obtenerPropietario(vehiculo.propietarioId)}</strong>
                      </td>
                      <td>
                        <div className="client-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => editarVehiculo(vehiculo)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => eliminarVehiculo(vehiculo.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default Vehiculos
