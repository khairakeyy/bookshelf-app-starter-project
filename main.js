// main.js

const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

document.addEventListener('DOMContentLoaded', function () {
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');

  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  saveData();
  renderBooks();
  document.getElementById('bookForm').reset();
}

function renderBooks(filteredBooks = null) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const data = filteredBooks || books;

  for (const book of data) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');
  bookItem.classList.add('book-item');

  const title = document.createElement('h3');
  title.innerText = book.title;
  title.setAttribute('data-testid', 'bookItemTitle');

  const author = document.createElement('p');
  author.innerText = `Penulis: ${book.author}`;
  author.setAttribute('data-testid', 'bookItemAuthor');

  const year = document.createElement('p');
  year.innerText = `Tahun: ${book.year}`;
  year.setAttribute('data-testid', 'bookItemYear');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.addEventListener('click', function () {
    toggleBookStatus(book.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', function () {
    editBook(book.id);
  });

  buttonContainer.append(toggleButton, deleteButton, editButton);

  bookItem.append(title, author, year, buttonContainer);

  return bookItem;
}

function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(bookId) {
  const confirmDelete = confirm('Apakah kamu yakin ingin menghapus buku ini?');
  if (confirmDelete) {
    books = books.filter((b) => b.id !== bookId);
    saveData();
    renderBooks();
  }
}

function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    const newTitle = prompt('Masukkan judul baru:', book.title);
    const newAuthor = prompt('Masukkan penulis baru:', book.author);
    const newYear = prompt('Masukkan tahun baru:', book.year);

    if (newTitle !== null && newAuthor !== null && newYear !== null) {
      book.title = newTitle.trim() !== '' ? newTitle : book.title;
      book.author = newAuthor.trim() !== '' ? newAuthor : book.author;
      book.year = newYear.trim() !== '' ? newYear : book.year;

      saveData();
      renderBooks();
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    const data = JSON.parse(serializedData);
    if (Array.isArray(data)) {
      books = data;
    }
  }
  renderBooks();
}

function isStorageExist() {
  if (typeof(Storage) === undefined) {
    alert('Browser kamu tidak mendukung Local Storage');
    return false;
  }
  return true;
}

function searchBook() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  renderBooks(filteredBooks);
}
