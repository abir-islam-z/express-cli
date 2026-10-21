function formatCount(value) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 10_000) {
    return `${Math.round(value / 1000)}k`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

async function loadProjectStats() {
  const starsEl = document.getElementById('github-stars');
  const downloadsEl = document.getElementById('npm-downloads');
  if (!starsEl && !downloadsEl) return;

  if (starsEl) {
    try {
      const response = await fetch('https://api.github.com/repos/abir-islam-z/express-cli');
      if (response.ok) {
        const data = await response.json();
        if (typeof data.stargazers_count === 'number') {
          starsEl.textContent = formatCount(data.stargazers_count);
          starsEl.setAttribute('aria-label', `${data.stargazers_count} GitHub stars`);
        }
      }
    } catch {
      starsEl.textContent = '—';
    }
  }

  if (downloadsEl) {
    try {
      const end = new Date().toISOString().slice(0, 10);
      const response = await fetch(
        `https://api.npmjs.org/downloads/range/2015-01-01:${end}/express-modular-cli`,
      );
      if (response.ok) {
        const data = await response.json();
        const total = (data.downloads ?? []).reduce((sum, day) => sum + day.downloads, 0);
        if (total > 0) {
          downloadsEl.textContent = formatCount(total);
          downloadsEl.setAttribute('aria-label', `${total.toLocaleString()} total npm downloads`);
        }
      }
    } catch {
      downloadsEl.textContent = '—';
    }
  }
}

loadProjectStats();
