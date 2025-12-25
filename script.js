// Main JavaScript for SOCKS5 Proxy List Website
let currentPage = 1;
let pageSize = 20;
let currentView = 'grid';
let currentSearch = '';

// DOM Elements
const proxyListElement = document.getElementById('proxyList');
const totalProxiesElement = document.getElementById('totalProxies');
const filteredProxiesElement = document.getElementById('filteredProxies');
const currentPageElement = document.getElementById('currentPage');
const totalPagesElement = document.getElementById('totalPages');
const pageSizeSelect = document.getElementById('pageSize');
const proxySearchInput = document.getElementById('proxySearch');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProxies();
    updateStats();
    updatePagination();
    
    // Set up event listeners
    if (proxySearchInput) {
        proxySearchInput.addEventListener('input', searchProxies);
    }
    
    // Update repository link
    const repoLink = document.getElementById('repoLink');
    if (repoLink) {
        repoLink.href = window.location.href;
    }
});

// Display proxies in the list
function displayProxies() {
    if (!proxyListElement) return;
    
    // Get filtered proxies
    const filteredProxies = filterProxies();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProxies = filteredProxies.slice(startIndex, endIndex);
    
    // Clear the list
    proxyListElement.innerHTML = '';
    
    // Add each proxy
    currentProxies.forEach((proxy, index) => {
        const proxyItem = document.createElement('div');
        proxyItem.className = 'proxy-item';
        
        // Split IP and port
        const [ip, port] = proxy.split(':');
        
        proxyItem.innerHTML = `
            <div class="proxy-ip">${ip}</div>
            <div class="proxy-port">:${port}</div>
        `;
        
        // Add animation delay
        proxyItem.style.animationDelay = `${index * 0.05}s`;
        proxyListElement.appendChild(proxyItem);
    });
    
    // Update UI
    updatePagination();
    updateStats();
    
    // Update view class
    proxyListElement.className = `proxy-list ${currentView}-view`;
}

// Filter proxies based on search
function filterProxies() {
    if (!currentSearch.trim()) {
        return socks5Proxies;
    }
    
    const searchTerm = currentSearch.toLowerCase();
    return socks5Proxies.filter(proxy => {
        return proxy.toLowerCase().includes(searchTerm);
    });
}

// Update statistics
function updateStats() {
    const filteredProxies = filterProxies();
    
    if (totalProxiesElement) {
        totalProxiesElement.textContent = socks5Proxies.length;
    }
    
    if (filteredProxiesElement) {
        filteredProxiesElement.textContent = filteredProxies.length;
    }
    
    // Update time
    const updateTimeElement = document.getElementById('updateTime');
    if (updateTimeElement) {
        const now = new Date();
        updateTimeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Update pagination
function updatePagination() {
    const filteredProxies = filterProxies();
    const totalPages = Math.ceil(filteredProxies.length / pageSize);
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (totalPagesElement) {
        totalPagesElement.textContent = totalPages;
    }
    
    // Enable/disable pagination buttons
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Search proxies
function searchProxies() {
    currentSearch = proxySearchInput.value;
    currentPage = 1;
    displayProxies();
}

// Change page size
function changePageSize() {
    pageSize = parseInt(pageSizeSelect.value);
    currentPage = 1;
    displayProxies();
}

// Pagination functions
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProxies();
    }
}

function nextPage() {
    const filteredProxies = filterProxies();
    const totalPages = Math.ceil(filteredProxies.length / pageSize);
    
    if (currentPage < totalPages) {
        currentPage++;
        displayProxies();
    }
}

// Change view mode
function changeView(view) {
    currentView = view;
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    displayProxies();
}

// Copy all proxies to clipboard
function copyAllProxies() {
    const text = socks5Proxies.join('\n');
    
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('All proxies copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy proxies');
        });
}

// Download proxies as TXT file
function downloadAsTxt() {
    const text = socks5Proxies.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'socks5-proxies.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Refresh/update proxies (simulated)
function updateProxies() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    btn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real app, you would fetch new data here
        displayProxies();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        alert('Proxy list updated!');
    }, 1500);
}
