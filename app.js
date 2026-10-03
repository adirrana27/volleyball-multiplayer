// --- SOCKET.IO MULTIPLAYER OVERRIDE ---
const socket = io();

async function hostOnlineRoom() {
    activeRoomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    isHost = true;
    socket.emit('join-room', activeRoomCode);
    

    document.getElementById('activeRoomCode').innerText = activeRoomCode;

    document.getElementById('activeRoomBox').classList.remove('hidden');
    showToast(`Room Hosted: ${activeRoomCode}`);
}

async function joinOnlineRoom(codeOverride) {
    const code = codeOverride || document.getElementById('joinRoomInput').value.trim().toUpperCase();
    if (!code) return showToast("Enter a room code!", true);
    
    activeRoomCode = code;
    isHost = false;
    socket.emit('join-room', activeRoomCode);
    

    document.getElementById('activeRoomCode').innerText = activeRoomCode;

    document.getElementById('activeRoomBox').classList.remove('hidden');
    showToast(`Joined Room: ${activeRoomCode}`);
}

socket.on('room-update', (data) => {
    showToast(data.message);
});

socket.on('rally-result', (data) => {
    // This receives the backend authoritative result!
    const homeWins = data.winner === 'HOME';
    trigger3DRallyAnimation(homeWins ? 'home' : 'away');
    
    // Update local state with authoritative server state
    matchState.scoreHome = data.matchState.scoreHome;
    matchState.scoreAway = data.matchState.scoreAway;
    updateMatchUI();
});

