const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const loopBtn = document.getElementById('loop');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const bgEffects = document.getElementById('bg-effects');
const volumeSlider = document.getElementById('volume');
const playlistContainer = document.getElementById('playlist');

// Дополнительные элементы для кастомной загрузки и плейлистов
const fileUpload = document.getElementById('file-upload');
const playlistNameInput = document.getElementById('playlist-name');
const addPlaylistBtn = document.getElementById('add-playlist-btn');
const playlistsListEl = document.getElementById('playlists-list');
const currentPlaylistTitle = document.getElementById('current-playlist-title');

// Базовые 15 треков
let songs = [
    { title: 'its going down now', artist: 'Исполнитель 1', src: 'song1.mp3', cover: 'photo4.jpg', playlists: [] },
    { title: 'blind', artist: 'Исполнитель 2', src: 'song2.mp3', cover: 'photo2.jpg', playlists: [] },
    { title: 'MELLSTROYFUNK', artist: 'Soullyx', src: 'MELLSTROYFUNK.wav', cover: 'photo3.jpg', playlists: [] },
    { title: 'BURMALDAFUNK', artist: 'Soullyx', src: 'BURMALDAFUNK.mp3', cover: 'photo5.jpg', playlists: [] },
    { title: 'HAMMAMFUNK', artist: 'Soullyx', src: 'HAMMAMFUNK.mp3', cover: 'photo1.jpg', playlists: [] },
    { title: 'Песня 6', artist: 'Soullyx', src: 'audio/song6.mp3', cover: 'photo6.jpg', playlists: [] },
    { title: 'Песня 7', artist: 'Soullyx', src: 'audio/song7.mp3', cover: 'photo7.jpg', playlists: [] },
    { title: 'Песня 8', artist: 'Soullyx', src: 'audio/song8.mp3', cover: 'photo8.jpg', playlists: [] },
    { title: 'Песня 9', artist: 'Soullyx', src: 'audio/song9.mp3', cover: 'photo9.jpg', playlists: [] },
    { title: 'Песня 10', artist: 'Soullyx', src: 'audio/song10.mp3', cover: 'photo10.jpg', playlists: [] },
    { title: 'Песня 11', artist: 'Soullyx', src: 'audio/song11.mp3', cover: 'photo11.jpg', playlists: [] },
    { title: 'Песня 12', artist: 'Soullyx', src: 'audio/song12.mp3', cover: 'photo12.jpg', playlists: [] },
    { title: 'Песня 13', artist: 'Soullyx', src: 'audio/song13.mp3', cover: 'photo13.jpg', playlists: [] },
    { title: 'Песня 14', artist: 'Soullyx', src: 'audio/song14.mp3', cover: 'photo14.jpg', playlists: [] },
    { title: 'Песня 15', artist: 'Soullyx', src: 'audio/song15.mp3', cover: 'photo15.jpg', playlists: [] }
];

// Массив созданных пользователем плейлистов
let customPlaylists = [];
let currentFilter = 'all'; // Текущий выбранный плейлист ('all' или название кастомного)

let songIndex = 0;
let isLooping = false;

// Получить список треков, подходящих под выбранный плейлист
function getFilteredSongs() {
    if (currentFilter === 'all') return songs;
    return songs.filter(song => song.playlists && song.playlists.includes(currentFilter));
}

// Построение списка песен на экране справа
function buildPlaylist() {
    playlistContainer.innerHTML = '';
    const filtered = getFilteredSongs();
    
    if(filtered.length === 0) {
        playlistContainer.innerHTML = '<li style="color:#666; cursor:default;">Плейлист пуст</li>';
        return;
    }

    filtered.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.artist} — ${song.title}`;
        
        // Клик запускает песню
        li.addEventListener('click', () => {
            // Находим индекс этой песни в общем массиве songs
            songIndex = songs.indexOf(song);
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistContainer.appendChild(li);
    });
    updateActivePlaylistInfo();
}

// Подсветка играющего трека
function updateActivePlaylistInfo() {
    const filtered = getFilteredSongs();
    const currentSong = songs[songIndex];
    const listItems = playlistContainer.querySelectorAll('li');
    
    listItems.forEach((li, index) => {
        if (filtered[index] === currentSong) {
            li.classList.add('active-song');
        } else {
            li.classList.remove('active-song');
        }
    });
}

// Загрузка деталей песни
function loadSong(song) {
    if(!song) return;
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    cover.src = song.cover || 'https://placeholder.com';
    updateActivePlaylistInfo();
}

// Воспроизведение и Пауза
function playSong() {
    playBtn.innerText = '⏸';
    if (bgEffects) bgEffects.classList.add('playing');
    audio.play().catch(err => console.log("Файл подгружается или отсутствует тип медиа."));
}

function pauseSong() {
    playBtn.innerText = '▶';
    if (bgEffects) bgEffects.classList.remove('playing');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    const isPlaying = playBtn.innerText === '⏸';
    if (isPlaying) { pauseSong(); } else { playSong(); }
});

// Навигация (переключение идет внутри текущего отфильтрованного списка)
function prevSong() {
    const filtered = getFilteredSongs();
    if(filtered.length === 0) return;
    
    let currentFilteredIndex = filtered.indexOf(songs[songIndex]);
    currentFilteredIndex--;
    if (currentFilteredIndex < 0) currentFilteredIndex = filtered.length - 1;
    
    songIndex = songs.indexOf(filtered[currentFilteredIndex]);
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    const filtered = getFilteredSongs();
    if(filtered.length === 0) return;

    let currentFilteredIndex = filtered.indexOf(songs[songIndex]);
    currentFilteredIndex++;
    if (currentFilteredIndex > filtered.length - 1) currentFilteredIndex = 0;
    
    songIndex = songs.indexOf(filtered[currentFilteredIndex]);
    loadSong(songs[songIndex]);
    playSong();
}

// Обновление прогресс-бара
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (!duration) return;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) currentSec = `0${currentSec}`;
    currentTimeEl.innerText = `${currentMin}:${currentSec}`;

    let durationMin = Math.floor(duration / 60);
    let durationSec = Math.floor(duration % 60);
    if (durationSec < 10) durationSec = `0${durationSec}`;
    durationEl.innerText = `${durationMin}:${durationSec}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) audio.currentTime = (clickX / width) * duration;
}

