
import { useState } from 'react'
import './App.css'
import Clientes from './components/Clientes'
import Vehiculos from './components/Vehiculos'
import Citas from './components/Citas'
import Servicios from './components/Servicios'
import Repuestos from './components/Repuestos'

// Dirección del backend Spring Boot.
const API_URL = 'http://localhost:8080/api/auth'

// Lee los registros guardados en LocalStorage.
function leerRegistros(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || '[]')
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

const menuItems = [
  { id: 'inicio', icon: '▦', label: 'Panel principal' },
  { id: 'clientes', icon: '♙', label: 'Clientes' },
  { id: 'vehiculos', icon: '◈', label: 'Vehículos' },
  { id: 'citas', icon: '▣', label: 'Citas' },
  { id: 'servicios', icon: '⚙', label: 'Servicios' },
  { id: 'repuestos', icon: '▤', label: 'Repuestos' },
]

function App() {
  const [activeSection, setActiveSection] = useState('inicio')

  // Estado temporal de autenticación.
  const [usuarioActual, setUsuarioActual] = useState(null)

  // Estados del formulario.
  const [modoRegistro, setModoRegistro] = useState(false)
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  // Registrar o iniciar sesión mediante Spring Boot.
  async function manejarAutenticacion(event) {
    event.preventDefault()
    setMensaje('')
    setTipoMensaje('')

    const usuario = nombreUsuario.trim()

    if (!usuario || !password) {
      setMensaje('Debes completar todos los campos.')
      setTipoMensaje('error')
      return
    }

    if (modoRegistro) {
      if (usuario.length < 3) {
        setMensaje('El usuario debe tener al menos 3 caracteres.')
        setTipoMensaje('error')
        return
      }

      if (password.length < 8) {
        setMensaje('La contraseña debe tener al menos 8 caracteres.')
        setTipoMensaje('error')
        return
      }

      if (password !== confirmarPassword) {
        setMensaje('Las contraseñas no coinciden.')
        setTipoMensaje('error')
        return
      }
    }

    setCargando(true)

    try {
      const endpoint = modoRegistro ? '/registro' : '/login'

      const respuesta = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreUsuario: usuario,
          password,
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok || !datos.autenticado) {
        throw new Error(datos.mensaje || 'No fue posible completar la operación.')
      }

      if (modoRegistro) {
        setMensaje('Cuenta creada correctamente. Ahora puedes iniciar sesión.')
        setTipoMensaje('exito')
        setModoRegistro(false)
        setPassword('')
        setConfirmarPassword('')
      } else {
        setUsuarioActual(datos.nombreUsuario || usuario)
        setActiveSection('inicio')
        setNombreUsuario('')
        setPassword('')
        setConfirmarPassword('')
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setMensaje('No se pudo conectar con el servidor. Comprueba que Spring Boot esté funcionando.')
      } else {
        setMensaje(error.message)
      }

      setTipoMensaje('error')
    } finally {
      setCargando(false)
    }
  }

  function cambiarModo() {
    setModoRegistro(!modoRegistro)
    setMensaje('')
    setTipoMensaje('')
    setPassword('')
    setConfirmarPassword('')
  }

  function cerrarSesion() {
    setUsuarioActual(null)
    setActiveSection('inicio')
    setNombreUsuario('')
    setPassword('')
    setMensaje('')
    setTipoMensaje('')
  }

  // Pantalla de acceso.
  if (!usuarioActual) {
    return (
      <main className="auth-screen">
        <div className="auth-background-grid"></div>
        <div className="auth-glow auth-glow-cyan"></div>
        <div className="auth-glow auth-glow-yellow"></div>

        <section className="auth-container">

          <div className="auth-visual">
            <div className="auth-visual-top">
              <span className="auth-logo">R</span>
              <div>
                <strong>ROLO'S</strong>
                <span>MOTOS CARS</span>
              </div>
            </div>

            <div className="auth-visual-content">
              <span className="auth-tag">TALLER INTELIGENTE // 2026</span>

              <h1>
                EL FUTURO
                <br />
                <span>SE MANTIENE</span>
                <br />
                EN MOVIMIENTO.
              </h1>

              <p>
                Tecnología, precisión y potencia para la gestión
                inteligente de motocicletas y automóviles.
              </p>

              <div className="auth-tech-lines">
                <span>01 // CONTROL</span>
                <span>02 // PRECISIÓN</span>
                <span>03 // POTENCIA</span>
              </div>
            </div>

            <div className="auth-visual-footer">
              <span>ROLO'S MOTOS CARS</span>
              <span>SYSTEM ONLINE</span>
            </div>

            <div className="auth-helmet">
              <div className="helmet-ring"></div>
              <div className="helmet-shape">
                <div className="helmet-eye"></div>
                <div className="helmet-face"></div>
                <div className="helmet-jaw"></div>
              </div>
              <span className="helmet-label">CYBER UNIT // R-01</span>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-form-heading">
              <span className="auth-eyebrow">
                SISTEMA DE IDENTIFICACIÓN
              </span>

              <h2>
                {modoRegistro ? 'Crear cuenta' : 'Bienvenido'}
                <span>.</span>
              </h2>

              <p>
                {modoRegistro
                  ? 'Registra un usuario para acceder a la plataforma.'
                  : 'Identifícate para acceder al centro de operaciones.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={manejarAutenticacion}>
              <label htmlFor="auth-username">NOMBRE DE USUARIO</label>
              <input
                id="auth-username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={nombreUsuario}
                onChange={(event) => setNombreUsuario(event.target.value)}
                minLength={modoRegistro ? 3 : undefined}
                maxLength={50}
                autoComplete="username"
                required
                disabled={cargando}
              />

              <label htmlFor="auth-password">CONTRASEÑA</label>
              <input
                id="auth-password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={modoRegistro ? 8 : undefined}
                maxLength={72}
                autoComplete={modoRegistro ? 'new-password' : 'current-password'}
                required
                disabled={cargando}
              />

              {modoRegistro && (
                <>
                  <label htmlFor="auth-confirm-password">
                    CONFIRMAR CONTRASEÑA
                  </label>
                  <input
                    id="auth-confirm-password"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmarPassword}
                    onChange={(event) => setConfirmarPassword(event.target.value)}
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                    disabled={cargando}
                  />
                </>
              )}

              {mensaje && (
                <div className={`auth-message ${tipoMensaje}`}>
                  {mensaje}
                </div>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? 'CONECTANDO...'
                  : modoRegistro
                    ? 'CREAR CUENTA'
                    : 'INICIAR SESIÓN'}
                <span>→</span>
              </button>
            </form>

            <div className="auth-switch">
              {modoRegistro
                ? '¿Ya tienes una cuenta?'
                : '¿Todavía no tienes una cuenta?'}

              <button
                type="button"
                onClick={cambiarModo}
                disabled={cargando}
              >
                {modoRegistro ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </div>

            <div className="auth-security">
              <span className="auth-security-dot"></span>
              CONEXIÓN CON SERVIDOR SPRING BOOT
            </div>

            <div className="auth-copyright">
              ROLO'S MOTOS CARS © 2026
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Consultar los registros de los módulos.
  const clientes = leerRegistros('rolos_motos_cars_clientes')
  const vehiculos = leerRegistros('rolos_motos_cars_vehiculos')
  const citas = leerRegistros('rolos_motos_cars_citas')
  const servicios = leerRegistros('rolos_motos_cars_servicios')
  const repuestos = leerRegistros('rolos_motos_cars_repuestos')

  const citasProgramadas = citas.filter((cita) =>
    ['Programada', 'Confirmada'].includes(cita.estado)
  ).length

  const serviciosFinalizados = servicios.filter(
    (servicio) => servicio.estado === 'Finalizado'
  ).length

  const stats = [
    {
      label: 'Repuestos registrados',
      value: repuestos.length,
      detail: 'Referencias de inventario',
      icon: '▤',
    },
    {
      label: 'Clientes registrados',
      value: clientes.length,
      detail: 'Base de clientes',
      icon: '♙',
    },
    {
      label: 'Vehículos registrados',
      value: vehiculos.length,
      detail: 'Motos y automóviles',
      icon: '◈',
    },
    {
      label: 'Citas programadas',
      value: citasProgramadas,
      detail: 'Programadas y confirmadas',
      icon: '▣',
    },
    {
      label: 'Servicios realizados',
      value: serviciosFinalizados,
      detail: 'Servicios finalizados',
      icon: '⚙',
    },
  ]

  const currentItem = menuItems.find(
    (item) => item.id === activeSection
  )

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">R</div>
          <div className="brand-text">
            <h2>ROLO'S</h2>
            <span>MOTOS CARS</span>
          </div>
        </div>

        <div className="menu-label">MENÚ PRINCIPAL</div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            Sistema operativo
          </div>
          <p>ROLO'S MOTOS CARS</p>
          <small>Gestión integral de talleres</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">ROLO'S / GESTIÓN</span>
            <h1>{currentItem?.label || 'Panel principal'}</h1>
          </div>

          <div className="user-area">
            <div className="notification">♧</div>
            <div className="user-avatar">
              {usuarioActual.substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{usuarioActual}</strong>
              <span>Usuario autenticado</span>
            </div>
            <button
              className="logout-button"
              onClick={cerrarSesion}
              title="Cerrar sesión"
            >
              Salir ↗
            </button>
          </div>
        </header>

        {activeSection === 'inicio' ? (
          <section className="dashboard">
            <div className="welcome-banner">
              <div className="welcome-content">
                <span className="eyebrow">CENTRO DE OPERACIONES</span>
                <h2>
                  Bienvenido a <span>Rolo's Motos Cars</span>
                </h2>
                <p>
                  Administra las operaciones de tu taller desde un solo lugar.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setActiveSection('citas')}
                >
                  Consultar agenda <span>→</span>
                </button>
              </div>

              <div className="welcome-decoration">
                <div className="decoration-circle">R</div>
                <span>PRECISIÓN · POTENCIA · CONTROL</span>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <span className="eyebrow">INFORMACIÓN GENERAL</span>
                <h2>Resumen del taller</h2>
              </div>
              <span className="live-indicator">
                <span className="status-dot"></span>
                Vista general
              </span>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <div className="stat-top">
                    <span>{stat.label}</span>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <strong className="stat-value">{stat.value}</strong>
                  <span className="stat-detail">{stat.detail}</span>
                </article>
              ))}
            </div>

            <div className="dashboard-grid">
              <article className="panel-card">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">ACCESO RÁPIDO</span>
                    <h3>Gestión del taller</h3>
                  </div>
                  <span className="heading-symbol">✦</span>
                </div>

                <div className="quick-actions">
                  {menuItems.slice(1).map((item) => (
                    <button
                      className="quick-action"
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="quick-icon">{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="quick-arrow">→</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel-card information-card">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">PLATAFORMA</span>
                    <h3>Estado del sistema</h3>
                  </div>
                  <span className="heading-symbol">◈</span>
                </div>

                <div className="system-information">
                  <div className="information-row">
                    <span>Aplicación</span>
                    <strong>Rolo's Motos Cars</strong>
                  </div>
                  <div className="information-row">
                    <span>Interfaz</span>
                    <strong>React</strong>
                  </div>
                  <div className="information-row">
                    <span>Entorno</span>
                    <strong>Desarrollo</strong>
                  </div>
                  <div className="information-row">
                    <span>Estado</span>
                    <strong className="working-status">
                      <span className="status-dot"></span>
                      Disponible
                    </strong>
                  </div>
                </div>

                <div className="information-note">
                  Plataforma de gestión para talleres de motocicletas y automóviles.
                </div>
              </article>
            </div>

            <footer className="dashboard-footer">
              <span>ROLO'S MOTOS CARS © 2026</span>
              <span>GESTIÓN INTELIGENTE DE TALLERES</span>
            </footer>
          </section>
        ) : activeSection === 'clientes' ? (
          <Clientes />
        ) : activeSection === 'vehiculos' ? (
          <Vehiculos />
        ) : activeSection === 'citas' ? (
          <Citas />
        ) : activeSection === 'servicios' ? (
          <Servicios />
        ) : activeSection === 'repuestos' ? (
          <Repuestos />
        ) : (
          <section className="module-placeholder">
            <div className="placeholder-icon">
              {currentItem?.icon}
            </div>
            <span className="eyebrow">MÓDULO DE GESTIÓN</span>
            <h2>{currentItem?.label}</h2>
            <p>
              Este módulo está preparado para incorporar sus funcionalidades.
              Estamos construyendo la aplicación por etapas.
            </p>
            <button
              className="primary-button"
              onClick={() => setActiveSection('inicio')}
            >
              ← Volver al panel principal
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