// Override the old simulatePoint to ask the server instead
function simulatePoint() {
    if (!activeRoomCode) {
        showToast("You must join or host a room first!", true);
        return;
    }
    socket.emit('play-rally', { roomCode: activeRoomCode });
}
        // VISUAL DESIGN & TEAM STYLES
        const TEAM_STYLES = {
            'Karasuno': { bg1: '#0b0f19', bg2: '#ea580c', border: '#f97316', accent: '#fdba74' },
            'Aoba Johsai': { bg1: '#042f2e', bg2: '#0d9488', border: '#14b8a6', accent: '#99f6e4' },
            'Nekoma': { bg1: '#450a0a', bg2: '#dc2626', border: '#ef4444', accent: '#fca5a5' },
            'Fukurodani': { bg1: '#1c1917', bg2: '#eab308', border: '#facc15', accent: '#fef08a' },
            'Shiratorizawa': { bg1: '#3f0713', bg2: '#be123c', border: '#f43f5e', accent: '#fecdd3' },
            'Inarizaki': { bg1: '#0f172a', bg2: '#7e22ce', border: '#a855f7', accent: '#e9d5ff' },
            'Kamomedai': { bg1: '#0c4a6e', bg2: '#0284c7', border: '#38bdf8', accent: '#bae6fd' },
            'Itachiyama': { bg1: '#14532d', bg2: '#ca8a04', border: '#eab308', accent: '#fef08a' },
            'Date Tech': { bg1: '#064e3b', bg2: '#059669', border: '#10b981', accent: '#a7f3d0' },
            'REAL': { bg1: '#082f49', bg2: '#2563eb', border: '#00f0ff', accent: '#7dd3fc' },
            'DEFAULT': { bg1: '#0f172a', bg2: '#475569', border: '#64748b', accent: '#cbd5e1' }
        };

        const CHARACTER_VISUALS = {
            'Tobio Kageyama': { hairColor: '#1e293b' },
            'Shoyo Hinata': { hairColor: '#f97316' },
            'Daichi Sawamura': { hairColor: '#334155' },
            'Koshi Sugawara': { hairColor: '#94a3b8' },
            'Asahi Azumane': { hairColor: '#78350f' },
            'Ryunosuke Tanaka': { hairColor: '#cbd5e1' },
            'Yu Nishinoya': { hairColor: '#1e293b', extra: 'blonde-forelock' },
            'Kei Tsukishima': { hairColor: '#eab308', extra: 'glasses' },
            'Tadashi Yamaguchi': { hairColor: '#15803d' },
            'Toru Oikawa': { hairColor: '#78350f' },
            'Hajime Iwaizumi': { hairColor: '#334155' },
            'Tetsuro Kuroo': { hairColor: '#0f172a' },
            'Kenma Kozume': { hairColor: '#facc15' },
            'Morisuke Yaku': { hairColor: '#d97706' },
            'Kotaro Bokuto': { hairColor: '#e2e8f0' },
            'Keiji Akaashi': { hairColor: '#1e293b' },
            'Wakatoshi Ushijima': { hairColor: '#3f6212' },
            'Satori Tendo': { hairColor: '#ef4444' },
            'Atsumu Miya': { hairColor: '#f59e0b' },
            'Osamu Miya': { hairColor: '#94a3b8' },
            'Aran Ojiro': { hairColor: '#334155' },
            'Rintaro Suna': { hairColor: '#451a03' },
            'Korai Hoshiumi': { hairColor: '#f8fafc' },
            'Sachiro Hirugami': { hairColor: '#94a3b8' },
            'Kiyoomi Sakusa': { hairColor: '#0f172a', extra: 'forehead-moles' },
            'Takanobu Aone': { hairColor: '#fef08a' }
        };

        function generateCharacterSVG(player) {
            const teamStyle = TEAM_STYLES[player.origin] || TEAM_STYLES['DEFAULT'];
            const charVis = CHARACTER_VISUALS[player.name] || { hairColor: teamStyle.accent };

            let extraSVG = '';
            if (charVis.extra === 'glasses') {
                extraSVG = `<rect x="32" y="38" width="12" height="8" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/><rect x="56" y="38" width="12" height="8" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/><line x1="44" y1="42" x2="56" y2="42" stroke="#ffffff" stroke-width="2"/>`;
            } else if (charVis.extra === 'blonde-forelock') {
                extraSVG = `<path d="M46 22 Q50 12 54 22 Z" fill="#facc15" />`;
            } else if (charVis.extra === 'forehead-moles') {
                extraSVG = `<circle cx="44" cy="30" r="1.5" fill="#000000"/><circle cx="48" cy="30" r="1.5" fill="#000000"/>`;
            }

            const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full rounded-full">
                <defs>
                    <linearGradient id="bg_${player.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${teamStyle.bg1}" />
                        <stop offset="100%" stop-color="${teamStyle.bg2}" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#bg_${player.id})" stroke="${teamStyle.border}" stroke-width="3" />
                <path d="M25 45 Q50 10 75 45 Q75 30 50 18 Q25 30 25 45 Z" fill="${charVis.hairColor}" />
                <circle cx="50" cy="48" r="22" fill="#fed7aa" />
                <path d="M28 38 C35 20, 65 20, 72 38 C60 28, 40 28, 28 38 Z" fill="${charVis.hairColor}" />
                <circle cx="40" cy="46" r="3" fill="#1e293b" />
                <circle cx="60" cy="46" r="3" fill="#1e293b" />
                ${extraSVG}
                <path d="M22 82 Q50 68 78 82 L85 100 L15 100 Z" fill="${teamStyle.bg1}" stroke="${teamStyle.border}" stroke-width="2" />
                <circle cx="50" cy="85" r="10" fill="#0f172a" stroke="${teamStyle.accent}" stroke-width="1.5" />
                <text x="50" y="89" font-family="Orbitron, sans-serif" font-size="10" font-weight="900" fill="${teamStyle.accent}" text-anchor="middle">${player.num || ''}</text>
            </svg>`;

            return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        }

        // 80+ PLAYER DATABASE
        const PLAYER_DATABASE = [
            // KARASUNO
            { id: 'hk1', name: 'Tobio Kageyama', pos: 'S', origin: 'Karasuno', num: 9, spike: 88, block: 84, receive: 80, setting: 98, serve: 92, stamina: 95, morale: 88, weakness: 'Tilt On Blocked', traits: ['World-Class Setter', 'King\'s Precision', 'Dump Spiker', 'Ace Server'] },
            { id: 'hk2', name: 'Shoyo Hinata', pos: 'MB', origin: 'Karasuno', num: 10, spike: 92, block: 76, receive: 78, setting: 60, serve: 72, stamina: 99, morale: 98, weakness: 'Service Receive Flaw', traits: ['Freak Quick', 'Decoy Master', 'High Vertical', 'Back-Row Threat'] },
            { id: 'hk3', name: 'Daichi Sawamura', pos: 'OH', origin: 'Karasuno', num: 1, spike: 80, block: 81, receive: 94, setting: 72, serve: 78, stamina: 90, morale: 92, weakness: 'None', traits: ['Solid Captain', 'Elite Receiver', 'Floor Defense God'] },
            { id: 'hk4', name: 'Koshi Sugawara', pos: 'S', origin: 'Karasuno', num: 2, spike: 72, block: 70, receive: 82, setting: 88, serve: 80, stamina: 82, morale: 90, weakness: 'None', traits: ['Tactical Setter', 'Dual Setter Play'] },
            { id: 'hk5', name: 'Asahi Azumane', pos: 'OH', origin: 'Karasuno', num: 3, spike: 94, block: 82, receive: 79, setting: 55, serve: 91, stamina: 85, morale: 78, weakness: 'Cold Start', traits: ['Karasuno Ace', 'Power Spiker', 'Ace Server', 'Superb Finisher'] },
            { id: 'hk6', name: 'Ryunosuke Tanaka', pos: 'OH', origin: 'Karasuno', num: 5, spike: 88, block: 77, receive: 82, setting: 60, serve: 82, stamina: 90, morale: 95, weakness: 'None', traits: ['Cross Shot Specialist', 'Straight Shot Expert'] },
            { id: 'hk7', name: 'Yu Nishinoya', pos: 'L', origin: 'Karasuno', num: 4, spike: 40, block: 30, receive: 99, setting: 84, serve: 0, stamina: 98, morale: 99, weakness: 'None', traits: ['Rolling Thunder', 'Floor Defense God', 'Elite Receiver'] },
            { id: 'hk8', name: 'Kei Tsukishima', pos: 'MB', origin: 'Karasuno', num: 11, spike: 83, block: 95, receive: 74, setting: 60, serve: 76, stamina: 78, morale: 80, weakness: 'Stamina Burnout', traits: ['Read Blocker', 'Block Wall'] },
            { id: 'hk9', name: 'Tadashi Yamaguchi', pos: 'MB', origin: 'Karasuno', num: 12, spike: 70, block: 74, receive: 71, setting: 55, serve: 89, stamina: 75, morale: 72, weakness: 'Cold Start', traits: ['Jump Float Ace', 'Ace Server'] },

            // SEIJOH (AOBA JOHSAI)
            { id: 'ha1', name: 'Toru Oikawa', pos: 'S', origin: 'Aoba Johsai', num: 1, spike: 87, block: 82, receive: 84, setting: 97, serve: 98, stamina: 92, morale: 94, weakness: 'None', traits: ['World-Class Setter', 'Ace Server', 'Dump Spiker'] },
            { id: 'ha2', name: 'Hajime Iwaizumi', pos: 'OH', origin: 'Aoba Johsai', num: 4, spike: 92, block: 83, receive: 87, setting: 68, serve: 86, stamina: 91, morale: 93, weakness: 'None', traits: ['Seijoh Ace', 'Straight Shot Expert', 'Superb Finisher'] },
            { id: 'ha3', name: 'Issei Matsukawa', pos: 'MB', origin: 'Aoba Johsai', num: 2, spike: 81, block: 89, receive: 76, setting: 55, serve: 78, stamina: 85, morale: 82, weakness: 'None', traits: ['Pressure Blocker', 'Read Blocker'] },

            // NEKOMA
            { id: 'hn1', name: 'Tetsuro Kuroo', pos: 'MB', origin: 'Nekoma', num: 1, spike: 86, block: 96, receive: 87, setting: 70, serve: 85, stamina: 90, morale: 91, weakness: 'None', traits: ['Read Blocker', 'Block Wall', 'Floor Defense God'] },
            { id: 'hn2', name: 'Kenma Kozume', pos: 'S', origin: 'Nekoma', num: 5, spike: 70, block: 72, receive: 85, setting: 95, serve: 78, stamina: 65, morale: 80, weakness: 'Stamina Burnout', traits: ['Tactical Setter', 'Dump Spiker', 'Lethal Feint'] },
            { id: 'hn3', name: 'Morisuke Yaku', pos: 'L', origin: 'Nekoma', num: 3, spike: 35, block: 25, receive: 99, setting: 75, serve: 0, stamina: 95, morale: 96, weakness: 'None', traits: ['Elite Receiver', 'Floor Defense God', 'Rolling Thunder'] },
            { id: 'hn4', name: 'Lev Haiba', pos: 'MB', origin: 'Nekoma', num: 11, spike: 89, block: 88, receive: 60, setting: 40, serve: 70, stamina: 88, morale: 85, weakness: 'Service Receive Flaw', traits: ['Whip Spike', 'High Vertical'] },

            // FUKURODANI
            { id: 'hf1', name: 'Kotaro Bokuto', pos: 'OH', origin: 'Fukurodani', num: 4, spike: 96, block: 83, receive: 83, setting: 65, serve: 89, stamina: 94, morale: 75, weakness: 'Tilt On Blocked', traits: ['Cross Shot Specialist', 'Straight Shot Expert', 'Superb Finisher', 'Back-Row Threat'] },
            { id: 'hf2', name: 'Keiji Akaashi', pos: 'S', origin: 'Fukurodani', num: 5, spike: 78, block: 81, receive: 82, setting: 94, serve: 82, stamina: 88, morale: 89, weakness: 'None', traits: ['Fast Tempo Setter', 'Tactical Setter'] },

            // SHIRATORIZAWA
            { id: 'hs1', name: 'Wakatoshi Ushijima', pos: 'OP', origin: 'Shiratorizawa', num: 1, spike: 99, block: 88, receive: 81, setting: 50, serve: 96, stamina: 98, morale: 96, weakness: 'None', traits: ['Southpaw Cannon', 'Superb Finisher', 'Ace Server'] },
            { id: 'hs2', name: 'Satori Tendo', pos: 'MB', origin: 'Shiratorizawa', num: 5, spike: 84, block: 97, receive: 70, setting: 48, serve: 78, stamina: 88, morale: 90, weakness: 'Weak to Triple Block', traits: ['Guess Blocker', 'Block Wall'] },

            // INARIZAKI
            { id: 'hi1', name: 'Atsumu Miya', pos: 'S', origin: 'Inarizaki', num: 7, spike: 89, block: 82, receive: 82, setting: 98, serve: 97, stamina: 92, morale: 90, weakness: 'None', traits: ['Dual Wielder Serve', 'Freak Quick', 'World-Class Setter', 'Ace Server'] },
            { id: 'hi2', name: 'Osamu Miya', pos: 'OP', origin: 'Inarizaki', num: 11, spike: 91, block: 84, receive: 85, setting: 89, serve: 89, stamina: 92, morale: 88, weakness: 'None', traits: ['Freak Quick', 'Cross Shot Specialist'] },
            { id: 'hi3', name: 'Aran Ojiro', pos: 'OH', origin: 'Inarizaki', num: 4, spike: 95, block: 82, receive: 81, setting: 55, serve: 90, stamina: 89, morale: 87, weakness: 'None', traits: ['Superb Finisher', 'Power Spiker'] },
            { id: 'hi4', name: 'Rintaro Suna', pos: 'MB', origin: 'Inarizaki', num: 10, spike: 92, block: 91, receive: 72, setting: 50, serve: 78, stamina: 86, morale: 85, weakness: 'Cold Start', traits: ['Wide Core Spiker', 'Block Wall'] },

            // KAMOMEDAI & ITACHIYAMA & DATE TECH
            { id: 'hkam1', name: 'Korai Hoshiumi', pos: 'OH', origin: 'Kamomedai', num: 5, spike: 95, block: 87, receive: 92, setting: 86, serve: 91, stamina: 96, morale: 95, weakness: 'None', traits: ['Little Giant', 'Superb Finisher', 'High Vertical', 'Back-Row Threat'] },
            { id: 'hkam2', name: 'Sachiro Hirugami', pos: 'MB', origin: 'Kamomedai', num: 10, spike: 87, block: 99, receive: 78, setting: 52, serve: 85, stamina: 92, morale: 92, weakness: 'None', traits: ['Immovable Hirugami', 'Read Blocker', 'Block Wall'] },
            { id: 'hit1', name: 'Kiyoomi Sakusa', pos: 'OH', origin: 'Itachiyama', num: 10, spike: 97, block: 86, receive: 93, setting: 70, serve: 92, stamina: 94, morale: 92, weakness: 'None', traits: ['Whip Spike', 'Superb Finisher', 'Elite Receiver'] },
            { id: 'hd1', name: 'Takanobu Aone', pos: 'MB', origin: 'Date Tech', num: 7, spike: 85, block: 98, receive: 72, setting: 45, serve: 78, stamina: 91, morale: 88, weakness: 'None', traits: ['Iron Wall', 'Read Blocker', 'Block Wall'] },

            // REAL WORLD PROS
            { id: 'r1', name: 'Yuji Nishida', pos: 'OP', origin: 'REAL', num: 1, spike: 98, block: 86, receive: 80, setting: 62, serve: 99, stamina: 96, morale: 98, weakness: 'None', traits: ['Southpaw Cannon', 'Ace Server', 'Superb Finisher'] },
            { id: 'r2', name: 'Ran Takahashi', pos: 'OH', origin: 'REAL', num: 12, spike: 92, block: 86, receive: 98, setting: 87, serve: 90, stamina: 95, morale: 94, weakness: 'None', traits: ['Elite Receiver', 'Pipe Attack Specialist', 'Floor Defense God', 'Back-Row Threat'] },
            { id: 'r3', name: 'Yuki Ishikawa', pos: 'OH', origin: 'REAL', num: 14, spike: 97, block: 86, receive: 93, setting: 84, serve: 94, stamina: 96, morale: 96, weakness: 'None', traits: ['Straight Shot Expert', 'Superb Finisher', 'Cross Shot Specialist'] },
            { id: 'r4', name: 'Simone Giannelli', pos: 'S', origin: 'REAL', num: 6, spike: 86, block: 92, receive: 84, setting: 99, serve: 91, stamina: 94, morale: 95, weakness: 'None', traits: ['World-Class Setter', 'Dump Spiker', 'Block Wall'] },
            { id: 'r5', name: 'Earvin N\'Gapeth', pos: 'OH', origin: 'REAL', num: 9, spike: 95, block: 85, receive: 94, setting: 83, serve: 92, stamina: 92, morale: 92, weakness: 'None', traits: ['Trickster', 'Lethal Feint', 'Cross Shot Specialist'] },
            { id: 'r6', name: 'Wilfredo León', pos: 'OH', origin: 'REAL', num: 9, spike: 99, block: 90, receive: 81, setting: 55, serve: 99, stamina: 95, morale: 95, weakness: 'None', traits: ['Ace Server', 'Superb Finisher', 'Back-Row Threat'] }
        ];

        let currentFormation = '5-1';
        let currentRotation = 1;
        let isLiberoSwapEnabled = true;
        let selectedFilter = 'ALL';
        let sfxEnabled = true;
        let activeTargetModalSlot = null;
        let activeDirective = 'BALANCED';
        let botDifficulty = 'HARD';

        let currentLineup = {
            1: PLAYER_DATABASE.find(p => p.id === 'hk1'), // Kageyama
            2: PLAYER_DATABASE.find(p => p.id === 'r1'),  // Nishida
            3: PLAYER_DATABASE.find(p => p.id === 'hn1'), // Kuroo
            4: PLAYER_DATABASE.find(p => p.id === 'r3'),  // Ishikawa
            5: PLAYER_DATABASE.find(p => p.id === 'r2'),  // Ran Takahashi
            6: PLAYER_DATABASE.find(p => p.id === 'hk2'), // Hinata
            libero: PLAYER_DATABASE.find(p => p.id === 'hk7') // Nishinoya
        };

        let matchState = {
            active: false,
            homeScore: 0,
            awayScore: 0,
            setHome: 0,
            setAway: 0,
            servingTeam: 'HOME',
            homeRotation: 1,
            awayRotation: 1,
            opponentTeam: [],
            autoSimTimer: null,
            stats: { kills: 0, blocks: 0, aces: 0, digs: 0, fouls: 0 },
            logs: []
        };

        // FIREBASE REAL-TIME MULTIPLAYER ENGINE
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'volleyball-3d-app';
        let db = null, auth = null, currentUser = null;
        let activeRoomCode = null;
        let isHost = false;
        let roomUnsubscribe = null;

        // Custom Toast Banner (Zero Browser Alerts)
        function showToast(message, isError = false) {
            const toast = document.getElementById('toastNotification');
            const msgEl = document.getElementById('toastMessage');
            const icon = document.getElementById('toastIcon');

            if (!toast || !msgEl || !icon) return;

            msgEl.innerText = message;
            if (isError) {
                toast.className = toast.className.replace('border-cyan-500/80 text-cyan-200', 'border-red-500/80 text-red-200');
                icon.setAttribute('data-lucide', 'alert-circle');
                icon.className = 'w-5 h-5 text-red-400';
            } else {
                toast.className = toast.className.replace('border-red-500/80 text-red-200', 'border-cyan-500/80 text-cyan-200');
                icon.setAttribute('data-lucide', 'check-circle-2');
                icon.className = 'w-5 h-5 text-cyan-400';
            }
            lucide.createIcons();

            toast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            }, 3200);
        }

        async function initFirebaseMultiplayer() {
            if (!window.FB) return;
            try {
                if (typeof __firebase_config !== 'undefined' && __firebase_config) {
                    const config = JSON.parse(__firebase_config);
                    const app = window.FB.initializeApp(config);
                    db = window.FB.getFirestore(app);
                    auth = window.FB.getAuth(app);

                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        const cred = await window.FB.signInWithCustomToken(auth, __initial_auth_token);
                        currentUser = cred.user;
                    } else {
                        const cred = await window.FB.signInAnonymously(auth);
                        currentUser = cred.user;
                    }
                }
            } catch (err) {
                console.warn('Firebase init fallback:', err);
            }
        }

        async function copyToClipboard(text, successMessage) {
            let copied = false;

            // Try Navigator Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    copied = true;
                } catch (e) {
                    console.warn('Clipboard writeText failed:', e);
                }
            }

            // Fallback to execCommand copy
            if (!copied) {
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    textArea.style.top = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    copied = document.execCommand('copy');
                    document.body.removeChild(textArea);
                } catch (err) {
                    console.warn('execCommand copy failed:', err);
                }
            }

            if (copied) {
                showToast(successMessage || '✓ Copied to clipboard!');
            } else {
                showToast('Text highlighted! Press Ctrl+C or Cmd+C to copy.', false);
            }
        }

        async function hostOnlineRoom() {
            if (!currentUser) await initFirebaseMultiplayer();

            const rawCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            const code = 'VOLLEY-' + rawCode;
            activeRoomCode = code;
            isHost = true;

            const baseUrl = window.location.href.split('?')[0].split('#')[0];
            const roomUrl = `${baseUrl}?room=${code}`;

            document.getElementById('activeRoomCode').innerText = code;
            const shareInput = document.getElementById('shareUrlInput');
            shareInput.value = roomUrl;
            document.getElementById('activeRoomBox').classList.remove('hidden');

            // Pre-select text for immediate manual fallback copy
            shareInput.focus();
            shareInput.select();

            if (db && currentUser) {
                try {
                    const roomRef = window.FB.doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);
                    await window.FB.setDoc(roomRef, {
                        code: code,
                        shortCode: rawCode,
                        hostId: currentUser.uid,
                        guestId: null,
                        status: 'WAITING',
                        hostLineup: currentLineup,
                        matchState: matchState,
                        updatedAt: Date.now()
                    });

                    listenToRoomUpdates(code);
                    showToast('Room created! Copy link or code to invite friend.');
                } catch (e) {
                    showToast('Room ready! Room Code: ' + code);
                }
            } else {
                showToast('Room ready! Code: ' + code);
            }
        }

        async function joinOnlineRoom(codeOverride) {
            if (!currentUser) await initFirebaseMultiplayer();

            let inputVal = (codeOverride || document.getElementById('joinRoomInput').value.trim());

            if (!inputVal) {
                showToast('Please enter a room code or link.', true);
                return;
            }

            // Extract room parameter if a full URL was pasted
            if (inputVal.includes('?room=')) {
                inputVal = inputVal.split('?room=')[1].split('&')[0];
            } else if (inputVal.includes('room=')) {
                inputVal = inputVal.split('room=')[1].split('&')[0];
            }

            inputVal = inputVal.toUpperCase();

            // Auto-format short codes like "8X2K" into "VOLLEY-8X2K"
            if (!inputVal.startsWith('VOLLEY-') && inputVal.length <= 6) {
                inputVal = 'VOLLEY-' + inputVal;
            }

            activeRoomCode = inputVal;
            isHost = false;

            if (db && currentUser) {
                try {
                    const roomRef = window.FB.doc(db, 'artifacts', appId, 'public', 'data', 'rooms', inputVal);
                    const snap = await window.FB.getDoc(roomRef);

                    if (snap.exists()) {
                        await window.FB.updateDoc(roomRef, {
                            guestId: currentUser.uid,
                            guestLineup: currentLineup,
                            status: 'CONNECTED',
                            updatedAt: Date.now()
                        });

                        listenToRoomUpdates(inputVal);
                        closeMultiplayerModal();
                        showToast(`Connected to Room ${inputVal}!`);
                        switchView('match');
                    } else {
                        showToast('Room not found. Verify code or create a new room.', true);
                    }
                } catch (e) {
                    showToast(`Joined Room ${inputVal}! Ready for match.`);
                    closeMultiplayerModal();
                    switchView('match');
                }
            } else {
                showToast(`Joined Room ${inputVal}! Ready for match.`);
                closeMultiplayerModal();
                switchView('match');
            }
        }

        function listenToRoomUpdates(code) {
            if (!db) return;
            if (roomUnsubscribe) roomUnsubscribe();

            const roomRef = window.FB.doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);
            roomUnsubscribe = window.FB.onSnapshot(roomRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const badge = document.getElementById('multiplayerStatusBadge');

                    if (data.status === 'CONNECTED' || data.guestId) {
                        badge.innerText = 'OPPONENT CONNECTED';
                        badge.className = 'text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono';
                        
                        // Sync remote team lineup
                        if (isHost && data.guestLineup) {
                            matchState.opponentTeam = Object.values(data.guestLineup).filter(Boolean);
                            document.getElementById('awayTeamName').innerText = "Player 2's Squad";
                        } else if (!isHost && data.hostLineup) {
                            matchState.opponentTeam = Object.values(data.hostLineup).filter(Boolean);
                            document.getElementById('awayTeamName').innerText = "Player 1's Squad";
                        }

                        // Sync match score if updated by opponent
                        if (data.lastMatchState && data.lastUpdatedBy !== currentUser?.uid) {
                            matchState = { ...matchState, ...data.lastMatchState };
                            updateMatchUI();
                        }
                    }
                }
            }, (err) => console.warn("Firestore snapshot listener error:", err));
        }

        async function syncLineupToRoom() {
            if (!db || !activeRoomCode || !currentUser) {
                showToast('Lineup updated locally!');
                return;
            }
            try {
                const roomRef = window.FB.doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
                const field = isHost ? 'hostLineup' : 'guestLineup';
                await window.FB.updateDoc(roomRef, {
                    [field]: currentLineup,
                    updatedAt: Date.now()
                });
                showToast('Lineup synchronized with opponent!');
            } catch (e) {
                showToast('Lineup synchronized!');
            }
        }

        function copyShareLink() {
            const input = document.getElementById('shareUrlInput');
            if (!input || !input.value) {
                showToast('Host a room first to generate a link.', true);
                return;
            }
            input.focus();
            input.select();
            input.setSelectionRange(0, 99999);
            copyToClipboard(input.value, '✓ Direct Room Link copied to clipboard!');
        }

        function copyRoomCodeOnly() {
            if (!activeRoomCode) {
                showToast('Host or join a room first.', true);
                return;
            }
            copyToClipboard(activeRoomCode, `✓ Room Code "${activeRoomCode}" copied!`);
        }

        // THREE.JS 3D SCENE & ENGINE
        let scene3D, camera3D, renderer3D;
        let player3DGroup, ball3DMesh;
        let playerMeshesHome = {};
        let playerMeshesAway = {};

        function init3DScene() {
            const container = document.getElementById('canvas3DContainer');
            if (!container) return;
            container.innerHTML = '';

            const width = container.clientWidth || 700;
            const height = container.clientHeight || 450;

            scene3D = new THREE.Scene();
            scene3D.background = new THREE.Color(0x050811);

            camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera3D.position.set(0, 18, 28);
            camera3D.lookAt(0, 0, 0);

            renderer3D = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
            renderer3D.setSize(width, height);
            renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer3D.shadowMap.enabled = true;
            container.appendChild(renderer3D.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene3D.add(ambientLight);

            const spotLight1 = new THREE.SpotLight(0x00f0ff, 1.2);
            spotLight1.position.set(-15, 25, 10);
            spotLight1.castShadow = true;
            scene3D.add(spotLight1);

            const spotLight2 = new THREE.SpotLight(0xa855f7, 1.2);
            spotLight2.position.set(15, 25, -10);
            spotLight2.castShadow = true;
            scene3D.add(spotLight2);

            // Wooden Court Surface Material
            const courtGeo = new THREE.PlaneGeometry(18, 9);
            const courtMat = new THREE.MeshStandardMaterial({ 
                color: 0xdd6b20, 
                roughness: 0.3, 
                metalness: 0.1 
            });
            const courtMesh = new THREE.Mesh(courtGeo, courtMat);
            courtMesh.rotation.x = -Math.PI / 2;
            courtMesh.receiveShadow = true;
            scene3D.add(courtMesh);

            // Free Zone Surrounding Court
            const freeZoneGeo = new THREE.PlaneGeometry(26, 15);
            const freeZoneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
            const freeZoneMesh = new THREE.Mesh(freeZoneGeo, freeZoneMat);
            freeZoneMesh.rotation.x = -Math.PI / 2;
            freeZoneMesh.position.y = -0.01;
            scene3D.add(freeZoneMesh);

            // Net & Antennae
            const netGeo = new THREE.PlaneGeometry(0.1, 9);
            const netMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
            const netMesh = new THREE.Mesh(netGeo, netMat);
            netMesh.position.set(0, 1.2, 0);
            netMesh.rotation.y = Math.PI / 2;
            scene3D.add(netMesh);

            // Net Poles
            const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
            const pole1 = new THREE.Mesh(poleGeo, poleMat);
            pole1.position.set(0, 1.4, 4.6);
            const pole2 = new THREE.Mesh(poleGeo, poleMat);
            pole2.position.set(0, 1.4, -4.6);
            scene3D.add(pole1, pole2);

            // 3D Volleyball Mesh
            const ballGeo = new THREE.SphereGeometry(0.25, 16, 16);
            const ballMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
            ball3DMesh = new THREE.Mesh(ballGeo, ballMat);
            ball3DMesh.position.set(-8, 1, 0);
            scene3D.add(ball3DMesh);

            player3DGroup = new THREE.Group();
            scene3D.add(player3DGroup);

            setup3DPlayerFigurines();
            animate3DRender();

            window.addEventListener('resize', () => {
                if (!container || !renderer3D) return;
                const w = container.clientWidth;
                const h = container.clientHeight;
                camera3D.aspect = w / h;
                camera3D.updateProjectionMatrix();
                renderer3D.setSize(w, h);
            });
        }

        function create3DFigurineMesh(colorHex) {
            const group = new THREE.Group();
            
            // Body Torso
            const bodyGeo = new THREE.CylinderGeometry(0.3, 0.2, 1.1, 8);
            const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.55;
            body.castShadow = true;
            group.add(body);

            // Head
            const headGeo = new THREE.SphereGeometry(0.22, 12, 12);
            const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 1.25;
            group.add(head);

            return group;
        }

        function setup3DPlayerFigurines() {
            if (!player3DGroup) return;
            player3DGroup.clear();

            const posCoordsHome = {
                1: [-6, 0, 3],  // P1 Back Right
                2: [-2, 0, 3],  // P2 Front Right
                3: [-2, 0, 0],  // P3 Front Center
                4: [-2, 0, -3], // P4 Front Left
                5: [-6, 0, -3], // P5 Back Left
                6: [-6, 0, 0]   // P6 Back Center
            };

            const posCoordsAway = {
                1: [6, 0, -3],  // P1 Back Right
                2: [2, 0, -3],  // P2 Front Right
                3: [2, 0, 0],   // P3 Front Center
                4: [2, 0, 3],   // P4 Front Left
                5: [6, 0, 3],   // P5 Back Left
                6: [6, 0, 0]    // P6 Back Center
            };

            // 6 Home Players (Cyan Jerseys)
            for (let pos = 1; pos <= 6; pos++) {
                const mesh = create3DFigurineMesh(0x00f0ff);
                const coords = posCoordsHome[pos];
                mesh.position.set(coords[0], coords[1], coords[2]);
                player3DGroup.add(mesh);
                playerMeshesHome[pos] = mesh;
            }

            // 6 Away Players (Purple Jerseys)
            for (let pos = 1; pos <= 6; pos++) {
                const mesh = create3DFigurineMesh(0xa855f7);
                const coords = posCoordsAway[pos];
                mesh.position.set(coords[0], coords[1], coords[2]);
                player3DGroup.add(mesh);
                playerMeshesAway[pos] = mesh;
            }
        }

        function animate3DRender() {
            requestAnimationFrame(animate3DRender);
            if (renderer3D && scene3D && camera3D) {
                renderer3D.render(scene3D, camera3D);
            }
        }

        function set3DCameraAngle(mode) {
            if (!camera3D) return;
            if (mode === 'broadcast') {
                camera3D.position.set(0, 18, 28);
                camera3D.lookAt(0, 0, 0);
            } else if (mode === 'sideline') {
                camera3D.position.set(22, 12, 0);
                camera3D.lookAt(0, 0, 0);
            } else if (mode === 'behind') {
                camera3D.position.set(-25, 14, 0);
                camera3D.lookAt(0, 0, 0);
            }
        }

        function trigger3DRallyAnimation(winner) {
            if (!ball3DMesh) return;
            
            const startX = matchState.servingTeam === 'HOME' ? -8 : 8;
            const endX = winner === 'HOME' ? 6 : -6;
            
            let frame = 0;
            const animateBall = () => {
                frame++;
                const progress = frame / 40;
                if (progress <= 1) {
                    ball3DMesh.position.x = startX + (endX - startX) * progress;
                    ball3DMesh.position.y = 1 + Math.sin(progress * Math.PI) * 5;
                    requestAnimationFrame(animateBall);
                } else {
                    ball3DMesh.position.set(endX, 0.25, 0);
                }
            };
            animateBall();
        }

        let audioCtx = null;
        function playWhistleSound(type = 'whistle') {
            if (!sfxEnabled) return;
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                if (type === 'whistle') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(2800, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(3200, audioCtx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                } else if (type === 'spike') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.15);
                }
                osc.connect(gain);
                gain.connect(audioCtx.destination);
            } catch (e) { console.log(e); }
        }

        function toggleSound() {
            sfxEnabled = !sfxEnabled;
            const icon = document.getElementById('soundIcon');
            if (sfxEnabled) {
                icon.setAttribute('data-lucide', 'volume-2');
                playWhistleSound('whistle');
            } else {
                icon.setAttribute('data-lucide', 'volume-x');
            }
            lucide.createIcons();
        }

        function switchView(viewName) {
            const vTactics = document.getElementById('viewTactics');
            const vMatch = document.getElementById('viewMatch');
            const btnTactics = document.getElementById('navTabTactics');
            const btnMatch = document.getElementById('navTabMatch');

            if (viewName === 'tactics') {
                vTactics.classList.remove('hidden');
                vMatch.classList.add('hidden');
                btnTactics.className = 'px-3 py-1.5 rounded-lg text-cyan-400 font-bold bg-slate-800 shadow transition flex items-center gap-1.5';
                btnMatch.className = 'px-3 py-1.5 rounded-lg text-slate-400 font-bold hover:text-white transition flex items-center gap-1.5';
            } else {
                vMatch.classList.remove('hidden');
                vTactics.classList.add('hidden');
                btnMatch.className = 'px-3 py-1.5 rounded-lg text-cyan-400 font-bold bg-slate-800 shadow transition flex items-center gap-1.5';
                btnTactics.className = 'px-3 py-1.5 rounded-lg text-slate-400 font-bold hover:text-white transition flex items-center gap-1.5';
                
                if (!renderer3D) setTimeout(init3DScene, 100);
                if (!matchState.active) startAIMatch();
            }
        }

        function getPlayerAtPosition(posNum, rotation = currentRotation) {
            const shift = (rotation - 1);
            let basePos = ((posNum - 1 + shift) % 6) + 1;
            let player = currentLineup[basePos];

            if (isLiberoSwapEnabled && currentLineup.libero && player && player.pos === 'MB' && [1, 5, 6].includes(posNum)) {
                return { ...currentLineup.libero, isLiberoSwapped: true, originalPlayer: player };
            }

            return player;
        }

        function renderRoster() {
            const container = document.getElementById('rosterList');
            const searchVal = document.getElementById('searchInput').value.toLowerCase();
            container.innerHTML = '';

            const filtered = PLAYER_DATABASE.filter(p => {
                const matchesFilter = selectedFilter === 'ALL' ||
                    (selectedFilter === 'REAL' && p.origin === 'REAL') ||
                    (p.origin.toLowerCase() === selectedFilter.toLowerCase()) ||
                    (p.pos === selectedFilter);
                
                const matchesSearch = p.name.toLowerCase().includes(searchVal) ||
                    p.origin.toLowerCase().includes(searchVal) ||
                    p.traits.some(t => t.toLowerCase().includes(searchVal)) ||
                    p.pos.toLowerCase().includes(searchVal);

                return matchesFilter && matchesSearch;
            });

            document.getElementById('rosterCountTag').innerText = `${filtered.length} Loaded`;

            filtered.forEach(p => {
                const isAssigned = Object.values(currentLineup).some(lp => lp && lp.id === p.id);
                const avatarSrc = p.realImg || generateCharacterSVG(p);

                const card = document.createElement('div');
                card.className = `p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isAssigned 
                    ? 'bg-slate-900/40 border-cyan-500/30 opacity-75' 
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                }`;

                const posBadgeBg = {
                    'S': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                    'OH': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                    'OP': 'bg-red-500/20 text-red-300 border-red-500/40',
                    'MB': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                    'L': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }[p.pos] || 'bg-slate-800 text-slate-300';

                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2.5 min-w-0">
                            <img src="${avatarSrc}" alt="${p.name}" class="w-9 h-9 rounded-full object-cover border border-cyan-400 shadow-sm flex-shrink-0">
                            <div class="truncate">
                                <div class="flex items-center space-x-1.5">
                                    <h4 class="text-xs font-bold text-white truncate">${p.name}</h4>
                                    <span class="w-5 h-4 text-[9px] font-display font-bold rounded flex items-center justify-center border ${posBadgeBg} flex-shrink-0">
                                        ${p.pos}
                                    </span>
                                </div>
                                <span class="text-[9px] text-slate-400">#${p.num} • ${p.origin}</span>
                            </div>
                        </div>
                        ${isAssigned ? '<span class="text-[8px] text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800 flex-shrink-0">ON COURT</span>' : ''}
                    </div>

                    <div class="flex flex-wrap gap-1">
                        ${p.traits.slice(0, 2).map(t => `<span class="text-[8px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">${t}</span>`).join('')}
                        ${p.weakness && p.weakness !== 'None' ? `<span class="text-[8px] bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded border border-red-900/40">Flaw: ${p.weakness}</span>` : ''}
                    </div>
                `;

                card.onclick = () => {
                    if (isAssigned) {
                        for (let k in currentLineup) {
                            if (currentLineup[k] && currentLineup[k].id === p.id) {
                                currentLineup[k] = null;
                            }
                        }
                    } else {
                        if (p.pos === 'L') {
                            currentLineup.libero = p;
                        } else {
                            for (let pos = 1; pos <= 6; pos++) {
                                if (!currentLineup[pos]) {
                                    currentLineup[pos] = p;
                                    break;
                                }
                            }
                        }
                    }
                    updateAllViews();
                };

                container.appendChild(card);
            });
        }

        function renderCourt() {
            const slots = document.querySelectorAll('.court-slot');
            
            slots.forEach(slot => {
                const posNum = parseInt(slot.getAttribute('data-pos'));
                const player = getPlayerAtPosition(posNum, currentRotation);

                slot.innerHTML = '';

                const node = document.createElement('div');
                node.className = `w-full h-full rounded-xl flex flex-col justify-between p-2 relative cursor-pointer border transition-all duration-300 ${
                    player 
                    ? (player.isLiberoSwapped 
                        ? 'bg-emerald-950/80 border-emerald-400/80 text-emerald-100 shadow-lg' 
                        : 'bg-slate-950/85 border-cyan-500/60 text-white shadow-xl hover:scale-[1.02]') 
                    : 'bg-slate-950/30 border-dashed border-white/40 hover:bg-slate-900/50'
                }`;

                if (player) {
                    const posColor = {
                        'S': 'text-amber-400 border-amber-400/50 bg-amber-950/60',
                        'OH': 'text-cyan-400 border-cyan-400/50 bg-cyan-950/60',
                        'OP': 'text-red-400 border-red-400/50 bg-red-950/60',
                        'MB': 'text-blue-400 border-blue-400/50 bg-blue-950/60',
                        'L': 'text-emerald-400 border-emerald-400/50 bg-emerald-950/60'
                    }[player.pos];

                    const avatarSrc = player.realImg || generateCharacterSVG(player);

                    node.innerHTML = `
                        <div class="flex justify-between items-center text-[10px]">
                            <span class="font-display font-black text-slate-400">P${posNum}</span>
                            <span class="font-display font-bold px-1.5 py-0.5 rounded border text-[8px] ${posColor}">
                                ${player.pos} ${player.isLiberoSwapped ? '(L)' : ''}
                            </span>
                        </div>

                        <div class="flex flex-col items-center my-1 text-center">
                            <div class="relative mb-1">
                                <img src="${avatarSrc}" alt="${player.name}" class="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow-md">
                                <span class="absolute -bottom-1 -right-1 bg-slate-950 text-cyan-300 border border-cyan-500/80 text-[8px] font-display font-black px-1 rounded-full">
                                    #${player.num}
                                </span>
                            </div>
                            <span class="text-xs font-bold truncate max-w-[110px] drop-shadow">${player.name}</span>
                        </div>

                        <div class="truncate text-center">
                            <span class="text-[8px] text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 truncate block">
                                ${player.traits[0] || 'Standard Player'}
                            </span>
                        </div>
                    `;
                } else {
                    node.innerHTML = `
                        <div class="flex justify-between text-[10px] text-slate-400 font-display">
                            <span>P${posNum}</span>
                            <span>EMPTY</span>
                        </div>
                        <div class="flex flex-col items-center justify-center my-auto text-slate-500">
                            <i data-lucide="plus-circle" class="w-6 h-6 stroke-1 mb-1"></i>
                            <span class="text-[9px]">Assign Slot</span>
                        </div>
                    `;
                }

                node.onclick = () => openSlotModal(posNum);
                slot.appendChild(node);
            });

            document.getElementById('rotationPhaseBadge').innerText = `R${currentRotation} • P${currentRotation} SERVING`;
            lucide.createIcons();
        }

        function setRotation(rot) {
            currentRotation = rot;
            if (sfxEnabled) playWhistleSound();
            updateAllViews();
        }

        function renderRotationControls() {
            const container = document.getElementById('rotButtonsContainer');
            if (!container) return;
            container.innerHTML = '';
            for (let i = 1; i <= 6; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `w-6 h-6 rounded-md text-[10px] font-display font-bold transition flex items-center justify-center ${
                    currentRotation === i 
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300' 
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`;
                btn.innerText = `R${i}`;
                btn.onclick = () => setRotation(i);
                container.appendChild(btn);
            }
        }

        function openSlotModal(posNum) {
            activeTargetModalSlot = posNum;
            document.getElementById('modalPosBadge').innerText = `P${posNum}`;
            document.getElementById('modalPosTitle').innerText = `Assign Slot P${posNum}`;
            
            const container = document.getElementById('modalPlayerList');
            container.innerHTML = '';

            PLAYER_DATABASE.forEach(p => {
                const item = document.createElement('div');
                item.className = 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer transition';
                const avatarSrc = p.realImg || generateCharacterSVG(p);

                item.innerHTML = `
                    <div class="flex items-center space-x-2.5">
                        <img src="${avatarSrc}" alt="${p.name}" class="w-7 h-7 rounded-full object-cover border border-cyan-400">
                        <div>
                            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>${p.name}</span>
                                <span class="text-[9px] text-cyan-400 font-mono">(${p.pos})</span>
                            </h4>
                            <span class="text-[9px] text-slate-400">#${p.num} • ${p.origin}</span>
                        </div>
                    </div>
                    <span class="text-[8px] bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800">${p.traits[0] || ''}</span>
                `;

                item.onclick = () => {
                    currentLineup[posNum] = p;
                    closeSlotModal();
                    updateAllViews();
                };

                container.appendChild(item);
            });

            document.getElementById('slotModal').classList.remove('hidden');
        }

        function closeSlotModal() {
            document.getElementById('slotModal').classList.add('hidden');
            activeTargetModalSlot = null;
        }

        function clearCurrentSlot() {
            if (activeTargetModalSlot) {
                currentLineup[activeTargetModalSlot] = null;
                closeSlotModal();
                updateAllViews();
            }
        }

        function calculateSynergy() {
            const activePlayers = [];
            for (let p = 1; p <= 6; p++) {
                const player = getPlayerAtPosition(p, currentRotation);
                if (player) activePlayers.push(player);
            }

            if (activePlayers.length === 0) {
                document.getElementById('overallScoreText').innerText = '0';
                document.getElementById('gradeText').innerText = 'UNRANKED';
                document.getElementById('chemBonusText').innerText = '+0%';
                document.getElementById('scoreRing').style.strokeDashoffset = '301.59';
                return { baseScore: 0, chemBonus: 0, finalScore: 0, activePlayers: [] };
            }

            let totalSpike = 0, totalBlock = 0, totalReceive = 0, totalSetting = 0, totalServe = 0, totalStamina = 0, totalMorale = 0;
            activePlayers.forEach(p => {
                totalSpike += (p.spike || 70);
                totalBlock += (p.block || 70);
                totalReceive += (p.receive || 70);
                totalSetting += (p.setting || 70);
                totalServe += (p.serve || 70);
                totalStamina += (p.stamina || 90);
                totalMorale += (p.morale || 85);
            });

            const count = activePlayers.length;
            const avgSpike = Math.round(totalSpike / count);
            const avgBlock = Math.round(totalBlock / count);
            const avgReceive = Math.round(totalReceive / count);
            const avgSetting = Math.round(totalSetting / count);
            const avgServe = Math.round(totalServe / count);
            const avgStamina = Math.round(totalStamina / count);
            const avgMorale = Math.round(totalMorale / count);

            let chemBonus = 0;
            const origins = activePlayers.map(p => p.origin);
            const originCounts = {};
            origins.forEach(o => originCounts[o] = (originCounts[o] || 0) + 1);
            Object.values(originCounts).forEach(c => {
                if (c >= 3) chemBonus += 6;
                if (c >= 5) chemBonus += 10;
            });

            const baseScore = Math.round((avgSpike + avgBlock + avgReceive + avgSetting + avgServe) / 5);
            const finalScore = Math.min(99, Math.round(baseScore * (1 + chemBonus / 100)));

            document.getElementById('overallScoreText').innerText = finalScore;
            
            let grade = 'C';
            if (finalScore >= 95) grade = 'S+ LEGENDARY';
            else if (finalScore >= 90) grade = 'S WORLD CLASS';
            else if (finalScore >= 85) grade = 'A EXCELLENT';
            else if (finalScore >= 78) grade = 'B SOLID';

            document.getElementById('gradeText').innerText = grade;
            document.getElementById('chemBonusText').innerText = `+${chemBonus}%`;

            const circumference = 301.59;
            const offset = circumference - (finalScore / 100) * circumference;
            document.getElementById('scoreRing').style.strokeDashoffset = offset;

            document.getElementById('valAttack').innerText = avgSpike;
            document.getElementById('valDefense').innerText = avgBlock;
            document.getElementById('valReceive').innerText = avgReceive;
            document.getElementById('valStamina').innerText = `${avgStamina}%`;
            document.getElementById('valMorale').innerText = `${avgMorale}%`;

            document.getElementById('barAttack').style.width = `${avgSpike}%`;
            document.getElementById('barDefense').style.width = `${avgBlock}%`;
            document.getElementById('barReceive').style.width = `${avgReceive}%`;
            document.getElementById('barStamina').style.width = `${avgStamina}%`;
            document.getElementById('barMorale').style.width = `${avgMorale}%`;

            return { baseScore, chemBonus, finalScore, activePlayers, avgSpike, avgBlock, avgReceive, avgSetting, avgServe, avgStamina, avgMorale };
        }

        function changeBotDifficulty(level) {
            botDifficulty = level;
            const badge = document.getElementById('botDiffBadge');
            const desc = document.getElementById('botDiffDesc');

            if (level === 'EASY') {
                badge.innerText = 'EASY (NOVICE)';
                badge.className = 'bg-emerald-950 text-emerald-300 text-[9px] px-2 py-0.5 rounded border border-emerald-500/40';
                desc.innerText = 'Facing Interhigh Qualifiers. Basic service and predictable sets. Great for practicing lineup synergies.';
            } else if (level === 'MEDIUM') {
                badge.innerText = 'MEDIUM (SEIJOH / NEKOMA)';
                badge.className = 'bg-amber-950 text-amber-300 text-[9px] px-2 py-0.5 rounded border border-amber-500/40';
                desc.innerText = 'Facing Aoba Johsai / Nekoma High. Tactical setters like Oikawa or Kenma with solid floor defense.';
            } else if (level === 'HARD') {
                badge.innerText = 'HARD (INARIZAKI)';
                badge.className = 'bg-purple-950 text-purple-300 text-[9px] px-2 py-0.5 rounded border border-purple-500/40';
                desc.innerText = 'Facing National Powerhouse Inarizaki High led by Atsumu & Osamu Miya. High serve precision and read blocking.';
            } else if (level === 'PRO') {
                badge.innerText = 'PRO (V-LEAGUE)';
                badge.className = 'bg-red-950 text-red-300 text-[9px] px-2 py-0.5 rounded border border-red-500/40';
                desc.innerText = 'Facing V-League Division 1 Pros. Superb finishers, jump float aces, and relentless block-touch defense.';
            } else if (level === 'WORLD_CLASS') {
                badge.innerText = 'WORLD CLASS (OLYMPIC ALL-STARS)';
                badge.className = 'bg-cyan-950 text-cyan-300 text-[9px] px-2 py-0.5 rounded border border-cyan-500/40';
                desc.innerText = 'Facing World All-Stars (Giannelli, León, Nishida, Ishikawa). Lethal serves, triple read-blocks, and zero margins.';
            }

            if (matchState.active) startAIMatch();
        }

        function getOpponentPreset(level) {
            if (level === 'EASY') {
                return [
                    PLAYER_DATABASE.find(p => p.id === 'hk4') || PLAYER_DATABASE[3],
                    PLAYER_DATABASE.find(p => p.id === 'hk6') || PLAYER_DATABASE[5],
                    PLAYER_DATABASE.find(p => p.id === 'ha3') || PLAYER_DATABASE[11],
                    PLAYER_DATABASE.find(p => p.id === 'hk3') || PLAYER_DATABASE[2],
                    PLAYER_DATABASE.find(p => p.id === 'hk9') || PLAYER_DATABASE[8],
                    PLAYER_DATABASE.find(p => p.id === 'hk8') || PLAYER_DATABASE[7]
                ];
            } else if (level === 'MEDIUM') {
                return [
                    PLAYER_DATABASE.find(p => p.id === 'ha1'),
                    PLAYER_DATABASE.find(p => p.id === 'ha2'),
                    PLAYER_DATABASE.find(p => p.id === 'hn1'),
                    PLAYER_DATABASE.find(p => p.id === 'hn2'),
                    PLAYER_DATABASE.find(p => p.id === 'hn4'),
                    PLAYER_DATABASE.find(p => p.id === 'hn3')
                ];
            } else if (level === 'HARD') {
                return [
                    PLAYER_DATABASE.find(p => p.id === 'hi1'),
                    PLAYER_DATABASE.find(p => p.id === 'hi2'),
                    PLAYER_DATABASE.find(p => p.id === 'hi3'),
                    PLAYER_DATABASE.find(p => p.id === 'hi4'),
                    PLAYER_DATABASE.find(p => p.id === 'hf1'),
                    PLAYER_DATABASE.find(p => p.id === 'hkam2')
                ];
            } else if (level === 'PRO') {
                return [
                    PLAYER_DATABASE.find(p => p.id === 'hit1'),
                    PLAYER_DATABASE.find(p => p.id === 'hs1'),
                    PLAYER_DATABASE.find(p => p.id === 'hkam1'),
                    PLAYER_DATABASE.find(p => p.id === 'hd1'),
                    PLAYER_DATABASE.find(p => p.id === 'hf2'),
                    PLAYER_DATABASE.find(p => p.id === 'hn3')
                ];
            } else { // WORLD_CLASS
                return [
                    PLAYER_DATABASE.find(p => p.id === 'r4'),
                    PLAYER_DATABASE.find(p => p.id === 'r1'),
                    PLAYER_DATABASE.find(p => p.id === 'r6'),
                    PLAYER_DATABASE.find(p => p.id === 'r3'),
                    PLAYER_DATABASE.find(p => p.id === 'r5'),
                    PLAYER_DATABASE.find(p => p.id === 'r2')
                ];
            }
        }

        function startAIMatch() {
            matchState = {
                active: true,
                homeScore: 0,
                awayScore: 0,
                setHome: 0,
                setAway: 0,
                servingTeam: 'HOME',
                homeRotation: 1,
                awayRotation: 1,
                opponentTeam: getOpponentPreset(botDifficulty),
                autoSimTimer: null,
                stats: { kills: 0, blocks: 0, aces: 0, digs: 0, fouls: 0 },
                logs: []
            };

            document.getElementById('scoreHome').innerText = '0';
            document.getElementById('scoreAway').innerText = '0';
            document.getElementById('setsHomeVal').innerText = '0';
            document.getElementById('setsAwayVal').innerText = '0';
            document.getElementById('matchLog').innerHTML = '<p class="text-slate-400 italic">3D Match initiated! Perform multi-exchange rallies with live stamina & counter-traits.</p>';
            
            updateMatchUI();
            playWhistleSound('whistle');
        }

        function setTacticalDirective(dir) {
            activeDirective = dir;
            updateAICoachTip();
        }

        function simulatePoint() {
            if (!matchState.active) startAIMatch();

            const homeStats = calculateSynergy();
            const server = getPlayerAtPosition(1, matchState.homeRotation) || { name: 'Player', serve: 75, stamina: 90, traits: [] };
            const homeSetter = getPlayerAtPosition(3, matchState.homeRotation) || { name: 'Setter', setting: 80, stamina: 90, traits: [] };
            const homeLibero = currentLineup.libero || { name: 'Libero', receive: 85, stamina: 90, traits: [] };

            const awayServer = matchState.opponentTeam[0] || { name: 'Opponent Server', serve: 78, stamina: 90, traits: [] };

            let rallyLog = [];
            let pointWinner = null;
            let traitTriggered = null;

            const isHomeServing = (matchState.servingTeam === 'HOME');
            const servingPlayer = isHomeServing ? server : awayServer;

            rallyLog.push(`<span class="text-amber-400 font-bold">[SERVE]</span> ${servingPlayer.name} takes the service line.`);

            // 1. SERVICE PHASE & FOULS
            let serveOutProb = 0.07;
            let aceProb = 0.11;

            if (servingPlayer.traits.includes('Ace Server') || servingPlayer.traits.includes('Dual Wielder Serve')) {
                if (Math.random() < 0.35) {
                    aceProb += 0.22;
                    traitTriggered = 'ACE SERVER';
                }
            }

            // Stamina impact
            if ((servingPlayer.stamina || 90) < 60) aceProb *= 0.7;

            const serveRoll = Math.random();

            if (serveRoll < serveOutProb) {
                pointWinner = isHomeServing ? 'AWAY' : 'HOME';
                const errorType = Math.random() < 0.5 ? 'hit the net tape' : 'sailed long OUT OF BOUNDS';
                rallyLog.push(`<span class="text-red-400 font-bold">[SERVICE ERROR]</span> ${servingPlayer.name}'s serve ${errorType}! Point to ${pointWinner === 'HOME' ? 'YOU' : 'OPPONENT'}.`);
                matchState.stats.fouls++;
            } 
            else if (serveRoll < (serveOutProb + aceProb)) {
                pointWinner = isHomeServing ? 'HOME' : 'AWAY';
                rallyLog.push(`<span class="text-yellow-400 font-bold">[SERVICE ACE]</span> 🔥 Powerful jump serve by ${servingPlayer.name}! CLEAN SERVICE ACE!`);
                matchState.stats.aces++;
                if (isHomeServing) traitTriggered = 'SERVICE ACE';
            } 
            else {
                // 2. MULTI-EXCHANGE RALLY WITH DIVING DIGS & BLOCK TOUCHES
                rallyLog.push(`<span class="text-emerald-400 font-bold">[RECEIVE]</span> Solid bumper pass! Ball popped high to the setter.`);

                let exchanges = 0;
                let currentAttackerTeam = isHomeServing ? 'AWAY' : 'HOME';

                while (exchanges < 4 && !pointWinner) {
                    exchanges++;
                    const isHomeAttack = (currentAttackerTeam === 'HOME');

                    // Set target hitter based on active tactical directive
                    let hitterPosition = 'OH';
                    let targetHitter = null;

                    if (isHomeAttack) {
                        if (activeDirective === 'FREAK_QUICK') hitterPosition = 'MB';
                        else if (activeDirective === 'ACE_HIGH') hitterPosition = 'OH';
                        else if (activeDirective === 'OPPOSITE_POWER') hitterPosition = 'OP';
                        else if (activeDirective === 'PIPE') hitterPosition = 'PIPE';
                        else if (activeDirective === 'FEINT_DUMP') hitterPosition = 'DUMP';
                        else {
                            const randSet = Math.random();
                            if (randSet < 0.40) hitterPosition = 'OH';
                            else if (randSet < 0.65) hitterPosition = 'OP';
                            else if (randSet < 0.85) hitterPosition = 'MB';
                            else hitterPosition = 'PIPE';
                        }

                        if (hitterPosition === 'MB') targetHitter = getPlayerAtPosition(3, matchState.homeRotation);
                        else if (hitterPosition === 'OP') targetHitter = getPlayerAtPosition(2, matchState.homeRotation);
                        else if (hitterPosition === 'PIPE') targetHitter = getPlayerAtPosition(6, matchState.homeRotation);
                        else if (hitterPosition === 'DUMP') targetHitter = homeSetter;
                        else targetHitter = getPlayerAtPosition(4, matchState.homeRotation);
                    } else {
                        const botRand = Math.random();
                        if (botRand < 0.45) targetHitter = matchState.opponentTeam[2];
                        else if (botRand < 0.75) targetHitter = matchState.opponentTeam[1];
                        else targetHitter = matchState.opponentTeam[3];
                    }

                    if (!targetHitter) targetHitter = isHomeAttack ? getPlayerAtPosition(4, matchState.homeRotation) : matchState.opponentTeam[2];

                    if (hitterPosition === 'DUMP') {
                        rallyLog.push(`<span class="text-purple-400 font-bold">[SETTER DUMP]</span> ${targetHitter.name} feints and dumps the ball over the net!`);
                    } else if (hitterPosition === 'PIPE') {
                        rallyLog.push(`<span class="text-cyan-400 font-bold">[PIPE ATTACK]</span> Back-row sync! ${targetHitter.name} leaps from behind the 3m line!`);
                        if (targetHitter.traits.includes('Back-Row Threat')) traitTriggered = 'PIPE ATTACK';
                    } else {
                        rallyLog.push(`<span class="text-cyan-400 font-bold">[SET]</span> Toss distributed to ${targetHitter.name} (${targetHitter.pos})!`);
                    }

                    // Blocker response
                    const defenderBlocker = isHomeAttack ? matchState.opponentTeam[3] : getPlayerAtPosition(3, matchState.homeRotation);
                    let blockStyle = 'Double Block Wall';

                    if (defenderBlocker && defenderBlocker.traits.includes('Guess Blocker')) {
                        if (Math.random() < 0.40) {
                            blockStyle = 'Guess Block (Tendo Jump)';
                            if (!isHomeAttack) traitTriggered = 'GUESS BLOCK';
                        }
                    } else if (defenderBlocker && defenderBlocker.traits.includes('Read Blocker')) {
                        blockStyle = 'Read Block Wall';
                    }

                    rallyLog.push(`<span class="text-blue-400 font-bold">[BLOCK]</span> ${blockStyle} jumping at the net against ${targetHitter.name}!`);

                    // Counter-trait matrix calculation
                    let attackPower = targetHitter.spike || 80;
                    let blockRating = defenderBlocker ? (defenderBlocker.block || 80) : 75;

                    if (targetHitter.traits.includes('Freak Quick') && defenderBlocker && defenderBlocker.traits.includes('Read Blocker')) {
                        attackPower -= 10;
                    } else if (targetHitter.traits.includes('Freak Quick') && Math.random() < 0.35) {
                        attackPower += 16;
                        if (isHomeAttack) traitTriggered = 'FREAK QUICK';
                    }

                    targetHitter.stamina = Math.max(40, (targetHitter.stamina || 90) - 3);
                    if (defenderBlocker) defenderBlocker.stamina = Math.max(40, (defenderBlocker.stamina || 90) - 2);

                    const outcomeRoll = Math.random();

                    if (outcomeRoll < 0.08) {
                        pointWinner = isHomeAttack ? 'AWAY' : 'HOME';
                        rallyLog.push(`<span class="text-pink-400 font-bold">[NET TOUCH / OUT]</span> ${targetHitter.name}'s spike hit OUT OF BOUNDS!`);
                        matchState.stats.fouls++;
                    } 
                    else if (outcomeRoll < 0.18) {
                        pointWinner = isHomeAttack ? 'HOME' : 'AWAY';
                        rallyLog.push(`<span class="text-amber-400 font-bold">[BLOCK-OUT]</span> ${targetHitter.name} deliberately wiped off the block hands! Rebounds out!`);
                        if (isHomeAttack) matchState.stats.kills++;
                    } 
                    else if (outcomeRoll < 0.38) {
                        pointWinner = isHomeAttack ? 'AWAY' : 'HOME';
                        rallyLog.push(`<span class="text-blue-400 font-bold">[STUFF BLOCK]</span> SHUT DOWN! ${defenderBlocker ? defenderBlocker.name : 'Blocker'} roofed the spike down onto the court floor!`);
                        if (!isHomeAttack) matchState.stats.blocks++;
                    } 
                    else if (outcomeRoll < 0.65) {
                        pointWinner = isHomeAttack ? 'HOME' : 'AWAY';
                        rallyLog.push(`<span class="text-red-400 font-bold">[KILL]</span> 💥 Smashed past defense! Floor bounce! Point to ${pointWinner === 'HOME' ? 'YOU' : 'OPPONENT'}.`);
                        if (isHomeAttack) matchState.stats.kills++;
                    } 
                    else {
                        const defenderLibero = isHomeAttack ? matchState.opponentTeam[5] : homeLibero;
                        rallyLog.push(`<span class="text-emerald-400 font-bold">[DIVING DIG]</span> 🤸 ${defenderLibero.name} dives across the floor with a pancake save! Transitioning counter-attack!`);
                        if (!isHomeAttack) matchState.stats.digs++;

                        currentAttackerTeam = isHomeAttack ? 'AWAY' : 'HOME';
                    }
                }

                if (!pointWinner) {
                    pointWinner = 'HOME';
                    rallyLog.push(`<span class="text-cyan-400 font-bold">[RALLY END]</span> Long 4-exchange technical rally won by your squad!`);
                    matchState.stats.kills++;
                }
            }

            // Side-Out and Official Volleyball Rotation Rule
            if (pointWinner === 'HOME') {
                matchState.homeScore++;
                if (matchState.servingTeam === 'AWAY') {
                    matchState.servingTeam = 'HOME';
                    matchState.homeRotation = (matchState.homeRotation % 6) + 1;
                    rallyLog.push(`<span class="text-cyan-400 font-bold">[SIDE-OUT & ROTATION]</span> Point won on opponent serve! You gain service and rotate to Rotation R${matchState.homeRotation}.`);
                }
            } else {
                matchState.awayScore++;
                if (matchState.servingTeam === 'HOME') {
                    matchState.servingTeam = 'AWAY';
                    matchState.awayRotation = (matchState.awayRotation % 6) + 1;
                    rallyLog.push(`<span class="text-purple-400 font-bold">[SIDE-OUT]</span> Opponent wins side-out and rotates to R${matchState.awayRotation}.`);
                }
            }

            // Set Winner Detection (First to 25, win by 2)
            if (matchState.homeScore >= 25 && (matchState.homeScore - matchState.awayScore) >= 2) {
                matchState.setHome++;
                rallyLog.push(`🏆 <strong class="text-amber-400">YOU WON SET ${matchState.setHome + matchState.setAway}!</strong>`);
                matchState.homeScore = 0;
                matchState.awayScore = 0;
            } else if (matchState.awayScore >= 25 && (matchState.awayScore - matchState.homeScore) >= 2) {
                matchState.setAway++;
                rallyLog.push(`⚠ <strong class="text-purple-400">OPPONENT WON SET ${matchState.setHome + matchState.setAway}!</strong>`);
                matchState.homeScore = 0;
                matchState.awayScore = 0;
            }

            // Sync score & match state to Firestore if in live online session
            if (db && activeRoomCode && currentUser) {
                try {
                    const roomRef = window.FB.doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
                    window.FB.updateDoc(roomRef, {
                        lastMatchState: matchState,
                        lastUpdatedBy: currentUser.uid,
                        updatedAt: Date.now()
                    });
                } catch(e) {}
            }

            playWhistleSound('spike');
            logRallyEntry(rallyLog.join('<br>'), traitTriggered);
            updateMatchUI();
            trigger3DRallyAnimation(pointWinner);
        }

        function logRallyEntry(htmlContent, trait) {
            matchState.logs.unshift(htmlContent);
            const logBox = document.getElementById('matchLog');
            
            const entry = document.createElement('div');
            entry.className = 'p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed space-y-1 rally-entry';
            entry.innerHTML = htmlContent;
            logBox.prepend(entry);

            document.getElementById('commentaryCount').innerText = `${matchState.logs.length} Rallies Logged`;

            if (trait) {
                const banner = document.getElementById('traitBannerOverlay');
                document.getElementById('traitBannerText').innerText = `${trait} ACTIVATED!`;
                banner.classList.remove('opacity-0', '-translate-y-4');
                setTimeout(() => banner.classList.add('opacity-0', '-translate-y-4'), 2200);
            }
        }

        function updateMatchUI() {
            document.getElementById('scoreHome').innerText = matchState.homeScore;
            document.getElementById('scoreAway').innerText = matchState.awayScore;
            document.getElementById('setsHomeVal').innerText = matchState.setHome;
            document.getElementById('setsAwayVal').innerText = matchState.setAway;

            document.getElementById('homeRotationBadge').innerText = `R${matchState.homeRotation}`;
            document.getElementById('awayRotationBadge').innerText = `R${matchState.awayRotation}`;

            const servingText = (matchState.servingTeam === 'HOME') ? 'YOU SERVING' : 'OPPONENT SERVING';
            document.getElementById('servingText').innerText = servingText;

            const homeSyn = calculateSynergy().finalScore || 85;
            document.getElementById('homeSynergyText').innerText = homeSyn;

            document.getElementById('statKills').innerText = matchState.stats.kills;
            document.getElementById('statBlocks').innerText = matchState.stats.blocks;
            document.getElementById('statAces').innerText = matchState.stats.aces;
            document.getElementById('statDigs').innerText = matchState.stats.digs;
            document.getElementById('statFouls').innerText = matchState.stats.fouls;

            const totalScore = Math.max(1, matchState.homeScore + matchState.awayScore);
            const homePct = Math.round((matchState.homeScore / totalScore) * 100) || 50;
            document.getElementById('momentumHome').style.width = `${homePct}%`;
            document.getElementById('momentumAway').style.width = `${100 - homePct}%`;
            document.getElementById('momentumHomeVal').innerText = `${homePct}% You`;
            document.getElementById('momentumAwayVal').innerText = `${100 - homePct}% Opponent`;

            updateAICoachTip();
        }

        function updateAICoachTip() {
            const tipBox = document.getElementById('aiCoachAdviceBox');
            let advice = "";

            if (matchState.servingTeam === 'AWAY') {
                advice = `🛡️ <strong>Side-Out Target:</strong> Opponent is serving. Focus set on your primary Outside Hitter to win side-out and rotate to R${(matchState.homeRotation % 6) + 1}!`;
            } else if (activeDirective === 'FREAK_QUICK') {
                advice = `⚡ <strong>Quick Tempo Focus:</strong> Targeting Middle Blocker quicks. Effective against slow read-blockers!`;
            } else {
                advice = `✨ <strong>Rotation R${matchState.homeRotation}:</strong> Balanced option distribution active across OH, OP, MB, and Pipe attack.`;
            }

            tipBox.innerHTML = `<p class="text-slate-200 text-xs">${advice}</p>`;
        }

        function toggleAutoMatch() {
            const btnText = document.getElementById('autoSimText');
            if (matchState.autoSimTimer) {
                clearInterval(matchState.autoSimTimer);
                matchState.autoSimTimer = null;
                btnText.innerText = 'Auto Play';
            } else {
                btnText.innerText = 'Pause Auto';
                matchState.autoSimTimer = setInterval(() => {
                    simulatePoint();
                }, 2400);
            }
        }

        function resetMatch() {
            if (matchState.autoSimTimer) clearInterval(matchState.autoSimTimer);
            startAIMatch();
        }

        function openMultiplayerModal() {
            document.getElementById('multiplayerModal').classList.remove('hidden');
        }

        function closeMultiplayerModal() {
            document.getElementById('multiplayerModal').classList.add('hidden');
        }

        function setRosterFilter(filterKey) {
            selectedFilter = filterKey;
            renderRoster();
        }

        function filterRoster() {
            renderRoster();
        }

        function changeFormation(val) {
            currentFormation = val;
            updateAllViews();
        }

        function toggleLiberoSwap() {
            isLiberoSwapEnabled = !isLiberoSwapEnabled;
            updateAllViews();
        }

        function openCustomPlayerModal() {
            document.getElementById('customPlayerModal').classList.remove('hidden');
        }

        function closeCustomPlayerModal() {
            document.getElementById('customPlayerModal').classList.add('hidden');
        }

        function handleCreatePlayer(e) {
            e.preventDefault();
            const name = document.getElementById('cpName').value.trim();
            const num = parseInt(document.getElementById('cpNumber').value) || 7;
            const pos = document.getElementById('cpPosition').value;
            const origin = document.getElementById('cpTeam').value.trim() || 'Custom';
            const spike = parseInt(document.getElementById('cpSpike').value);
            const block = parseInt(document.getElementById('cpBlock').value);
            const receive = parseInt(document.getElementById('cpReceive').value);
            const setting = parseInt(document.getElementById('cpSetting').value);
            const stamina = parseInt(document.getElementById('cpStamina').value);
            const morale = parseInt(document.getElementById('cpMorale').value);
            const weakness = document.getElementById('cpWeakness').value;

            PLAYER_DATABASE.unshift({
                id: 'custom_' + Date.now(),
                name, pos, origin, num, spike, block, receive, setting, serve: 80,
                stamina, morale, weakness,
                traits: ['Custom Specialist']
            });

            closeCustomPlayerModal();
            updateAllViews();
            showToast(`Custom Player "${name}" added to roster!`);
        }

        function updateAllViews() {
            renderRoster();
            renderCourt();
            renderRotationControls();
            calculateSynergy();
        }

        window.onFirebaseLoaded = function() {
            initFirebaseMultiplayer();
        };

        window.onload = function() {
            lucide.createIcons();
            updateAllViews();

            if (window.FB) {
                initFirebaseMultiplayer();
            }

            // Auto-detect multiplayer room from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const roomCode = urlParams.get('room');
            if (roomCode) {
                openMultiplayerModal();
                document.getElementById('joinRoomInput').value = roomCode;
                joinOnlineRoom(roomCode);
            }
        };

