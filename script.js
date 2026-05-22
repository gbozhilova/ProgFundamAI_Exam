// Global Variables for Language State
window.currentLanguage = 'en';

const translations = {
    en: {
        title: "LeadPredictor",
        language: "Language",
        currency: "Currency",
        campaignStart: "Campaign Start",
        campaignEnd: "Campaign End",
        totalRevenue: "Total Revenue",
        avgOrderValue: "Avg. Order Value",
        prospects: "📁 Prospects",
        leads: "👤 Leads",
        customers: "🏆 Customers",
        leadResponseRate: "Lead Response Rate",
        prospectResponseRate: "Prospect Response Rate",
        chartPeople: "people",
        chartMonths: "Months",
        descText: "Calculate exact prospects & leads needed to hit your revenue goals. Adjust your conversion rates to forecast requirements and optimize your sales funnel.",
        descQuestionsTitle: "Sample Questions:",
        descQ1: "How many prospects do I need for my revenue goal?",
        descQ2: "If I improve my lead response rate, how does it affect prospect goals?",
        descQ3: "What happens when average order value drops?"
    },
    bg: {
        title: "LeadPredictor",
        language: "Език",
        currency: "Валута",
        campaignStart: "Начало",
        campaignEnd: "Край",
        totalRevenue: "Приходи",
        avgOrderValue: "Ср. стойност на поръчка",
        prospects: "📁 Потенциални (Prospects)",
        leads: "👤 Лийдове",
        customers: "🏆 Клиенти",
        leadResponseRate: "Честота отговор (Лийдове)",
        prospectResponseRate: "Честота отговор (Потенциални)",
        chartPeople: "хора",
        chartMonths: "Месеци",
        descText: "Изчислете точните потенциални клиенти и лийдове, нужни за вашите цели. Променяйте процентите, за да прогнозирате нуждите и оптимизирате фунията си.",
        descQuestionsTitle: "Примерни въпроси:",
        descQ1: "Колко потенциални клиенти ми трябват за целта за приходите?",
        descQ2: "Ако подобря честотата на отговори, как се отразява на целите?",
        descQ3: "Какво се случва, когато средната стойност на поръчката намалее?"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const languageSelect = document.getElementById('language-select');
    const totalRevenueInput = document.getElementById('total-revenue');
    const avgOrderValueInput = document.getElementById('avg-order-value');
    const leadRateSlider = document.getElementById('lead-rate');
    const prospectRateSlider = document.getElementById('prospect-rate');

    // Displays
    const leadRateVal = document.getElementById('lead-rate-val');
    const prospectRateVal = document.getElementById('prospect-rate-val');
    
    const prospectsValue = document.getElementById('prospects-value');
    const leadsValue = document.getElementById('leads-value');
    const customersValue = document.getElementById('customers-value');
    
    // Progress Bars & Percents
    const leadsPercent = document.getElementById('leads-percent');
    const customersPercent = document.getElementById('customers-percent');
    const leadsProgress = document.getElementById('leads-progress');
    const customersProgress = document.getElementById('customers-progress');

    // Chart Setup (Chart.js)
    const ctx = document.getElementById('funnelChart').getContext('2d');
    
    // We use grouped: false to make bars overlap each other on the same horizontal line
    const funnelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'], // Months
            datasets: [
                {
                    label: translations[window.currentLanguage].prospects,
                    backgroundColor: '#C9725D', // Terracotta
                    data: [0,0,0,0,0,0],
                    borderWidth: 0,
                    barPercentage: 0.9,
                    categoryPercentage: 0.9,
                    order: 3 // Draw first (background)
                },
                {
                    label: translations[window.currentLanguage].leads,
                    backgroundColor: '#809681', // Sage
                    data: [0,0,0,0,0,0],
                    borderWidth: 0,
                    barPercentage: 0.9,
                    categoryPercentage: 0.9,
                    order: 2
                },
                {
                    label: translations[window.currentLanguage].customers,
                    backgroundColor: '#DBA955', // Mustard
                    data: [0,0,0,0,0,0],
                    borderWidth: 0,
                    barPercentage: 0.9,
                    categoryPercentage: 0.9,
                    order: 1 // Draw last (on top)
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            grouped: false, // Core feature to make overlapping bars!
            scales: {
                x: {
                    title: { display: true, text: translations[window.currentLanguage].chartPeople, color: '#8E8378' },
                    grid: { color: '#EAE3DB' },
                    ticks: { color: '#8E8378' }
                },
                y: {
                    title: { display: true, text: translations[window.currentLanguage].chartMonths, color: '#8E8378' },
                    grid: { display: false },
                    ticks: { color: '#8E8378' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#4A4036',
                    titleFont: { family: 'Nunito', size: 14 },
                    bodyFont: { family: 'Nunito', size: 13 }
                }
            }
        }
    });

    // Calculation Logic
    function updateMetrics() {
        const totalRevenue = parseFloat(totalRevenueInput.value) || 0;
        const avgOrderValue = parseFloat(avgOrderValueInput.value) || 1;
        const leadResponseRate = parseFloat(leadRateSlider.value) / 100;
        const prospectResponseRate = parseFloat(prospectRateSlider.value) / 100;

        // Displays for sliders
        leadRateVal.innerText = `${parseFloat(leadRateSlider.value).toFixed(2)}%`;
        prospectRateVal.innerText = `${parseFloat(prospectRateSlider.value).toFixed(2)}%`;

        // Base metrics based on business goal
        let targetCustomers = Math.ceil(totalRevenue / avgOrderValue);
        if (targetCustomers === 0) targetCustomers = 1;

        let requiredLeads = Math.ceil(targetCustomers / leadResponseRate);
        if(!isFinite(requiredLeads) || requiredLeads < 0) requiredLeads = targetCustomers;

        let requiredProspects = Math.ceil(requiredLeads / prospectResponseRate);
        if(!isFinite(requiredProspects) || requiredProspects < 0) requiredProspects = requiredLeads;

        // Update Stat Cards
        prospectsValue.innerText = requiredProspects;
        leadsValue.innerText = requiredLeads;
        customersValue.innerText = targetCustomers;

        const leadsRatio = (requiredLeads / requiredProspects) * 100;
        const customersRatio = (targetCustomers / requiredProspects) * 100;

        leadsPercent.innerText = `${leadsRatio.toFixed(0)}%`;
        customersPercent.innerText = `${customersRatio.toFixed(0)}%`;

        leadsProgress.style.width = `${leadsRatio}%`;
        customersProgress.style.width = `${customersRatio}%`;

        // Update Graph (simulating a 6-month cumulative distribution)
        // Assume growth is distributed over 6 months linearly
        const prospectsData = [];
        const leadsData = [];
        const customersData = [];

        for(let i = 1; i <= 6; i++) {
            // Linear accumulation scaling
            let factor = i / 6; 
            prospectsData.push(Math.round(requiredProspects * factor));
            leadsData.push(Math.round(requiredLeads * factor));
            customersData.push(Math.round(targetCustomers * factor));
        }

        funnelChart.data.datasets[0].data = prospectsData;
        funnelChart.data.datasets[1].data = leadsData;
        funnelChart.data.datasets[2].data = customersData;
        
        funnelChart.update();
    }

    // Translation Applier
    function applyTranslations(lang) {
        window.currentLanguage = lang;
        const dict = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });

        // Update Chart labels
        funnelChart.options.scales.x.title.text = dict.chartPeople;
        funnelChart.options.scales.y.title.text = dict.chartMonths;
        funnelChart.data.datasets[0].label = dict.prospects;
        funnelChart.data.datasets[1].label = dict.leads;
        funnelChart.data.datasets[2].label = dict.customers;
        funnelChart.update();
    }

    // Event Listeners
    languageSelect.addEventListener('change', (e) => {
        applyTranslations(e.target.value);
    });

    totalRevenueInput.addEventListener('input', updateMetrics);
    avgOrderValueInput.addEventListener('input', updateMetrics);
    leadRateSlider.addEventListener('input', updateMetrics);
    prospectRateSlider.addEventListener('input', updateMetrics);

    // Initial load
    applyTranslations(window.currentLanguage);
    updateMetrics();
});