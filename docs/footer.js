(function () {
  const mount = document.querySelector('[data-doc-footer]');
  if (!mount) return;

  mount.innerHTML = `
    <footer class="doc-footer">
      <div class="maintainer">
        <img
          class="maintainer-avatar"
          id="maintainer-avatar"
          src="https://github.com/abir-islam-z.png"
          width="28"
          height="28"
          alt="abir-islam-z"
        />
        <span>
          Author &amp; maintainer:
          <a href="https://github.com/abir-islam-z" id="maintainer-name" rel="noopener noreferrer">abir-islam-z</a>
        </span>
      </div>
      <p>
        <a href="./roadmap.html">Roadmap</a> ·
        <a href="https://github.com/abir-islam-z/express-cli/issues">Issues</a> · MIT
      </p>
    </footer>
  `;
})();
