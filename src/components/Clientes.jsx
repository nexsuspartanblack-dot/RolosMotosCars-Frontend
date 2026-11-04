
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rolos_motos_cars_clientes'

const emptyForm = {
  nombre: '',
  identificacion: '',
  telefono: '',
  correo: '',
}

function Clientes() {
  const [clientes, setClientes] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY)
      return guardados ? JSON.parse(guardados) : []
    } catch {
      return []
    }
  })

  const [formulario, setFormulario] = useState(emptyForm)
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
  }, [clientes])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  const guardarCliente = (e) => {
    e.preventDefault()

    const identificacion = formulario.identificacion.trim()

    const duplicado = clientes.some(
      (cliente) =>
        cliente.identificacion === identificacion &&
        cliente.id !== editando
    )

    if (duplicado) {
      setMensaje('Ya existe un cliente con esa identificación.')
      return
    }

    const datos = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      identificacion,
      telefono: formulario.telefono.trim(),
      correo: formulario.correo.trim().toLowerCase(),
    }

    if (editando) {
      setClientes((anteriores) =>
        anteriores.map((cliente) =>
          cliente.id === editando
            ? { ...cliente, ...datos }
            : cliente
        )
      )
      setMensaje('Cliente actualizado correctamente.')
    } else {
      setClientes((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...datos,
        },
      ])
      setMensaje('Cliente registrado correctamente.')
    }

    setFormulario(emptyForm)
    setEditando(null)
  }

  const editarCliente = (cliente) => {
    setFormulario({
      nombre: cliente.nombre,
      identificacion: cliente.identificacion,
      telefono: cliente.telefono,
      correo: cliente.correo,
    })

    setEditando(cliente.id)
    setMensaje('')
  }

  const eliminarCliente = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este cliente?'
    )

    if (!confirmar) return

    setClientes((anteriores) =>
      anteriores.filter((cliente) => cliente.id !== id)
    )

    if (editando === id) {
      cancelarEdicion()
    }

    setMensaje('Cliente eliminado correctamente.')
  }

  const cancelarEdicion = () => {
    setFormulario(emptyForm)
    setEditando(null)
    setMensaje('')
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = busqueda.toLowerCase()

    return (
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.identificacion.toLowerCase().includes(termino) ||
      cliente.telefono.toLowerCase().includes(termino) ||
      cliente.correo.toLowerCase().includes(termino)
    )
  })

  return (
    <section className="dashboard clients-module">
      <div className="clients-intro">
        <div>
          <span className="eyebrow">BASE DE DATOS LOCAL</span>
          <h2>Gestión de clientes</h2>
          <p>Registra y administra los clientes del taller.</p>
        </div>

        <div className="clients-counter">
          <strong>{clientes.length}</strong>
          <span>CLIENTES REGISTRADOS</span>
        </div>
      </div>

      <div className="clients-layout">
        <article className="panel-card client-form-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">INFORMACIÓN PERSONAL</span>
              <h3>{editando ? 'Editar cliente' : 'Nuevo cliente'}</h3>
            </div>
            <span className="heading-symbol">♙</span>
          </div>

          <form className="client-form" onSubmit={guardarCliente}>
            <label>
              Nombre completo
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Nombre y apellidos"
                required
                maxLength={100}
              />
            </label>

            <label>
              Número de identificación
              <input
                type="text"
                name="identificacion"
                value={formulario.identificacion}
                onChange={manejarCambio}
                placeholder="Número de documento"
                required
                maxLength={30}
              />
            </label>

            <label>
              Teléfono
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
                placeholder="Número de contacto"
                required
                maxLength={20}
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
                placeholder="correo@ejemplo.com"
                required
                maxLength={120}
              />
            </label>

            <div className="client-form-actions">
              <button className="primary-button" type="submit">
                {editando ? 'Guardar cambios' : 'Registrar cliente'}
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
              <span className="eyebrow">DIRECTORIO</span>
              <h3>Clientes registrados</h3>
            </div>
            <span className="heading-symbol">▤</span>
          </div>

          <input
            className="client-search"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, documento, teléfono o correo..."
            aria-label="Buscar clientes"
          />

          {clientesFiltrados.length === 0 ? (
            <div className="clients-empty">
              <span>♙</span>
              <p>
                {clientes.length === 0
                  ? 'Todavía no hay clientes registrados.'
                  : 'No se encontraron clientes con esa búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="clients-table-wrapper">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Identificación</th>
                    <th>Contacto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <strong>{cliente.nombre}</strong>
                      </td>
                      <td>{cliente.identificacion}</td>
                      <td>
                        <span>{cliente.telefono}</span>
                        <small>{cliente.correo}</small>
                      </td>
                      <td>
                        <div className="client-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => editarCliente(cliente)}
                            aria-label={`Editar ${cliente.nombre}`}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => eliminarCliente(cliente.id)}
                            aria-label={`Eliminar ${cliente.nombre}`}
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

export default Clientes
