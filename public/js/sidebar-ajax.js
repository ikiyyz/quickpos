function updateSidebarActive() {
  const path = window.location.pathname;
  // Hilangkan semua 'active' di sidebar
  document.querySelectorAll('.nav-item.active, .collapse-item.active').forEach(el => {
    el.classList.remove('active');
  });
  // Dashboard
  if (path.startsWith('/dashboard')) {
    const el = document.querySelector('.nav-item [href="/dashboard"]');
    if (el) el.parentElement.classList.add('active');
  }
  // Goods Utilities
  if (path.startsWith('/goods') || path.startsWith('/units')) {
    const parent = document.querySelector('.nav-item [data-target="#collapseGoods"]');
    if (parent) parent.parentElement.classList.add('active');
    if (path.startsWith('/goods')) {
      const el = document.querySelector('.collapse-item[href="/goods"]');
      if (el) el.classList.add('active');
    }
    if (path.startsWith('/units')) {
      const el = document.querySelector('.collapse-item[href="/units"]');
      if (el) el.classList.add('active');
    }
  }
  // Suppliers
  if (path.startsWith('/suppliers')) {
    const el = document.querySelector('.nav-item [href="/suppliers"]');
    if (el) el.parentElement.classList.add('active');
  }
  // Customers
  if (path.startsWith('/customers')) {
    const el = document.querySelector('.nav-item [href="/customers"]');
    if (el) el.parentElement.classList.add('active');
  }
  // Users
  if (path.startsWith('/users')) {
    const el = document.querySelector('.nav-item [href="/users"]');
    if (el) el.parentElement.classList.add('active');
  }
  // Purchases
  if (path.startsWith('/purchases')) {
    const el = document.querySelector('.nav-item [href="/purchases"]');
    if (el) el.parentElement.classList.add('active');
  }
  // Sales
  if (path.startsWith('/sales')) {
    const el = document.querySelector('.nav-item [href="/sales"]');
    if (el) el.parentElement.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-link').forEach(link => {
    // Hanya intercept link internal (bukan logout/modal dsb)
    if (link.getAttribute('href') && link.getAttribute('href').startsWith('/')) {
      link.addEventListener('click', function(e) {
        // Debug: log href yang diklik
        console.log('[sidebar-ajax] Klik link:', this.href);
        // Jika ada modifier (ctrl/cmd/alt/shift) biarkan default
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        e.preventDefault();
        fetch(this.href, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('#main-content');
            if (newContent) {
              document.querySelector('#main-content').innerHTML = newContent.innerHTML;
              window.history.pushState({}, '', this.href);
              updateSidebarActive();
              // Optional: scroll to top
              window.scrollTo(0, 0);
            } else {
              // fallback: reload if not found
              window.location = this.href;
            }
          });
      });
    }
  });
  updateSidebarActive();
});
window.addEventListener('popstate', function() {
  updateSidebarActive();
}); 