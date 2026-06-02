const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const tableBody = document.getElementById('tableBody');
const pagination = document.getElementById('pagination');

const rows = Array.from(tableBody.querySelectorAll('tr'));
let currentPage = 1;
const rowsPerPage = 3;

function updateTable() {
  const searchValue = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;

  let filteredRows = rows.filter(row => {
    const name = row.querySelector('.item-name').textContent.toLowerCase();
    return name.includes(searchValue);
  });

  filteredRows.sort((a, b) => {
    const nameA = a.querySelector('.item-name').textContent.toLowerCase();
    const nameB = b.querySelector('.item-name').textContent.toLowerCase();

    if (sortValue === 'asc') {
      return nameA.localeCompare(nameB, 'ru');
    } else {
      return nameB.localeCompare(nameA, 'ru');
    }
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  rows.forEach(row => row.style.display = 'none');

  filteredRows.slice(start, end).forEach(row => {
    row.style.display = '';
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active-page' : '';
    btn.addEventListener('click', () => {
      currentPage = i;
      updateTable();
    });
    pagination.appendChild(btn);
  }
}

searchInput.addEventListener('input', () => {
  currentPage = 1;
  updateTable();
});

sortSelect.addEventListener('change', () => {
  currentPage = 1;
  updateTable();
});

updateTable();