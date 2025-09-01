/**
 * Charts and Data Visualization System
 * Handles financial charts and interactive data displays
 */

class FinanceCharts {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initCharts();
        this.bindEvents();
    }

    initCharts() {
        // Initialize sales chart
        this.initSalesChart();
        
        // Initialize weekly user growth chart
        this.initWeeklyChart();
        
        // Initialize category distribution chart
        this.initCategoryChart();
        
        // Initialize progress bars for goals
        this.initProgressBars();
    }

    initSalesChart() {
        const salesChart = document.querySelector('.sales-chart');
        if (!salesChart) return;

        // Create a simple line chart using CSS gradients
        const chartData = [20, 35, 25, 45, 30, 50, 40];
        const maxValue = Math.max(...chartData);
        
        // Create SVG chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 20');
        
        // Create line path
        const points = chartData.map((value, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 20 - ((value / maxValue) * 20);
            return `${x},${y}`;
        }).join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${points}`);
        path.setAttribute('stroke', 'rgba(255,255,255,0.8)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        // Add animation
        path.style.strokeDasharray = '1000';
        path.style.strokeDashoffset = '1000';
        path.style.animation = 'drawLine 1.5s ease-out forwards';
        
        svg.appendChild(path);
        salesChart.appendChild(svg);
        
        // Store chart reference
        this.charts.set('sales', svg);
    }

    initWeeklyChart() {
        const weeklyChart = document.querySelector('.weekly-chart');
        if (!weeklyChart) return;

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = [15, 25, 37, 20, 30, 18, 22]; // Values in K
        
        // Create SVG chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 30');
        
        const maxValue = Math.max(...data);
        
        weekDays.forEach((day, index) => {
            const x = (index / (weekDays.length - 1)) * 100;
            const height = (data[index] / maxValue) * 25;
            const y = 30 - height;
            
            // Create bar
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x - 2);
            bar.setAttribute('y', y);
            bar.setAttribute('width', '4');
            bar.setAttribute('height', height);
            bar.setAttribute('fill', index === 2 ? 'var(--color-primary)' : 'var(--color-surface-light)');
            bar.setAttribute('rx', '2');
            
            // Add hover effect
            bar.style.cursor = 'pointer';
            bar.style.transition = 'all 0.3s ease';
            
            // Add tooltip data
            bar.setAttribute('data-value', `$${data[index]}K`);
            bar.setAttribute('data-day', day);
            
            svg.appendChild(bar);
            
            // Add day labels
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', '28');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '2');
            label.setAttribute('fill', 'var(--color-text-muted)');
            label.textContent = day;
            svg.appendChild(label);
        });
        
        weeklyChart.appendChild(svg);
        this.charts.set('weekly', svg);
        
        // Add hover effects
        this.addBarHoverEffects(weeklyChart);
    }

    initCategoryChart() {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;

        const categoryData = [
            { name: 'Alimentação', value: 1250, color: 'var(--color-primary)' },
            { name: 'Transporte', value: 800, color: 'var(--color-secondary)' },
            { name: 'Entretenimento', value: 600, color: 'var(--color-accent)' },
            { name: 'Saúde', value: 400, color: 'var(--color-danger)' },
            { name: 'Educação', value: 300, color: 'var(--color-success)' }
        ];

        const total = categoryData.reduce((sum, item) => sum + item.value, 0);
        
        // Create SVG pie chart
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        
        let currentAngle = 0;
        const centerX = 50;
        const centerY = 50;
        const radius = 35;
        
        categoryData.forEach((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const endAngle = currentAngle + angle;
            
            // Create pie slice
            const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const startRad = (currentAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
            
            slice.setAttribute('d', pathData);
            slice.setAttribute('fill', item.color);
            slice.style.cursor = 'pointer';
            slice.style.transition = 'all 0.3s ease';
            
            // Add tooltip data
            slice.setAttribute('data-category', item.name);
            slice.setAttribute('data-value', `$${item.value}`);
            slice.setAttribute('data-percentage', `${(percentage * 100).toFixed(1)}%`);
            
            svg.appendChild(slice);
            
            currentAngle = endAngle;
        });
        
        // Add center circle
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', centerX);
        centerCircle.setAttribute('cy', centerY);
        centerCircle.setAttribute('r', '15');
        centerCircle.setAttribute('fill', 'var(--color-background)');
        svg.appendChild(centerCircle);
        
        // Add total text
        const totalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        totalText.setAttribute('x', centerX);
        totalText.setAttribute('y', centerY + 2);
        totalText.setAttribute('text-anchor', 'middle');
        totalText.setAttribute('font-size', '3');
        totalText.setAttribute('fill', 'var(--color-text-primary)');
        totalText.textContent = `$${total.toLocaleString()}`;
        svg.appendChild(totalText);
        
        chartContainer.appendChild(svg);
        this.charts.set('category', svg);
        
        // Add hover effects
        this.addPieChartHoverEffects(chartContainer);
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            // Animate progress bar
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    addBarHoverEffects(container) {
        const bars = container.querySelectorAll('rect');
        
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.style.fill = 'var(--color-primary)';
                bar.style.transform = 'scale(1.2)';
                
                // Show tooltip
                this.showTooltip(bar, container);
            });
            
            bar.addEventListener('mouseleave', () => {
                const isWed = bar.getAttribute('data-day') === 'Wed';
                bar.style.fill = isWed ? 'var(--color-primary)' : 'var(--color-surface-light)';
                bar.style.transform = 'scale(1)';
                
                // Hide tooltip
                this.hideTooltip();
            });
        });
    }

    addPieChartHoverEffects(container) {
        const slices = container.querySelectorAll('path');
        
        slices.forEach(slice => {
            slice.addEventListener('mouseenter', () => {
                slice.style.transform = 'scale(1.05)';
                slice.style.filter = 'brightness(1.2)';
                
                // Show tooltip
                this.showTooltip(slice, container);
            });
            
            slice.addEventListener('mouseleave', () => {
                slice.style.transform = 'scale(1)';
                slice.style.filter = 'brightness(1)';
                
                // Hide tooltip
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, container) {
        // Remove existing tooltip
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-surface);
            border: 1px solid var(--color-surface-light);
            border-radius: var(--radius-sm);
            padding: var(--spacing-sm);
            color: var(--color-text-primary);
            font-size: var(--font-size-sm);
            z-index: 1000;
            pointer-events: none;
            box-shadow: var(--shadow-lg);
        `;
        
        // Set tooltip content based on element type
        if (element.tagName === 'rect') {
            tooltip.textContent = `${element.getAttribute('data-day')}: ${element.getAttribute('data-value')}`;
        } else if (element.tagName === 'path') {
            tooltip.innerHTML = `
                <div><strong>${element.getAttribute('data-category')}</strong></div>
                <div>${element.getAttribute('data-value')}</div>
                <div>${element.getAttribute('data-percentage')}</div>
            `;
        }
        
        container.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - containerRect.top - tooltip.offsetHeight - 10}px`;
        
        // Store tooltip reference
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    bindEvents() {
        // Listen for page changes to reinitialize charts
        document.addEventListener('pagechange', (e) => {
            setTimeout(() => {
                this.initCharts();
            }, 100);
        });
    }

    // Public methods
    updateChart(chartName, newData) {
        const chart = this.charts.get(chartName);
        if (chart) {
            // Update chart with new data
            console.log(`Updating ${chartName} chart with:`, newData);
        }
    }

    refreshAllCharts() {
        this.charts.clear();
        this.initCharts();
    }

    exportChartData() {
        const chartData = {};
        this.charts.forEach((chart, name) => {
            chartData[name] = {
                type: chart.tagName.toLowerCase(),
                data: this.extractChartData(chart)
            };
        });
        return chartData;
    }

    extractChartData(chart) {
        // Extract data from chart elements
        const data = {};
        // Implementation depends on chart type
        return data;
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.financeCharts = new FinanceCharts();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinanceCharts;
}

// Add CSS animations for charts
const style = document.createElement('style');
style.textContent = `
    @keyframes drawLine {
        to {
            stroke-dashoffset: 0;
        }
    }
    
    .chart-tooltip {
        animation: fadeIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);