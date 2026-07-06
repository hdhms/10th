// Configuration
const CONFIG = {
    SPREADSHEET_ID: '1lSXWtgNW6tttziaQ9GYgRVRotO1Xpha-RvFS27hQu_E',
    VOTING_FORM_URL: 'https://forms.gle/YOUR_VOTING_FORM_ID', // Update with your Google Form
    STORAGE_KEY: 'hms_messages'
};

// State
let photos = [];
let currentCategory = 'all';
let messages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
    setupCategoryTabs();
    setupModalListeners();
    setupMessageForm();
    loadMessages();
    setupVotingSection();
});

// Extract file ID from various Google Drive URL formats
function extractFileId(url) {
    if (!url) return null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    if (url.includes('/d/')) {
        return url.split('/d/')[1].split('/')[0];
    }
    // Format: https://drive.google.com/open?id=FILE_ID
    if (url.includes('id=')) {
        return url.split('id=')[1].split('&')[0];
    }
    return null;
}

// Convert Google Drive link to direct image URL
function getGoogleDriveImageUrl(driveUrl) {
    const fileId = extractFileId(driveUrl);
    if (fileId) {
        return `https://drive.google.com/uc?id=${fileId}&export=view`;
    }
    return driveUrl;
}

// Load photos from Google Sheets
async function loadPhotos() {
    try {
        const url = `https://opensheet.elk.sh/${CONFIG.SPREADSHEET_ID}/Sheet1`;
        const response = await fetch(url);
        const data = await response.json();
        
        photos = data.map(row => {
            const driveLink = row['구글드라이브링크'] || '';
            return {
                id: row['고유ID'] || Math.random().toString(36).substr(2, 9),
                category: row['카테고리'] || '',
                title: row['작품제목'] || '',
                photographer: row['이름'] || '',
                department: row['부서'] || '',
                shotDate: row['촬영시기'] || '',
                location: row['촬영장소'] || '',
                description: row['한줄소개'] || '',
                imageUrl: getGoogleDriveImageUrl(driveLink),
                votes: parseInt(row['투표수']) || 0
            };
        }).filter(photo => photo.imageUrl && photo.imageUrl.trim()); // Only include photos with valid URLs
        
        console.log('Loaded photos:', photos.length);
        console.log('Photos data:', photos);
        document.getElementById('loading').style.display = 'none';
        renderGallery();
    } catch (error) {
        console.error('Error loading photos:', error);
        document.getElementById('loading').innerHTML = 
            '<p>❌ 사진을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>';
    }
}

// Render gallery
function renderGallery() {
    const gallery = document.getElementById('gallery-grid');
    gallery.innerHTML = '';
    
    const filtered = currentCategory === 'all' 
        ? photos 
        : photos.filter(p => p.category === currentCategory);
    
    if (filtered.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">이 카테고리에는 사진이 없습니다.</p>';
        return;
    }
    
    filtered.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3E이미지를 불러올 수 없습니다%3C/text%3E%3C/svg%3E'\">\n            <div class="photo-info">\n                <span class="photo-category">${photo.category}</span>\n                <h3 class="photo-title">${photo.title}</h3>\n                <div class="photo-details">\n                    <span class="photo-detail-label">작가:</span> ${photo.photographer}\n                </div>\n                <div class="photo-details">\n                    <span class="photo-detail-label">부서:</span> ${photo.department}\n                </div>\n                <div class="photo-details">\n                    <span class="photo-detail-label">촬영:</span> ${photo.shotDate} / ${photo.location}\n                </div>\n                <div class="photo-description">${photo.description}</div>\n                <div class="photo-votes">\n                    <span class="vote-count">❤️ ${photo.votes}</span>\n                </div>\n            </div>\n        `;
        
        card.addEventListener('click', () => {
            openModal(photo.imageUrl, `\n                <strong>${photo.title}</strong><br>\n                작가: ${photo.photographer} (${photo.department})<br>\n                촬영: ${photo.shotDate} / ${photo.location}<br>\n                \"${photo.description}\"\n            `);
        });
        
        gallery.appendChild(card);
    });
}

// Category tabs
function setupCategoryTabs() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            renderGallery();
            document.getElementById('gallery-grid').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Modal
function setupModalListeners() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    
    modal.classList.add('show');
    modalImg.src = imageSrc;
    captionText.innerHTML = caption;
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
}

// Messages
function setupMessageForm() {
    const form = document.getElementById('messageForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('messageName').value.trim();
        const dept = document.getElementById('messageDept').value.trim();
        const text = document.getElementById('messageText').value.trim();
        
        if (!name || !text) {
            alert('이름과 메시지를 입력해주세요.');
            return;
        }
        
        const message = {
            id: Date.now(),
            name,
            dept,
            text,
            timestamp: new Date().toLocaleString('ko-KR')
        };
        
        messages.unshift(message);
        saveMessages();
        renderMessages();
        form.reset();
        
        alert('메시지가 저장되었습니다. 감사합니다! 🙏');
    });
}

function saveMessages() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(messages.slice(0, 100))); // Keep last 100
}

function loadMessages() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    messages = saved ? JSON.parse(saved) : [];
    renderMessages();
}

function renderMessages() {
    const container = document.getElementById('messages-container');
    
    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">아직 응원 메시지가 없습니다. 첫 번째 메시지를 남겨주세요! 💌</p>';
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div>
                <span class="message-author">${msg.name}</span>
                ${msg.dept ? `<span class="message-dept">${msg.dept}</span>` : ''}
                <span class="message-time">${msg.timestamp}</span>
            </div>
            <div class="message-text">${msg.text.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// Voting Section
function setupVotingSection() {
    // Generate QR code using qr-server.com
    const votingUrl = CONFIG.VOTING_FORM_URL;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(votingUrl)}`;
    
    document.getElementById('votingQR').src = qrUrl;
    document.getElementById('votingLink').href = votingUrl;
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add to window for debugging
window.appDebug = {
    photos: () => console.log(photos),
    messages: () => console.log(messages),
    config: () => console.log(CONFIG)
};