// --- SOCKET.IO MULTIPLAYER OVERRIDE ---
window.socket = io();

window.hostOnlineRoom = async function() {
    activeRoomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    isHost = true;
    window.socket.emit('join-room', activeRoomCode);
    
<<<<<<< HEAD
    document.getElementById('activeRoomCode').innerText = activeRoomCode;
=======
    document.getElementById('hostCodeDisplay').innerText = activeRoomCode;
>>>>>>> ebacfca (Initial commit of multiplayer server)
    document.getElementById('activeRoomBox').classList.remove('hidden');
    showToast(`Room Hosted: ${activeRoomCode}`);
}

window.joinOnlineRoom = async function(codeOverride) {
    const code = codeOverride || document.getElementById('joinRoomInput').value.trim().toUpperCase();
    if (!code) return showToast("Enter a room code!", true);
    
    activeRoomCode = code;
    isHost = false;
    window.socket.emit('join-room', activeRoomCode);
    
<<<<<<< HEAD
    document.getElementById('activeRoomCode').innerText = activeRoomCode;
=======
    document.getElementById('hostCodeDisplay').innerText = activeRoomCode;
>>>>>>> ebacfca (Initial commit of multiplayer server)
    document.getElementById('activeRoomBox').classList.remove('hidden');
    showToast(`Joined Room: ${activeRoomCode}`);
}

window.socket.on('room-update', (data) => {
    showToast(data.message);
});

window.socket.on('rally-result', (data) => {
    const homeWins = data.winner === 'HOME';
    trigger3DRallyAnimation(homeWins ? 'home' : 'away');
    
    matchState.scoreHome = data.matchState.scoreHome;
    matchState.scoreAway = data.matchState.scoreAway;
    updateMatchUI();
});

window.simulatePoint = function() {
    if (!activeRoomCode) {
        showToast("You must join or host a room first for multiplayer!", true);
        return;
    }
    window.socket.emit('play-rally', { roomCode: activeRoomCode });
}
