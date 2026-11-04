
import { useState } from 'react'
import './App.css'
import Clientes from './components/Clientes'
import Vehiculos from './components/Vehiculos'
import Citas from './components/Citas'
import Servicios from './components/Servicios'
import Repuestos from './components/Repuestos'

// Lee los registros guardados en localStorage.
// Si no existen datos o hay algún problema, devuelve un arreglo vacío.
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

  // Consultar los datos reales de cada módulo.
  // Estos valores se vuelven a calcular cuando React renderiza el panel.
  const clientes = leerRegistros('rolos_motos_cars_clientes')
  const vehiculos = leerRegistros('rolos_motos_cars_vehiculos')
  const citas = leerRegistros('rolos_motos_cars_citas')
  const servicios = leerRegistros('rolos_motos_cars_servicios')
  const repuestos = leerRegistros('rolos_motos_cars_repuestos')

  // Calcular los indicadores del taller.
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
            <div className="user-avatar">AS</div>
            <div className="user-info">
              <strong>Administrador</strong>
              <span>Panel de control</span>
            </div>
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
