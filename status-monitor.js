// Status Check functionality para Programming Academy
class StatusMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.createStatusWidget();
        this.checkStatus();
        // Verificar cada 5 minutos
        setInterval(() => this.checkStatus(), 300000);
    }

    createStatusWidget() {
        const statusHTML = `
            <div id="status-widget" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                padding: 12px 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                max-width: 200px;
                transition: all 0.3s ease;
                cursor: pointer;
            ">
                <div id="status-indicator" style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ccc;
                    animation: pulse 2s infinite;
                "></div>
                <div>
                    <div id="status-text" style="font-weight: 600; color: #2c3e50;">Verificando...</div>
                    <div id="status-detail" style="font-size: 12px; color: #7f8c8d;">Estado del servicio</div>
                </div>
            </div>
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                #status-widget:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
                }
                .status-operational { background: #00b894; }
                .status-degraded { background: #fdcb6e; }
                .status-down { background: #d63031; }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', statusHTML);
        
        // Añadir click para ver detalles
        document.getElementById('status-widget').addEventListener('click', () => {
            this.showDetailedStatus();
        });
    }

    async checkStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            const indicator = document.getElementById('status-indicator');
            const text = document.getElementById('status-text');
            const detail = document.getElementById('status-detail');
            
            // Limpiar clases anteriores
            indicator.className = '';
            
            switch(data.status) {
                case 'operational':
                    indicator.classList.add('status-operational');
                    text.textContent = 'Operativo';
                    detail.textContent = `${data.uptime.percentage}% uptime`;
                    break;
                case 'degraded':
                    indicator.classList.add('status-degraded');
                    text.textContent = 'Degradado';
                    detail.textContent = 'Algunos problemas';
                    break;
                default:
                    indicator.classList.add('status-down');
                    text.textContent = 'Caído';
                    detail.textContent = 'Servicio no disponible';
            }
        } catch (error) {
            const indicator = document.getElementById('status-indicator');
            const text = document.getElementById('status-text');
            const detail = document.getElementById('status-detail');
            
            indicator.className = 'status-down';
            text.textContent = 'Error';
            detail.textContent = 'No se pudo verificar';
        }
    }

    showDetailedStatus() {
        alert('Para ver el estado detallado completo, visita:\nhttps://status.powerfenix.com\n\nAquí puedes ver el estado de Programming Academy y todos los servicios relacionados.');
    }
}

// Inicializar el monitor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new StatusMonitor();
});