
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rolos_motos_cars_repuestos'

const categorias = [
  'Motor',
  'Frenos',
  'Transmisión',
  'Suspensión',
  'Sistema eléctrico',
  'Llantas',
  'Lubricantes',
  'Filtros',
  'Accesorios',
  'Otros',
]

const formularioInicial = {
  nombre: '',
  referencia: '',
  categoria: 'Motor',
  marca: '',
  precio: '',
  stock: '',
  stockMinimo: '5',
  ubicacion: '',
  compatibilidad: '',
}

function leerRepuestos() {
  try {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function Repuestos() {
  const [repuestos, setRepuestos] = useState(leerRepuestos)
  const [formulario, setFormulario] = useState(formularioInicial)
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [filtroStock, setFiltroStock] = useState('Todos')
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repuestos))
  }, [repuestos])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    setMensaje('')
  }

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto)
    setTipoMensaje(tipo)
  }

  const limpiarFormulario = () => {
    setFormulario(formularioInicial)
    setEditando(null)
  }

  const guardarRepuesto = (e) => {
    e.preventDefault()

    const nombre = formulario.nombre.trim()
    const referencia = formulario.referencia.trim().toUpperCase()
    const marca = formulario.marca.trim()

    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)
    const stockMinimo = Number(formulario.stockMinimo)

    if (!nombre || !referencia || !marca) {
      mostrarMensaje('Completa los campos obligatorios.', 'error')
      return
    }

    if (
      formulario.precio === '' ||
      !Number.isFinite(precio) ||
      precio < 0
    ) {
      mostrarMensaje('Introduce un precio válido.', 'error')
      return
    }

    if (
      formulario.stock === '' ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      mostrarMensaje('La existencia debe ser un número entero igual o mayor que cero.', 'error')
      return
    }

    if (
      formulario.stockMinimo === '' ||
      !Number.isInteger(stockMinimo) ||
      stockMinimo < 0
    ) {
      mostrarMensaje('El stock mínimo debe ser un número entero igual o mayor que cero.', 'error')
      return
    }

    const referenciaDuplicada = repuestos.some(
      (repuesto) =>
        repuesto.referencia?.toUpperCase() === referencia &&
        repuesto.id !== editando
    )

    if (referenciaDuplicada) {
      mostrarMensaje('Ya existe un repuesto con esa referencia.', 'error')
      return
    }

    const datos = {
      nombre,
      referencia,
      categoria: formulario.categoria,
      marca,
      precio,
      stock,
      stockMinimo,
      ubicacion: formulario.ubicacion.trim(),
      compatibilidad: formulario.compatibilidad.trim(),
    }

    if (editando) {
      setRepuestos((anteriores) =>
        anteriores.map((repuesto) =>
          repuesto.id === editando
            ? {
                ...repuesto,
                ...datos,
                actualizadoEn: new Date().toISOString(),
              }
            : repuesto
        )
      )

      mostrarMensaje('Repuesto actualizado correctamente.')
    } else {
      setRepuestos((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...datos,
          creadoEn: new Date().toISOString(),
        },
      ])

      mostrarMensaje('Repuesto registrado correctamente.')
    }

    limpiarFormulario()
  }

  const editarRepuesto = (repuesto) => {
    setFormulario({
      nombre: repuesto.nombre || '',
      referencia: repuesto.referencia || '',
      categoria: repuesto.categoria || 'Otros',
      marca: repuesto.marca || '',
      precio: String(repuesto.precio ?? ''),
      stock: String(repuesto.stock ?? ''),
      stockMinimo: String(repuesto.stockMinimo ?? 5),
      ubicacion: repuesto.ubicacion || '',
      compatibilidad: repuesto.compatibilidad || '',
    })

    setEditando(repuesto.id)
    setMensaje('')
  }

  const cancelarEdicion = () => {
    limpiarFormulario()
    setMensaje('')
  }

  const eliminarRepuesto = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este repuesto del inventario?'
    )

    if (!confirmar) return

    setRepuestos((anteriores) =>
      anteriores.filter((repuesto) => repuesto.id !== id)
    )

    if (editando === id) {
      limpiarFormulario()
    }

    mostrarMensaje('Repuesto eliminado correctamente.')
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor)
  }

  const obtenerEstadoStock = (repuesto) => {
    if (repuesto.stock === 0) {
      return {
        texto: 'Agotado',
        clase: 'stock-agotado',
      }
    }

    if (repuesto.stock <= repuesto.stockMinimo) {
      return {
        texto: 'Stock bajo',
        clase: 'stock-bajo',
      }
    }

    return {
      texto: 'Disponible',
      clase: 'stock-disponible',
    }
  }

  const repuestosFiltrados = repuestos.filter((repuesto) => {
    const termino = busqueda.toLowerCase().trim()

    const coincideBusqueda =
      (repuesto.nombre || '').toLowerCase().includes(termino) ||
      (repuesto.referencia || '').toLowerCase().includes(termino) ||
      (repuesto.marca || '').toLowerCase().includes(termino) ||
      (repuesto.categoria || '').toLowerCase().includes(termino) ||
      (repuesto.ubicacion || '').toLowerCase().includes(termino) ||
      (repuesto.compatibilidad || '').toLowerCase().includes(termino)

    const coincideCategoria =
      filtroCategoria === 'Todas' ||
      repuesto.categoria === filtroCategoria

    const estado = obtenerEstadoStock(repuesto)

    const coincideStock =
      filtroStock === 'Todos' ||
      (filtroStock === 'Disponible' && estado.texto === 'Disponible') ||
      (filtroStock === 'Stock bajo' && estado.texto === 'Stock bajo') ||
      (filtroStock === 'Agotado' && estado.texto === 'Agotado')

    return coincideBusqueda && coincideCategoria && coincideStock
  })

  const unidadesTotales = repuestos.reduce(
    (total, repuesto) => total + Number(repuesto.stock || 0),
    0
  )

  const productosStockBajo = repuestos.filter(
    (repuesto) =>
      repuesto.stock > 0 &&
      repuesto.stock <= repuesto.stockMinimo
  ).length

  const productosAgotados = repuestos.filter(
    (repuesto) => repuesto.stock === 0
  ).length

  const valorInventario = repuestos.reduce(
    (total, repuesto) =>
      total + Number(repuesto.precio || 0) * Number(repuesto.stock || 0),
    0
  )

  return (
    <section className="dashboard clients-module spares-module">

      <div className="clients-intro">
        <div>
          <span className="eyebrow">CENTRO DE OPERACIONES</span>
          <h2>Control de repuestos</h2>
          <p>Administra las referencias y existencias del inventario.</p>
        </div>

        <div className="clients-counter">
          <strong>{repuestos.length}</strong>
          <span>REFERENCIAS REGISTRADAS</span>
        </div>
      </div>

      <div className="spares-summary">

        <article className="spare-stat">
          <span>REFERENCIAS</span>
          <strong>{repuestos.length}</strong>
          <small>Productos diferentes</small>
        </article>

        <article className="spare-stat">
          <span>UNIDADES EN INVENTARIO</span>
          <strong>{unidadesTotales}</strong>
          <small>Existencias totales</small>
        </article>

        <article className="spare-stat warning-stat">
          <span>STOCK BAJO</span>
          <strong>{productosStockBajo}</strong>
          <small>Requieren reposición</small>
        </article>

        <article className="spare-stat danger-stat">
          <span>AGOTADOS</span>
          <strong>{productosAgotados}</strong>
          <small>Sin existencias</small>
        </article>

        <article className="spare-stat inventory-value">
          <span>VALOR DEL INVENTARIO</span>
          <strong>{formatearMoneda(valorInventario)}</strong>
          <small>Precio por cantidad disponible</small>
        </article>

      </div>

      <div className="spares-layout">

        <article className="panel-card spare-form-card">

          <div className="panel-heading">
            <div>
              <span className="eyebrow">GESTIÓN DE INVENTARIO</span>
              <h3>{editando ? 'Editar repuesto' : 'Nuevo repuesto'}</h3>
            </div>

            <span className="heading-symbol">⚙</span>
          </div>

          <form className="client-form" onSubmit={guardarRepuesto}>

            <label>
              Nombre del repuesto

              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ej. Filtro de aceite"
                maxLength="100"
                required
              />
            </label>

            <label>
              Referencia / SKU

              <input
                type="text"
                name="referencia"
                value={formulario.referencia}
                onChange={manejarCambio}
                placeholder="Ej. FIL-001"
                maxLength="40"
                required
              />
            </label>

            <label>
              Categoría

              <select
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                required
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Marca

              <input
                type="text"
                name="marca"
                value={formulario.marca}
                onChange={manejarCambio}
                placeholder="Ej. Yamaha, NGK, Bosch..."
                maxLength="60"
                required
              />
            </label>

            <label>
              Precio unitario (COP)

              <input
                type="number"
                name="precio"
                value={formulario.precio}
                onChange={manejarCambio}
                placeholder="Ej. 45000"
                min="0"
                step="100"
                required
              />
            </label>

            <div className="spare-number-grid">

              <label>
                Existencias

                <input
                  type="number"
                  name="stock"
                  value={formulario.stock}
                  onChange={manejarCambio}
                  placeholder="Ej. 20"
                  min="0"
                  step="1"
                  required
                />
              </label>

              <label>
                Stock mínimo

                <input
                  type="number"
                  name="stockMinimo"
                  value={formulario.stockMinimo}
                  onChange={manejarCambio}
                  min="0"
                  step="1"
                  required
                />
              </label>

            </div>

            <label>
              Ubicación en el taller

              <input
                type="text"
                name="ubicacion"
                value={formulario.ubicacion}
                onChange={manejarCambio}
                placeholder="Ej. Estante A-02"
                maxLength="60"
              />
            </label>

            <label>
              Compatibilidad

              <input
                type="text"
                name="compatibilidad"
                value={formulario.compatibilidad}
                onChange={manejarCambio}
                placeholder="Ej. Yamaha XTZ 150"
                maxLength="120"
              />
            </label>

            <div className="client-form-actions">

              <button className="primary-button" type="submit">
                {editando ? 'Guardar cambios' : 'Registrar repuesto'}
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
              <p
                className={`client-message spare-message-${tipoMensaje}`}
                role="status"
              >
                {mensaje}
              </p>
            )}

          </form>

        </article>

        <article className="panel-card spare-list-card">

          <div className="panel-heading">
            <div>
              <span className="eyebrow">BASE DE INVENTARIO</span>
              <h3>Repuestos registrados</h3>
            </div>

            <span className="heading-symbol">▤</span>
          </div>

          <input
            className="client-search"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, referencia, marca..."
            aria-label="Buscar repuestos"
          />

          <div className="spare-filters">

            <label>
              <span>Categoría</span>

              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="Todas">Todas las categorías</option>

                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Existencias</span>

              <select
                value={filtroStock}
                onChange={(e) => setFiltroStock(e.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Stock bajo">Stock bajo</option>
                <option value="Agotado">Agotado</option>
              </select>
            </label>

          </div>

          {repuestosFiltrados.length === 0 ? (

            <div className="clients-empty">
              <span>⚙</span>
              <p>
                {repuestos.length === 0
                  ? 'Todavía no hay repuestos registrados.'
                  : 'No se encontraron repuestos con esos filtros.'}
              </p>
            </div>

          ) : (

            <div className="clients-table-wrapper">

              <table className="clients-table spare-table">

                <thead>
                  <tr>
                    <th>Repuesto</th>
                    <th>Referencia</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {repuestosFiltrados.map((repuesto) => {
                    const estado = obtenerEstadoStock(repuesto)

                    return (
                      <tr key={repuesto.id}>

                        <td>
                          <strong>{repuesto.nombre}</strong>
                          <small>
                            {repuesto.marca} · {repuesto.categoria}
                          </small>

                          {repuesto.compatibilidad && (
                            <small>
                              Compatible: {repuesto.compatibilidad}
                            </small>
                          )}

                          {repuesto.ubicacion && (
                            <small>
                              Ubicación: {repuesto.ubicacion}
                            </small>
                          )}
                        </td>

                        <td>
                          <strong className="spare-reference">
                            {repuesto.referencia}
                          </strong>
                        </td>

                        <td>
                          <strong className="service-price">
                            {formatearMoneda(repuesto.precio)}
                          </strong>
                        </td>

                        <td>
                          <strong className="spare-quantity">
                            {repuesto.stock}
                          </strong>
                          <small>
                            Mínimo: {repuesto.stockMinimo}
                          </small>
                        </td>

                        <td>
                          <span className={`spare-stock-status ${estado.clase}`}>
                            {estado.texto}
                          </span>
                        </td>

                        <td>
                          <div className="client-actions">

                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => editarRepuesto(repuesto)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => eliminarRepuesto(repuesto.id)}
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

          <div className="spare-table-footer">
            <span>
              Mostrando {repuestosFiltrados.length} de {repuestos.length} referencias
            </span>
            <span>INVENTARIO ROLO'S</span>
          </div>

        </article>

      </div>

    </section>
  )
}

export default Repuestos
