const books = [];
const RENDER_EVENT = 'render-book';

function generateId () {
    return + new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook (bookObject) {
    const {id, title, author, year, isCompleted} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p')
    textYear.innerText = year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('bookItem');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('container')
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
          undoBookFromCompleted(id);
        });
    
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(id);
        });
    
        container.append(undoButton, trashButton);
    
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
          addBookToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(id);
        });
    
        container.append(checkButton, trashButton);
    }
    return container;
}

function addBook () {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    

    Swal.fire({
        title: 'Anda yakin akan menghapusnya?',
        text: "Data yang sudah dihapus tidak dapat dikembalikan lagi",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f3015',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (bookTarget == -1) return;
            books.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();

            Swal.fire(
            'Dihapus!',
            'Data berhasil dihapus',
            'success'
            );
        } 
    });
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Buku berhasil ditambahkan'
        })
    });
    
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            completeBookshelfList.append(bookElement);
        } else {
            incompleteBookshelfList.append(bookElement);
        }
    }
});

function saveData () {
    if (isStorageExist ()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookshelf_apps';

function isStorageExist () {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage () {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

/* script buat pencarian tapi masih belum bisa :(((
const cariBuku = document.querySelector('#searchBookTitle');
cariBuku.addEventListener('keyup', pencarianBuku);

function pencarianBuku(bookId) {
    const cariBuku = bookId.target.value.toLowerCase();
    let listBuku = document.querySelectorAll('.book_list');

    listBuku.forEach((buku) => {
        const judulBuku = buku.firstChild.textContent.toLowerCase();

        if (judulBuku.indexOf(cariBuku) != -1) {
            item.setAttribute('style', 'display: block;');
        } else {
            item.setAttribute('style', 'display: none !important;');
        }
    });
}
*/