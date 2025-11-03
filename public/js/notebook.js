let currentNoteId = null;
let notes = [];

// 載入筆記
async function loadNotes() {
  const search = document.getElementById('search').value;
  const tag = document.getElementById('tag-filter').value;
  const sort = document.getElementById('sort').value;

  try {
    const res = await fetch(`/notebook/notes?search=${encodeURIComponent(search)}&tag=${tag}&sort=${sort}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notes = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('載入筆記失敗:', err);
    notes = [];
  }
  renderNotes();
}

// 渲染筆記卡片
function renderNotes() {
  const grid = document.getElementById('notes-grid');
  grid.innerHTML = notes.map(note => {
    const tags = Array.isArray(note.tags) ? note.tags : [];
    const tagColors = Array.isArray(note.tag_colors) ? note.tag_colors : [];
    return `
      <div class="note-card ${note.is_pinned ? 'pinned' : ''}" style="border-left: 4px solid ${note.color || '#ddd'}">
        <div class="note-header">
          <h3>${escapeHtml(note.title || '無標題')}</h3>
          <button class="pin-btn" data-id="${note.id}">${note.is_pinned ? 'Unpin' : 'Pin'}</button>
        </div>
        <div class="note-preview">
          ${(note.content || '').length > 0
        ? `<div class="note-preview-md">${marked.parse(note.content)}</div>`
        : '<em>無內容</em>'}
        </div>
        <div class="note-tags">
          ${tags.map((tag, i) => `<span class="tag" style="background:${tagColors[i] || '#999'}">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="note-actions">
          <button onclick="viewNote(${note.id})" style="background:#8b5cf6;color:white;">查看</button>
          <button onclick="editNote(${note.id})">編輯</button>
          <button onclick="shareNote(${note.id})">分享</button>
          <button class="delete" onclick="deleteNote(${note.id})">刪除</button>
        </div>
        <small>${new Date(note.updated_at).toLocaleString()}</small>
      </div>
    `;
  }).join('');
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
  const tags = Array.from(document.querySelectorAll('#tag-list .tag')).map(t => t.textContent.trim()).filter(t => t);

  if (!title) return alert('請輸入標題');

  const url = currentNoteId ? `/notebook/edit/${currentNoteId}` : '/notebook/add';
  const method = currentNoteId ? 'PUT' : 'POST';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags })
    });
    closeModal();
    loadNotes();
  } catch (err) {
    alert('儲存失敗，請稍後再試');
  }
};

// 標籤
document.getElementById('tag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    addTag(e.target.value.trim());
    e.target.value = '';
  }
});

function addTag(name) {
  const list = document.getElementById('tag-list');
  const exists = Array.from(list.querySelectorAll('.tag')).some(span => span.textContent === name);
  if (!exists && name) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = name;
    span.onclick = () => span.remove();
    list.appendChild(span);
  }
}

function renderTags(tags) {
  const list = document.getElementById('tag-list');
  list.innerHTML = (Array.isArray(tags) ? tags : []).map(t =>
    `<span class="tag" onclick="this.remove()">${escapeHtml(t)}</span>`
  ).join('');
}

// 分享
async function shareNote(id) {
  try {
    const res = await fetch(`/notebook/share/${id}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      prompt('分享連結（24小時有效）：', data.url);
    } else {
      alert('分享失敗');
    }
  } catch (err) {
    alert('分享失敗');
  }
}

// 置頂 / 刪除
async function togglePin(id) {
  try {
    await fetch(`/notebook/pin/${id}`, { method: 'POST' });
    loadNotes();
  } catch (err) {
    alert('操作失敗');
  }
}

async function deleteNote(id) {
  if (confirm('確定刪除？')) {
    try {
      await fetch(`/notebook/delete/${id}`, { method: 'DELETE' });
      loadNotes();
    } catch (err) {
      alert('刪除失敗');
    }
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
  const preview = document.getElementById('preview');
  if (typeof marked === 'function') {
    preview.innerHTML = marked.parse(content);
  } else {
    preview.innerHTML = '<em>Markdown 載入中...</em>';
  }
  document.getElementById('note-content').style.display = tab === 'write' ? 'block' : 'none';
  preview.style.display = tab === 'preview' ? 'block' : 'none';
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

// 點卡片展開
document.getElementById('notes-grid').addEventListener('click', function (e) {
  const card = e.target.closest('.note-card');
  if (!card || e.target.closest('button')) return;
  card.classList.toggle('expanded');
});

// === 查看完整筆記 ===
function viewNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return alert('筆記不見了！');

  document.getElementById('view-title').textContent = note.title || '無標題';

  const preview = document.getElementById('view-preview');
  preview.innerHTML = note.content
    ? marked.parse(note.content, {
      breaks: true,      // 支援單換行
      gfm: true,         // GitHub 風格表格
      headerIds: false   // 避免 ID 衝突
    })
    : '<em style="color:#999;">這篇筆記還沒有內容喔～</em>';

  const tags = Array.isArray(note.tags) ? note.tags : [];
  const colors = Array.isArray(note.tag_colors) ? note.tag_colors : [];
  document.getElementById('view-tags').innerHTML = tags
    .map((tag, i) => `<span class="tag" style="background:${colors[i] || '#999'}">${tag}</span>`)
    .join('');

  document.getElementById('view-timestamp').textContent =
    `更新於 ${new Date(note.updated_at).toLocaleString()}`;

  document.getElementById('view-modal').classList.add('show');
}

// 關閉查看
document.getElementById('close-view').onclick = () => {
  document.getElementById('view-modal').classList.remove('show');
};

document.getElementById('view-modal').onclick = (e) => {
  if (e.target.id === 'view-modal') {
    document.getElementById('view-modal').classList.remove('show');
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('view-modal').classList.remove('show');
    document.getElementById('editor-modal').classList.remove('show');
  }
});

// 頁面載入
document.addEventListener('DOMContentLoaded', () => {
  if (typeof marked === 'undefined') {
    console.warn('marked 未載入');
  }
  loadNotes();
});