
const ORIGINAL_PLAYER_POOL = [
    {id: 1, name: "David Raya", team: "Arsenal", cost: 5.5, points: 142, form: 6.8, position: "GK", goals: 0, assists: 0, cleanSheets: 13, status: "Fit", ownership: "24.5%"},
    {id: 2, name: "Ederson", team: "Man City", cost: 5.5, points: 130, form: 5.2, position: "GK", goals: 0, assists: 1, cleanSheets: 10, status: "Fit", ownership: "16.8%"},
    {id: 3, name: "William Saliba", team: "Arsenal", cost: 6.0, points: 155, form: 7.1, position: "DEF", goals: 2, assists: 1, cleanSheets: 14, status: "Fit", ownership: "35.2%"},
    {id: 4, name: "Trent Alexander-Arnold", team: "Liverpool", cost: 7.0, points: 162, form: 6.9, position: "DEF", goals: 3, assists: 9, cleanSheets: 11, status: "Doubtful (75%)", ownership: "28.4%"},
    {id: 5, name: "Josko Gvardiol", team: "Man City", cost: 6.0, points: 148, form: 7.4, position: "DEF", goals: 6, assists: 3, cleanSheets: 10, status: "Fit", ownership: "19.5%"},
    {id: 6, name: "Gabriel Magalhães", team: "Arsenal", cost: 6.0, points: 150, form: 6.5, position: "DEF", goals: 4, assists: 1, cleanSheets: 14, status: "Fit", ownership: "25.1%"},
    {id: 7, name: "Pedro Porro", team: "Tottenham", cost: 5.5, points: 135, form: 5.8, position: "DEF", goals: 3, assists: 7, cleanSheets: 8, status: "Fit", ownership: "18.2%"},
    {id: 8, name: "Mohamed Salah", team: "Liverpool", cost: 12.5, points: 245, form: 8.9, position: "MID", goals: 22, assists: 14, cleanSheets: 12, status: "Fit", ownership: "54.8%"},
    {id: 9, name: "Cole Palmer", team: "Chelsea", cost: 10.5, points: 230, form: 8.4, position: "MID", goals: 19, assists: 11, cleanSheets: 8, status: "Fit", ownership: "47.2%"},
    {id: 10, name: "Bukayo Saka", team: "Arsenal", cost: 10.0, points: 220, form: 8.1, position: "MID", goals: 16, assists: 13, cleanSheets: 13, status: "Fit", ownership: "42.5%"},
    {id: 11, name: "Kevin De Bruyne", team: "Man City", cost: 9.5, points: 160, form: 7.8, position: "MID", goals: 6, assists: 12, cleanSheets: 8, status: "Fit", ownership: "15.0%"},
    {id: 12, name: "Phil Foden", team: "Man City", cost: 9.5, points: 192, form: 6.9, position: "MID", goals: 12, assists: 8, cleanSheets: 10, status: "Fit", ownership: "22.3%"},
    {id: 13, name: "Luis Díaz", team: "Liverpool", cost: 7.5, points: 158, form: 6.2, position: "MID", goals: 10, assists: 6, cleanSheets: 11, status: "Fit", ownership: "17.4%"},
    {id: 14, name: "Son Heung-min", team: "Tottenham", cost: 9.5, points: 175, form: 6.7, position: "MID", goals: 14, assists: 9, cleanSheets: 8, status: "Fit", ownership: "20.1%"},
    {id: 15, name: "Martin Ødegaard", team: "Arsenal", cost: 8.5, points: 168, form: 7.2, position: "MID", goals: 9, assists: 11, cleanSheets: 13, status: "Fit", ownership: "18.9%"},
    {id: 16, name: "Bruno Fernandes", team: "Man United", cost: 8.5, points: 162, form: 6.4, position: "MID", goals: 10, assists: 8, cleanSheets: 7, status: "Fit", ownership: "16.5%"},
    {id: 17, name: "Erling Haaland", team: "Man City", cost: 14.0, points: 260, form: 9.2, position: "FWD", goals: 32, assists: 5, cleanSheets: 10, status: "Fit", ownership: "68.2%"},
    {id: 18, name: "Ollie Watkins", team: "Aston Villa", cost: 9.0, points: 198, form: 7.3, position: "FWD", goals: 18, assists: 8, cleanSheets: 6, status: "Fit", ownership: "24.1%"},
    {id: 19, name: "Alexander Isak", team: "Newcastle", cost: 8.5, points: 185, form: 7.9, position: "FWD", goals: 20, assists: 4, cleanSheets: 7, status: "Fit", ownership: "29.8%"},
    {id: 20, name: "Kai Havertz", team: "Arsenal", cost: 8.0, points: 170, form: 7.0, position: "FWD", goals: 14, assists: 7, cleanSheets: 13, status: "Fit", ownership: "18.6%"},
    {id: 21, name: "Nicolas Jackson", team: "Chelsea", cost: 7.5, points: 142, form: 6.1, position: "FWD", goals: 13, assists: 6, cleanSheets: 8, status: "Fit", ownership: "14.2%"},
    {id: 22, name: "Jean-Philippe Mateta", team: "Crystal Palace", cost: 7.5, points: 150, form: 5.9, position: "FWD", goals: 14, assists: 4, cleanSheets: 6, status: "Injured", ownership: "11.5%"}
];
let players = [];
let selectedIds = [];
let activePositionFilter = 'ALL';
let searchPattern = '';
let scoutedPlayerId = null;
function initRoster() {
    const saved = localStorage.getItem('doodlepitch_players');
    if (saved) {
        try {
            players = JSON.parse(saved);
        } catch (e) {
            players = JSON.parse(JSON.stringify(ORIGINAL_PLAYER_POOL));
        }
    } else {
        players = JSON.parse(JSON.stringify(ORIGINAL_PLAYER_POOL));
    }
    selectedIds = [];
    if (players.length > 0) {
        scoutedPlayerId = players[0].id;
    }
    renderTable();
    renderPitch();
    updateScoutingCard();
    triggerOptimization();
}
function saveRosterToStorage() {
    localStorage.setItem('doodlepitch_players', JSON.stringify(players));
}
function getJerseySvg(position) {
    let color = '#FFFFFF';
    if (position === 'GK') color = 'var(--color-yellow)';
    if (position === 'DEF') color = 'var(--color-green)';
    if (position === 'MID') color = 'var(--color-blue)';
    if (position === 'FWD') color = 'var(--color-pink)';
    return `
    <div class="token-shirt-container">
        <svg class="token-shirt-svg" viewBox="0 0 100 100">
            <!-- Sketchy shirt sleeve outlines -->
            <path d="M 50,15 
                     L 72,20 C 76,21 82,30 85,40 
                     L 74,45 
                     L 70,35 
                     L 70,82 C 70,85 68,87 65,87
                     L 35,87 C 32,87 30,85 30,82
                     L 30,35
                     L 26,45
                     L 15,40 C 18,30 24,21 28,20
                     Z" 
                  fill="${color}" stroke="var(--color-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <!-- Shirt details (drawn folds) -->
            <path d="M 33,45 L 33,78" fill="none" stroke="var(--color-ink)" stroke-width="1.5" stroke-dasharray="2 3" />
            <path d="M 67,45 L 67,78" fill="none" stroke="var(--color-ink)" stroke-width="1.5" stroke-dasharray="2 3" />
            <!-- Collar V-neck -->
            <path d="M 40,15 C 44,22 56,22 60,15" fill="none" stroke="var(--color-ink)" stroke-width="3" stroke-linecap="round" />
        </svg>
    </div>
    `;
}
function renderTable() {
    const tbody = document.getElementById('player-rows');
    tbody.innerHTML = '';
    const filtered = players.filter(p => {
        const matchesPosition = activePositionFilter === 'ALL' || p.position === activePositionFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchPattern.toLowerCase()) || 
                              p.team.toLowerCase().includes(searchPattern.toLowerCase());
        return matchesPosition && matchesSearch;
    });
    filtered.forEach(p => {
        const tr = document.createElement('tr');
        if (p.locked) tr.classList.add('state-locked');
        if (p.excluded) tr.classList.add('state-excluded');
        if (p.id === scoutedPlayerId) tr.classList.add('row-active-scout');
        const isOptimalSelection = selectedIds.includes(p.id);
        let warningIcon = '';
        if (p.status && p.status !== 'Fit') {
            warningIcon = ' ⚠️';
        }
        tr.innerHTML = `
            <td class="player-name-col">
                ${isOptimalSelection ? '🌟 ' : ''}${p.name}${warningIcon}
            </td>
            <td>${p.team}</td>
            <td><span class="badge-pos ${p.position}">${p.position}</span></td>
            <td>£${p.cost.toFixed(1)}m</td>
            <td>${p.points}</td>
            <td>${p.form.toFixed(1)}</td>
            <td>
                <div class="control-btn-group">
                    <button class="btn-control btn-lock ${p.locked ? 'active' : ''}" title="Lock Player" onclick="toggleLock(${p.id})">
                        ${p.locked ? '🔒' : '🔓'}
                    </button>
                    <button class="btn-control btn-exclude ${p.excluded ? 'active' : ''}" title="Exclude Player" onclick="toggleExclude(${p.id})">
                        ${p.excluded ? '🚫' : '➕'}
                    </button>
                    ${isCustomPlayer(p.id) ? `
                    <button class="btn-control btn-delete" title="Delete Draft Player" onclick="deletePlayer(${p.id})">
                        🗑️
                    </button>` : ''}
                </div>
            </td>
        `;
        tr.addEventListener('click', (e) => {
            if (e.target.closest('.control-btn-group')) return;
            selectPlayerForScouting(p.id);
        });
        tbody.appendChild(tr);
    });
}
function selectPlayerForScouting(id) {
    scoutedPlayerId = id;
    renderTable();
    updateScoutingCard();
}
function updateScoutingCard() {
    const card = document.getElementById('scouting-report-card');
    const p = players.find(player => player.id === scoutedPlayerId);
    if (!p) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');
    document.getElementById('scout-name').textContent = `${p.name} (${p.team})`;
    const statusEl = document.getElementById('scout-status');
    statusEl.innerHTML = '';
    const badge = document.createElement('span');
    badge.className = 'badge-status';
    const statusText = p.status || 'Fit';
    if (statusText === 'Fit') {
        badge.classList.add('fit');
        badge.textContent = '🟢 Fit';
    } else if (statusText.toLowerCase().includes('doubtful')) {
        badge.classList.add('doubtful');
        badge.textContent = `🟡 ${statusText}`;
    } else if (statusText.toLowerCase().includes('suspend')) {
        badge.classList.add('suspended');
        badge.textContent = '⚫ Suspended';
    } else {
        badge.classList.add('injured');
        badge.textContent = `🔴 ${statusText}`;
    }
    statusEl.appendChild(badge);
    const attackText = p.position === 'GK' || p.position === 'DEF' 
        ? `${p.goals || 0} Goals / ${p.assists || 0} Assists` 
        : `⚽ ${p.goals || 0} G / 🅰️ ${p.assists || 0} A`;
    document.getElementById('scout-attack').textContent = attackText;
    document.getElementById('scout-def').textContent = `${p.cleanSheets || 0} Clean Sheets`;
    document.getElementById('scout-ownership').textContent = p.ownership || '0.0%';
    const valEfficiency = p.cost > 0 ? (p.points / p.cost).toFixed(2) : '0.00';
    document.getElementById('scout-value').textContent = `${valEfficiency} pts / £m`;
}
function isCustomPlayer(id) {
    return id > ORIGINAL_PLAYER_POOL.length;
}
window.toggleLock = function(id) {
    const p = players.find(p => p.id === id);
    if (p) {
        p.locked = !p.locked;
        if (p.locked) p.excluded = false; 
        saveRosterToStorage();
        renderTable();
    }
}
window.toggleExclude = function(id) {
    const p = players.find(p => p.id === id);
    if (p) {
        p.excluded = !p.excluded;
        if (p.excluded) p.locked = false; 
        saveRosterToStorage();
        renderTable();
    }
}
window.deletePlayer = function(id) {
    players = players.filter(p => p.id !== id);
    selectedIds = selectedIds.filter(selectedId => selectedId !== id);
    if (scoutedPlayerId === id) {
        scoutedPlayerId = players.length > 0 ? players[0].id : null;
    }
    saveRosterToStorage();
    renderTable();
    renderPitch();
    updateScoutingCard();
}
function renderPitch() {
    const gkRow = document.getElementById('pitch-gk');
    const defRow = document.getElementById('pitch-def');
    const midRow = document.getElementById('pitch-mid');
    const fwdRow = document.getElementById('pitch-fwd');
    gkRow.innerHTML = '';
    defRow.innerHTML = '';
    midRow.innerHTML = '';
    fwdRow.innerHTML = '';
    const selectedPlayers = players.filter(p => selectedIds.includes(p.id));
    const positions = ['GK', 'DEF', 'MID', 'FWD'];
    positions.forEach(pos => {
        const list = selectedPlayers.filter(p => p.position === pos);
        const rowEl = document.getElementById(`pitch-${pos.toLowerCase()}`);
        if (list.length > 0) {
            list.forEach(p => {
                const token = document.createElement('div');
                token.className = 'player-token';
                token.innerHTML = `
                    ${p.locked ? '<span class="token-badge" title="Locked Selection">🔒</span>' : ''}
                    ${getJerseySvg(p.position)}
                    <span class="token-number">${p.id}</span>
                    <span class="token-name">${p.name.split(' ').pop()}</span>
                    <span class="token-details">£${p.cost.toFixed(1)}m | ${p.points}pt</span>
                `;
                token.addEventListener('click', () => {
                    toggleLock(p.id);
                });
                rowEl.appendChild(token);
            });
        } else {
            let count = 0;
            if (pos === 'GK') count = 1;
            else if (pos === 'DEF') count = 3;
            else if (pos === 'MID') count = 3;
            else if (pos === 'FWD') count = 1;
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('div');
                dot.className = 'placeholder-slot';
                dot.textContent = '?';
                rowEl.appendChild(dot);
            }
        }
    });
}
function triggerOptimization() {
    const loadingOverlay = document.getElementById('solver-loading');
    const feedbackBox = document.getElementById('solver-feedback-box');
    loadingOverlay.classList.remove('hidden');
    const budgetVal = parseFloat(document.getElementById('budget-range').value);
    const weightVal = parseFloat(document.getElementById('weight-range').value);
    const formationEls = document.getElementsByName('formation');
    let formationVal = 'knapsack';
    for (let el of formationEls) {
        if (el.checked) {
            formationVal = el.value;
            break;
        }
    }
    const payload = {
        players: players,
        budget: budgetVal,
        weight: weightVal,
        formation: formationVal
    };
    fetch('/api/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Server returned HTTP code ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        loadingOverlay.classList.add('hidden');
        if (data.status === 'optimal') {
            selectedIds = data.selected_ids;
            feedbackBox.innerHTML = `✏️ MILP Solver succeeded! Draft drawn.`;
            feedbackBox.style.color = 'var(--color-ink)';
            renderTable();
            renderPitch();
            document.getElementById('sum-count').textContent = `${data.metrics.count} / ${formationVal === 'squad_11' ? 11 : formationVal === 'squad_5' ? 5 : '11 max'}`;
            document.getElementById('sum-cost').textContent = `£${data.metrics.total_cost.toFixed(1)}m`;
            document.getElementById('sum-points').textContent = `${data.metrics.total_points} pts`;
            document.getElementById('sum-form').textContent = data.metrics.avg_form.toFixed(2);
        } else {
            selectedIds = [];
            renderTable();
            renderPitch();
            feedbackBox.innerHTML = `⚠️ Infeasible: ${data.error}`;
            feedbackBox.style.color = '#B32424';
            document.getElementById('sum-count').textContent = `0`;
            document.getElementById('sum-cost').textContent = `£0.0m`;
            document.getElementById('sum-points').textContent = `0 pts`;
            document.getElementById('sum-form').textContent = `0.0`;
        }
    })
    .catch(err => {
        loadingOverlay.classList.add('hidden');
        feedbackBox.innerHTML = `❌ Error: Connection failed. Make sure start.sh is running.`;
        feedbackBox.style.color = '#B32424';
        console.error(err);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initRoster();
    const accordionToggle = document.getElementById('toggle-add-player');
    const accordionContent = document.getElementById('add-player-form');
    accordionToggle.addEventListener('click', () => {
        accordionToggle.classList.toggle('active');
        accordionContent.classList.toggle('hidden');
    });
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchPattern = e.target.value;
        renderTable();
    });
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePositionFilter = btn.dataset.pos;
            renderTable();
        });
    });
    const budgetSlider = document.getElementById('budget-range');
    const budgetValSpan = document.getElementById('budget-val');
    budgetSlider.addEventListener('input', (e) => {
        budgetValSpan.textContent = `£${parseFloat(e.target.value).toFixed(1)}m`;
    });
    const weightSlider = document.getElementById('weight-range');
    const weightValSpan = document.getElementById('weight-val');
    weightSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val === 50) {
            weightValSpan.textContent = "50% Points / 50% Form";
        } else if (val < 50) {
            weightValSpan.textContent = `${100 - (val * 2)}% Form / ${val * 2}% Points`;
        } else {
            weightValSpan.textContent = `${(val - 50) * 2}% Points / ${100 - ((val - 50) * 2)}% Form`;
        }
    });
    const solveBtn = document.getElementById('btn-solve');
    solveBtn.addEventListener('click', () => {
        triggerOptimization();
    });
    const addForm = document.getElementById('add-player-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPlayer = {
            id: players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1,
            name: document.getElementById('new-name').value,
            team: document.getElementById('new-team').value,
            position: document.getElementById('new-pos').value,
            cost: parseFloat(document.getElementById('new-cost').value),
            points: parseInt(document.getElementById('new-points').value),
            form: parseFloat(document.getElementById('new-form').value),
            locked: false,
            excluded: false,
            goals: 0,
            assists: 0,
            cleanSheets: 0,
            status: "Fit",
            ownership: "1.0%"
        };
        players.push(newPlayer);
        scoutedPlayerId = newPlayer.id; 
        saveRosterToStorage();
        addForm.reset();
        accordionToggle.classList.remove('active');
        accordionContent.classList.add('hidden');
        renderTable();
        updateScoutingCard();
        triggerOptimization();
    });
    const resetPoolBtn = document.getElementById('btn-reset-pool');
    resetPoolBtn.addEventListener('click', () => {
        if (confirm("Reset roster pool to the default Famous 22? Custom players will be discarded.")) {
            players = JSON.parse(JSON.stringify(ORIGINAL_PLAYER_POOL));
            saveRosterToStorage();
            selectedIds = [];
            scoutedPlayerId = players.length > 0 ? players[0].id : null;
            renderTable();
            renderPitch();
            updateScoutingCard();
            triggerOptimization();
        }
    });
    const clearLocksBtn = document.getElementById('btn-clear-locks');
    clearLocksBtn.addEventListener('click', () => {
        players.forEach(p => {
            p.locked = false;
            p.excluded = false;
        });
        saveRosterToStorage();
        renderTable();
        renderPitch();
        updateScoutingCard();
        triggerOptimization();
    });
});
