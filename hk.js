// 1. DATA INITIALIZATION
let teams = JSON.parse(localStorage.getItem('cvcTeams')) || [
    { name: "Team 1", players: ["Somtee", "Bob", "Raphael"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 2", players: ["David", "Ik", "Godswill"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 3", players: ["Emeka", "Smith", "Kosi"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 4", players: ["Ephraim", "Christian", "Great"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 5", players: ["Calvin", "Chimaobi", "Mickael"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 6", players: ["Clinton", "Precious", "Success"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 7", players: ["Tobe", "Made in black", "Emmanuel"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 8", players: ["Ama", "Wisdom", "Kelvin"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 9", players: ["Charles", "Emeka", "Justin"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { name: "Team 10", players: ["Mayor", "Peter", "Demian"], p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
];

let playedMatches = new Set(JSON.parse(localStorage.getItem('cvcPlayed')) || []);
let fixtures = [];

// Add these to your window.onload function or at the top of the script
let currentPotw = JSON.parse(localStorage.getItem('cvcPotw')) || { name: "TBD", team: "Calculating..." };

function displayPotw() {
    document.getElementById('displayPotwName').innerText = currentPotw.name;
    document.getElementById('displayPotwTeam').innerText = currentPotw.team;
}

function updatePotw() {
    const newName = document.getElementById('inputPotwName').value;
    const newTeam = document.getElementById('inputPotwTeam').value;

    if (!newName || !newTeam) {
        alert("Please enter both Name and Team!");
        return;
    }

    currentPotw = { name: newName, team: newTeam };
    
    // Save to browser memory
    localStorage.setItem('cvcPotw', JSON.stringify(currentPotw));
    
    // Update the UI
    displayPotw();
    
    // Clear Admin inputs
    document.getElementById('inputPotwName').value = '';
    document.getElementById('inputPotwTeam').value = '';
    alert("Player of the Week updated!");
}

// Call displayPotw() inside your existing window.onload
window.onload = () => {
    // ... your existing init code ...
    displayPotw();
};

// 2. GENERATE FIXTURES (Round Robin)
function generateFixtures() {
    const numTeams = 10;
    let indices = Array.from({length: numTeams}, (_, i) => i);
    for (let round = 0; round < numTeams - 1; round++) {
        let roundFixtures = [];
        for (let i = 0; i < numTeams / 2; i++) {
            roundFixtures.push([indices[i], indices[numTeams - 1 - i]]);
        }
        fixtures.push(roundFixtures);
        indices.splice(1, 0, indices.pop());
    }
}

// 3. RENDER FUNCTIONS
function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return; // Error prevention

    // Sort: Points > GD > GF
    const sortedTeams = [...teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    
    tbody.innerHTML = '';
    sortedTeams.forEach((team, index) => {
        const isRelegated = index >= 8 ? 'relegation-row' : '';
        tbody.innerHTML += `
            <tr class="${isRelegated}">
                <td>${index + 1}</td>
                <td><strong>${team.name}</strong></td>
                <td>${team.p}</td>
                <td>${team.w}</td>
                <td>${team.d}</td>
                <td>${team.l}</td>
                <td>${team.gf}</td>
                <td>${team.ga}</td>
                <td>${team.gd}</td>
                <td>${team.pts}</td>
            </tr>
        `;
    });
}

function renderFixtures(weekIdx) {
    const list = document.getElementById('fixtureList');
    const select = document.getElementById('matchSelect');
    if(!list || !select) return;

    list.innerHTML = '';
    select.innerHTML = '<option value="">Select Match</option>';

    fixtures[weekIdx].forEach((match, i) => {
        const id = `${weekIdx}-${i}`;
        const t1 = teams[match[0]].name;
        const t2 = teams[match[1]].name;
        const done = playedMatches.has(id) ? '✅' : '';

        list.innerHTML += `<div class="fixture-item">${t1} vs ${t2} ${done}</div>`;
        select.innerHTML += `<option value="${id}">${t1} vs ${t2}</option>`;
    });
}

// 4. THE UPDATE BUTTON LOGIC
function saveScore() {
    const matchId = document.getElementById('matchSelect').value;
    const s1 = parseInt(document.getElementById('score1').value);
    const s2 = parseInt(document.getElementById('score2').value);

    if (!matchId || isNaN(s1) || isNaN(s2)) {
        alert("Enter scores for both teams!");
        return;
    }

    if (playedMatches.has(matchId)) {
        alert("This match score has already been recorded!");
        return;
    }

    const [wIdx, mIdx] = matchId.split('-').map(Number);
    const [idx1, idx2] = fixtures[wIdx][mIdx];

    // Update Team 1
    teams[idx1].p++;
    teams[idx1].gf += s1;
    teams[idx1].ga += s2;
    teams[idx1].gd = teams[idx1].gf - teams[idx1].ga;

    // Update Team 2
    teams[idx2].p++;
    teams[idx2].gf += s2;
    teams[idx2].ga += s1;
    teams[idx2].gd = teams[idx2].gf - teams[idx2].ga;

    // Points logic
    if (s1 > s2) { teams[idx1].w++; teams[idx1].pts += 3; teams[idx2].l++; }
    else if (s2 > s1) { teams[idx2].w++; teams[idx2].pts += 3; teams[idx1].l++; }
    else { teams[idx1].d++; teams[idx2].d++; teams[idx1].pts += 1; teams[idx2].pts += 1; }

    playedMatches.add(matchId);

    // Save to browser memory
    localStorage.setItem('cvcTeams', JSON.stringify(teams));
    localStorage.setItem('cvcPlayed', JSON.stringify(Array.from(playedMatches)));

    // Refresh UI
    renderTable();
    renderFixtures(wIdx);
    
    // Clear inputs
    document.getElementById('score1').value = '';
    document.getElementById('score2').value = '';
}

// 5. INITIALIZE
window.onload = () => {
    generateFixtures();
    const dropdown = document.getElementById('weekDropdown');
    if (dropdown) {
        for (let i = 0; i < 9; i++) {
            dropdown.innerHTML += `<option value="${i}">Week ${i + 1}</option>`;
        }
    }
    renderTable();
    renderFixtures(0);
    // Render rosters from previous code if you still have that section
    if(typeof renderRosters === "function") renderRosters(); 
};

function resetLeague() {
    // 1. Ask for confirmation so you don't delete everything by mistake
    const confirmation = confirm("Are you sure you want to reset the entire league? All scores and progress will be deleted forever.");
    
    if (confirmation) {
        // 2. Clear the specific items from LocalStorage
        localStorage.removeItem('cvcTeams');
        localStorage.removeItem('cvcPlayed');
        
        // 3. Reload the page to reset the code variables and UI
        location.reload();
    }
}

function updateLeaderboards() {
    const scorers = [
        { name: "No one", goals: 0 },
        { name: "No one", goals: 0 },
        { name: "No one", goals: 0 },
        { name: "No one", goals: 0 },
        { name: "No one", goals: 0 },
        { name: "No one", goals: 0 },
    ];

    const assists = [
        { name: "No one", counts: 0 },
        { name: "No one", counts: 0 },
        { name: "No one", counts: 0 },
        { name: "No one", counts: 0 },
        { name: "No one", counts: 0 },
        { name: "No one", counts: 0 },
    ];

    const scorerContainer = document.getElementById('topScorersList');
    const assistContainer = document.getElementById('topAssistsList');

    if (scorerContainer) {
        scorerContainer.innerHTML = scorers.map((p, i) => `
            <div class="stat-item">
                <div class="rank-badge">${i + 1}</div>
                <div class="player-name">${p.name}</div>
                <div class="stat-value">${p.goals} G</div>
            </div>
        `).join('');
    }

    if (assistContainer) {
        assistContainer.innerHTML = assists.map((p, i) => `
            <div class="stat-item">
                <div class="rank-badge">${i + 1}</div>
                <div class="player-name">${p.name}</div>
                <div class="stat-value">${p.counts} A</div>
            </div>
        `).join('');
    }
}

// Call this inside your window.onload and saveScore functions
updateLeaderboards();

function checkAdmin() {
    const password = prompt("Enter Admin Password to unlock controls:");
    
    // Change 'CVC2026' to your preferred secret password
    if (password === "CVC2026") {
        document.getElementById('adminControls').style.display = 'block';
        alert("Admin Access Granted. Controls Unlocked.");
        // Scroll to the controls
        document.getElementById('adminControls').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("Incorrect password. Access denied.");
    }
}