// ФУНКЦИОНАЛ ЗАГРУЗКИ СВОИХ ТРЕКОВ
fileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Создаем временный URL-адрес для файла с компьютера
        const fileURL = URL.createObjectURL(file);
        
        // Отделяем расширение от имени для названия трека
        const cleanName = file.name.replace(/\.[^/.]+$/, "");

        const newSong = {
            title: cleanName,
            artist: 'Локальный трек',
            src: fileURL,
            cover: 'https://placeholder.com', // Заглушка для обложки
            playlists: currentFilter !== 'all' ? [currentFilter] : [] // Если открыт плейлист, сразу добавляем туда
        };
        
        songs.push(newSong);
    }
    buildPlaylist();
    // Если плеер сейчас не играет, загружаем первый добавленный трек
    if (audio.paused && songs.length === files.length) {
        loadSong(songs[songIndex]);
    }
});

// ФУНКЦИОНАЛ СОЗДАНИЯ ПЛЕЙЛИСТОВ
addPlaylistBtn.addEventListener('click', () => {
    const name = playlistNameInput.value.trim();
    if (!name || customPlaylists.includes(name)) return;

    customPlaylists.push(name);
    playlistNameInput.value = '';
    renderPlaylistsMenu();
});

function renderPlaylistsMenu() {
    // Очищаем, оставляя только базовый пункт
    playlistsListEl.innerHTML = `<li class="${currentFilter === 'all' ? 'active-playlist' : ''}" data-type="all">Все треки</li>`;
    
    customPlaylists.forEach(plName => {
        const li = document.createElement('li');
        li.innerText = `📁 ${plName}`;
        if(currentFilter === plName) li.classList.add('active-playlist');
        
        li.addEventListener('click', () => {
            currentFilter = plName;
            currentPlaylistTitle.innerText = plName;
            document.querySelectorAll('#playlists-list li').forEach(el => el.classList.remove('active-playlist'));
            li.classList.add('active-playlist');
            buildPlaylist();
        });
        
        // Возможность закинуть текущий играющий трек в этот плейлист правым кликом мышкой
        li.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const currentSong = songs[songIndex];
            if(!currentSong.playlists.includes(plName)) {
                currentSong.playlists.push(plName);
                alert(`Трек "${currentSong.title}" добавлен в плейлист "${plName}"`);
                buildPlaylist();
            }
        });

        playlistsListEl.appendChild(li);
    });

    // Обработчик для кнопки "Все треки"
    playlistsListEl.querySelector('[data-type="all"]').addEventListener('click', (e) => {currentFilter = 'all';currentPlaylistTitle.innerText = 'Все треки';document.querySelectorAll('#playlists-list li').forEach(el => el.classList.remove('active-playlist'));e.target.classList.add('active-playlist');buildPlaylist();});}
    
    volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });loopBtn.addEventListener('click', () => { isLooping = !isLooping; loopBtn.classList.toggle('active', isLooping); });prevBtn.addEventListener('click', prevSong);nextBtn.addEventListener('click', nextSong);audio.addEventListener('timeupdate', updateProgress);progressContainer.addEventListener('click', setProgress);audio.addEventListener('ended', () => { if (isLooping) { audio.currentTime = 0; playSong(); } else { nextSong(); } });
    
    renderPlaylistsMenu();buildPlaylist();audio.volume = volumeSlider.value;loadSong(songs[songIndex]);