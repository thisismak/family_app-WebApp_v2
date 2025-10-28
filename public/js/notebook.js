// public/js/notebook.js
let notes = [];
let currentNoteId = null;

function loadNotes() {
  fetch('/notebook/notes')
    .then(r => r.json())
    .then(data => {
      notes = data;
      renderNoteList();
    });
}

function renderNoteList() {
  const list = document.getElementById('noteList');
  list.innerHTML = '';
  if (!notes.length) {
    list.innerHTML = '<li class="list-group-item text-center">暫無筆記</li>';
    return;
  }
  notes.forEach(note => {
    const li = document.createElement('li');
    li.className = 'list-group-item note-item';
    li.innerHTML = `<strong>${escapeHtml(note.title)}</strong><br><small>${formatDate(note.updated_at)}</small>`;
    li.onclick = () => openNote(note);
    list.appendChild(li);
  });
}

function openNote(note) {
  currentNoteId = note.id;
  document.getElementById('noteId').value = note.id;
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content || '';
  document.getElementById('noteForm').classList.remove('d-none');
  document.getElementById('deleteNoteBtn').classList.remove('d-none');
  renderPreview();
}

document.getElementById('newNoteBtn').onclick = () => {
  currentNoteId = null;
  document.getElementById('noteId').value = '';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('noteForm').classList.remove('d-none');
  document.getElementById('deleteNoteBtn').classList.add('d-none');
  document.getElementById('previewArea').classList.add('d-none');
};

document.getElementById('saveNoteBtn').onclick = () => {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value;
  if (!title) return alert('請輸入標題');

  const url = currentNoteId ? `/notebook/edit/${currentNoteId}` : '/notebook/add';
  const method = currentNoteId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      loadNotes();
      if (!currentNoteId) {
        document.getElementById('noteForm').classList.add('d-none');
      }
    } else {
      alert(data.error || '儲存失敗');
    }
  });
};

document.getElementById('deleteNoteBtn').onclick = () => {
  if (!confirm('確定刪除這篇筆記？')) return;
  fetch(`/notebook/delete/${currentNoteId}`, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        loadNotes();
        document.getElementById('noteForm').classList.add('d-none');
      }
    });
};

document.getElementById('noteContent').oninput = renderPreview;
function renderPreview() {
  const md = document.getElementById('noteContent').value;
  const html = marked.parse(md);
  const preview = document.getElementById('previewArea');
  preview.innerHTML = html;
  preview.classList.toggle('d-none', !md);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('zh-TW', { hour12: false });
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 初始化
document.addEventListener('DOMContentLoaded', loadNotes);