let currentNoteId = null;
let notes = [];

// 載入筆記
async function loadNotes() {
  const search = document.getElementById('search').value;
  const tag = document.getElementById('tag-filter').value;
  const sort = document.getElementById('sort').value;

  const res = await fetch(`/notebook/notes?search=${encodeURIComponent(search)}&tag=${tag}&sort=${sort}`);
  notes = await res.json();
  renderNotes();
}

// 渲染筆記卡片
function renderNotes() {
  const grid = document.getElementById('notes-grid');
  grid.innerHTML = notes.map(note => `
    <div class="note-card ${note.is_pinned ? 'pinned' : ''}" style="border-left: 4px solid ${note.color || '#ddd'}">
      <div class="note-header">
        <h3>${escapeHtml(note.title)}</h3>
        <button class="pin-btn" data-id="${note.id}">${note.is_pinned ? 'Unpin' : 'Pin'}</button>
      </div>
      <div class="note-preview">${marked.parse(note.content || '').replace(/<[^>]*>/g, '').slice(0, 100)}...</div>
      <div class="note-tags">
        ${note.tags.map((tag, i) => `<span class="tag" style="background:${note.tag_colors[i]}">${tag}</span>`).join('')}
      </div>
      <div class="note-actions">
        <button onclick="editNote(${note.id})">編輯</button>
        <button onclick="shareNote(${note.id})">分享</button>
        <button class="delete" onclick="deleteNote(${note.id})">刪除</button>
      </div>
      <small>${new Date(note.updated_at).toLocaleString()}</small>
    </div>
  `).join('');
}

// 編輯筆記
async function editNote(id) {
  const note = notes.find(n => n.id === id) || { title: '', content: '', tags: [] };
  currentNoteId = id;
  document.getElementById('note-title').value = note.title || '';
  document.getElementById('note-content').value = note.content || '';
  document.getElementById('share-note').style.display = id ? 'inline-block' : 'none';
  renderTags(note.tags || []);
  showTab('write');
  document.getElementById('editor-modal').classList.add('show');
}

// 儲存
document.getElementById('save-note').onclick = async () => {
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value;
  const tags = Array.from(document.querySelectorAll('#tag-list .tag')).map(t => t.textContent);

  if (!title) return alert('請輸入標題');

  const url = currentNoteId ? `/notebook/edit/${currentNoteId}` : '/notebook/add';
  const method = currentNoteId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tags })
  });

  closeModal();
  loadNotes();
};

// 標籤輸入
document.getElementById('tag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    addTag(e.target.value.trim());
    e.target.value = '';
  }
});

function addTag(name) {
  const list = document.getElementById('tag-list');
  if (!list.querySelector(`.tag:contains(${name})`)) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = name;
    span.onclick = () => span.remove();
    list.appendChild(span);
  }
}

function renderTags(tags) {
  const list = document.getElementById('tag-list');
  list.innerHTML = tags.map(t => `<span class="tag" onclick="this.remove()">${t}</span>`).join('');
}

// 分享
async function shareNote(id) {
  const res = await fetch(`/notebook/share/${id}`, { method: 'POST' });
  const data = await res.json();
  if (data.success) {
    prompt('分享連結（24小時有效）：', data.url);
  }
}

// 置頂 / 刪除
async function togglePin(id) {
  await fetch(`/notebook/pin/${id}`, { method: 'POST' });
  loadNotes();
}

async function deleteNote(id) {
  if (confirm('確定刪除？')) {
    await fetch(`/notebook/delete/${id}`, { method: 'DELETE' });
    loadNotes();
  }
}

// Markdown 預覽
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showTab(tab.dataset.tab);
  };
});

function showTab(tab) {
  const content = document.getElementById('note-content').value;
  document.getElementById('preview').innerHTML = marked.parse(content);
  document.getElementById('note-content').style.display = tab === 'write' ? 'block' : 'none';
  document.getElementById('preview').style.display = tab === 'preview' ? 'block' : 'none';
}

// 初始化
document.getElementById('new-note').onclick = () => editNote(null);
document.getElementById('cancel-edit').onclick = closeModal;
document.getElementById('search').oninput = debounce(loadNotes, 300);
document.getElementById('tag-filter').onchange = loadNotes;
document.getElementById('sort').onchange = loadNotes;

function closeModal() {
  document.getElementById('editor-modal').classList.remove('show');
  currentNoteId = null;
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 綁定事件
document.addEventListener('click', e => {
  if (e.target.classList.contains('pin-btn')) {
    togglePin(e.target.dataset.id);
  }
});

// 載入
loadNotes();