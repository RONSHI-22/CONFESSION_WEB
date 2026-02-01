async function loadConfessions() {
    try {
        const res = await fetch("/confessions");
        const data = await res.json();

        const list = document.getElementById("confessionList");
        list.innerHTML = "<h2>Recent Confessions</h2>";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "confession-card";

            div.innerHTML = `
                <p class="confess-text">${item.confess}</p>
                <span class="confess-meta">
                    ${item.name || "Anonymous"} • ${item.gender}
                </span>
            `;

            list.appendChild(div);
        });

    } catch (err) {
        console.error("Failed to load confessions", err);
    }
}

loadConfessions();
