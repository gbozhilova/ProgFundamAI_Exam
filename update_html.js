const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace language dropdown
html = html.replace(
<label>Language</label>
                <select class="boho-input">
                    <option>???? English</option>
                    <option>???? Spanish</option>
                </select>,
<label data-i18n="language">Language</label>
                <select class="boho-input" id="language-select">
                    <option value="en">???? English</option>
                    <option value="bg">???? ?????????</option>
                </select>
);

html = html.replace('<h1>LeadPredictor</h1>', '<h1 data-i18n="title">LeadPredictor</h1>');
html = html.replace('<label>Currency</label>', '<label data-i18n="currency">Currency</label>');
html = html.replace('<option>? Euro</option>', '<option>? Euro</option>\n                    <option>??. BGN</option>');
html = html.replace('<label>Campaign Start</label>', '<label data-i18n="campaignStart">Campaign Start</label>');
html = html.replace('<label>Campaign End</label>', '<label data-i18n="campaignEnd">Campaign End</label>');
html = html.replace('<label>Total Revenue</label>', '<label data-i18n="totalRevenue">Total Revenue</label>');
html = html.replace('<label>Avg. Order Value</label>', '<label data-i18n="avgOrderValue">Avg. Order Value</label>');

html = html.replace('<span class="stat-title">?? Prospects</span>', '<span class="stat-title" data-i18n="prospects">?? Prospects</span>');
html = html.replace('<span class="stat-title">?? Leads</span>', '<span class="stat-title" data-i18n="leads">?? Leads</span>');
html = html.replace('<span class="stat-title">?? Customers</span>', '<span class="stat-title" data-i18n="customers">?? Customers</span>');

html = html.replace('<label>Lead Response Rate</label>', '<label data-i18n="leadResponseRate">Lead Response Rate</label>');
html = html.replace('<label>Prospect Response Rate</label>', '<label data-i18n="prospectResponseRate">Prospect Response Rate</label>');

fs.writeFileSync('index.html', html, 'utf8');
