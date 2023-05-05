import { books, genres, authors, BOOKS_PER_PAGE } from "./data.js";

const matches = books
let page = 1;

const genreArray = Object.values(genres);
genreArray.unshift("All Genres");
const authorArray = Object.values(authors);
authorArray.unshift("All Authors")
const matchesArray = Object(books)
console.log(matchesArray)


// if (!books && !Array.isArray(books)) throw new Error('Source required') 
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

//create a html fragment to hold the books
const fragment = document.createDocumentFragment()
const extracted = books.slice(0, 36)

//made this a global variable because used in many functions
/**
 * This is the button used to add more books to the page as you scroll
 * down.
 */
const SHOW_MORE_BTN = document.querySelector('[data-list-button]');
//make the text on button more transparent
SHOW_MORE_BTN.setAttribute("style", "color: rgba(255, 255, 255, 0.6)");


/**
 * This function updates the number of books left and then prints
 * that number on the button used to show more books.
 * @returns { number } the number of books left that haven't been
 * loaded to the page
 */
const updateBooksLeft = () => {
    /* fetch the books that are already on the page then count them and
use the number of books left in the books object to add more books so the button
can stop adding more books when all the books in the object have been added*/
const booksOnPage = document.querySelectorAll('preview');
const booksOnPageCount = booksOnPage.length;
//subtract books on page from total books in object
const booksLeft = books.length - booksOnPageCount;
//add the text to the button element
return booksLeft
   }

// create a function to show the books on the page
/**
 * This function loads the home page of the website with 
 * the books shown in a list of 36 at a time.
 * @param {imported object} books 
 */
const appendBooks = (books) => {

    /* use imported variable that stored the number of books that
    can be on the page at a time in a for loop to loop through the books
    and add only 36 at time*/
    for (let i = 0; i < BOOKS_PER_PAGE; i++) {
        //get the books from index 0 in the books object
        const book = books[i];

        /*create a button element for the books so each book is 
        in its own card*/
        const button = document.createElement('button');

          //create a class and call it preview
          button.classList.add('preview');

               // Set the button's data-preview attribute to the book's id.
           button.dataset.preview = book.id;

      // Set the button's inner HTML to the book's title and author.
      button.innerHTML =/* HTML markup for the book cards */
      `
       <img class="preview__image" src="${book.image}" />
       <div class="preview__info">
         <h3 class="preview__title">${book.title}</h3>
         <div class="preview__author">${authors[book.author]}</div>
       </div>
     `;
     
    // Append the button to the fragment.
    fragment.appendChild(button);
}

     // Append the fragment to the data-list-items div.
     document.querySelector('[data-list-items]').appendChild(fragment);

SHOW_MORE_BTN.innerHTML = `Show more (${updateBooksLeft() - BOOKS_PER_PAGE})`
    }

    /**
     * This function will add more books to the page and update
     * the number in the show more button everytime it is clicked 
     * until there are no more books left in the books object.
     */
const showMoreAction = (event) => {
    event.preventDefault()
        /* fetch the books that are already on the page then count them and
    use the number of books left in the books object to add more books so the button
    can stop adding more books when all the books in the object have been added*/
    const booksOnPage = document.querySelectorAll('.preview');
    const booksOnPageCount = booksOnPage.length;
    //subtract books on page from total books in object
    const booksLeft = books.length - booksOnPageCount;
    //add the text to the button element
    
    //check if there are still books left in the books object
    if(booksLeft > 0) {
        /*add 36 more books to the page using the appendBooks function
        where the books object is altered by slicing out books
        from where the first function call ended to 36 more books*/
        appendBooks(books.slice(booksOnPageCount, booksOnPageCount + 36))
    }   
        SHOW_MORE_BTN.innerHTML = `Show more (${booksLeft - BOOKS_PER_PAGE})`

        /* make the summary overlay show when a book is clicked
 Used a for loop to iterate over all the book buttons so that
 each one can be clicked on
 NOTE - added here too so it can still work after the first 
 36 books are added*/
 const bookList = document.querySelectorAll('.preview')
 for (let z = booksOnPageCount; z < books.length; z++ ) {
    bookList[z].addEventListener("click", descriptionOverlay )
 }
    };


/**
 * This handler shows the book description overlay when the book is clicked on
 * @param event 
 */
const descriptionOverlay = (event) => {
    event.preventDefault()

    //fetch the dialog box where the overlay will be appended
    const bookSummary = document.querySelector('[data-list-active]')

    //get the book that is clicked
    const book = event.target.closest('.preview');
    //get a book id to use to fetch book information
    const bookId = book.getAttribute('data-preview');

    //for loop to iterate over the book object lloking for matchind ids
    for (let i = 0; i < books.length; i++) {
        //check if the id in the books object matches that of the clicked book
        if (books[i].id === bookId) {
        //create the overlaay div html
        bookSummary.innerHTML = /*html*/
        `<div class="overlay__preview">
        <img class="overlay__blur" data-list-blur="" src="${books[i].image}">
        <img class="overlay__image" data-list-image="" src="${books[i].image}">
        </div>
        <div class="overlay__content">
        <h3 class="overlay__title" data-list-title="">${books[i].title} (${new Date(books[i].published).getFullYear()})</h3>
        <div class="overlay__data" data-list-subtitle="">${authors[books[i].author]}</div>
        <p class="overlay__data overlay__data_secondary" data-list-description="">${books[i].description}</p>
        </div>
        <div class="overlay__row">
        <button class="overlay__button overlay__button_primary" data-list-close="">Close</button>
        </div>`
        }
    }

        //show the book summary overlay when its done being created
        bookSummary.showModal()

        //when the close button is clicked, the overlay should be removed
        document.querySelector('[data-list-close]').addEventListener("click", () => {
            bookSummary.close()
        })
}


/*-----------------------------------SEARCH----------------------------------- */

//fetch the dialog box to create the search overlay
const searchDialog = document.querySelector('[data-search-overlay]')
    searchDialog.innerHTML = /*html*/
    `<div class="overlay__content">
    <form class="overlay__form" data-search-form="" id="search">
      <label class="overlay__field">
        <div class="overlay__label">Title</div>
        <input class="overlay__input" data-search-title="" name="title" placeholder="Any">
      </label>

      <label class="overlay__field">
        <div class="overlay__label">Genre</div>
        <select class="overlay__input overlay__input_select" data-search-genres="" name="genre">${genreArray.map(genreArray => `<option value="${genreArray}">${genreArray}</option>`)}</select>
      </label>

      <label class="overlay__field">
        <div class="overlay__label">Author</div>
        <select class="overlay__input overlay__input_select" data-search-authors="" name="author">${authorArray.map(authorArray => `<option value="${authorArray}">${authorArray}</option>`)}</select>
      </label>
    </form>

    <div class="overlay__row">
      <button class="overlay__button" data-search-cancel="">Cancel</button>
      <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
    </div>
  </div>`

/**
 * This handler shows the search overlay when the search button in
 * the header is clicked.
 * @param event 
 */
const handleSearchOverlay = (event) => {
    event.preventDefault()
    searchDialog.showModal()
    document.querySelector('[data-search-title]').focus()
}

//create a function for the search
/**
 * 
 * @param {*} event 
 * @returns 
 */
const searchBooks = (event) => {
    event.preventDefault();

    const searchText = document.querySelector('[data-search-title]').value.toLowerCase().trim();
    const selectedGenre = document.querySelector('[data-search-genres]').value;
    const selectedAuthor = document.querySelector('[data-search-authors]').value;
  
    let filteredBooks = books;
  
    // Filter by genre
    if (selectedGenre !== "All Genres") {
      filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }
  
    // Filter by author
    if (selectedAuthor !== "All Authors") {
      filteredBooks = filteredBooks.filter(book => book.author === selectedAuthor);
    }
  
    // Apply the text search filter so that there is no search if no text
    if (searchText !== "") {
      filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(searchText));
    } 

    if (searchText === "") {
        // Clear the book list on the homepage
        document.querySelector('[data-list-items]').innerHTML = "";
        //print this to the page
       document.querySelector('[data-list-items]').innerHTML = "Sorry, no books matched your search";
   }
  
    // Clear the book list on the homepage
    document.querySelector('[data-list-items]').innerHTML = "";

    // Append the filtered books to the book list
    filteredBooks.slice(0, BOOKS_PER_PAGE).forEach(book => {
      const button = document.createElement('button');
      button.classList.add('preview');
      button.dataset.preview = book.id;
      button.innerHTML = `
        <img class="preview__image" src="${book.image}" />
        <div class="preview__info">
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${authors[book.author]}</div>
        </div>
      `;
      fragment.appendChild(button);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);

    // disable the show more button for the results page
    SHOW_MORE_BTN.disabled = true;

  };
  

const searchRow = document.querySelector('[data-search-overlay]')
//search button in the search form
const searchBtn = searchRow.querySelectorAll('button')[1]
//cancel button in the search form
const searchCancelBtn = searchRow.querySelectorAll('button')[0]
//this is to carry out the book search
searchBtn.addEventListener("click", searchBooks)
//this is to close the overlay when the search is done
searchBtn.addEventListener("click", (event) => {
    event.preventDefault()

    //this will reset the search overlay form so its clear next time it is called

    searchDialog.innerHTML = /*html*/
    `<div class="overlay__content">
    <form class="overlay__form" data-search-form="" id="search">
      <label class="overlay__field">
        <div class="overlay__label">Title</div>
        <input class="overlay__input" data-search-title="" name="title" placeholder="Any">
      </label>

      <label class="overlay__field">
        <div class="overlay__label">Genre</div>
        <select class="overlay__input overlay__input_select" data-search-genres="" name="genre">${genreArray.map(genreArray => `<option value="${genreArray}">${genreArray}</option>`)}</select>
      </label>

      <label class="overlay__field">
        <div class="overlay__label">Author</div>
        <select class="overlay__input overlay__input_select" data-search-authors="" name="author">${authorArray.map(authorArray => `<option value="${authorArray}">${authorArray}</option>`)}</select>
      </label>
    </form>

    <div class="overlay__row">
      <button class="overlay__button" data-search-cancel="">Cancel</button>
      <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
    </div>
  </div>`

    searchDialog.close();
})

//this is to close the search overlay when the cancel button is clicked
searchCancelBtn.addEventListener("click", (event) => {
    event.preventDefault()

    searchDialog.close();
})

 /* event listener for the search button to bring out the overlay */
 const homeSearchBtn =  document.querySelector('[data-header-search]')
homeSearchBtn.addEventListener("click", handleSearchOverlay)

/*----------------------------------------------------ACTION CALLS---------------------------------------------------*/
/* calling the function to load page with book list using an event
listener for when the page first loads  */
document.addEventListener("load", appendBooks(books))

/*use event listener to make button load more books with the
showMoreAction function*/
SHOW_MORE_BTN.addEventListener("click", showMoreAction) 

/* make the summary overlay show when a book is clicked
 Used a for loop to iterate over all the book buttons so that
 each one can be clicked on*/
 const bookList = document.querySelectorAll('.preview')
 for (const singleBook of bookList ) {
    singleBook.addEventListener("click", descriptionOverlay);
 };





//     fragment.appendChild(preview)
// }

// data-list-items.appendChild(fragment)

// genres = document.createDocumentFragment()
// element = document.createElement('option')
// element.value = 'any'
// element = 'All Genres'
// genres.appendChild(element)

// for ([id, name]; Object.entries(genres); i++) {
//     document.createElement('option')
//     element.value = value
//     element.innerText = text
//     genres.appendChild(element)
// }

// data-search-genres.appendChild(genres)

// authors = document.createDocumentFragment()
// element = document.createElement('option')
// element.value = 'any'
// element.innerText = 'All Authors'
// authors.appendChild(element)

// for ([id, name];Object.entries(authors); id++) {
//     document.createElement('option')
//     element.value = value
//     element = text
//     authors.appendChild(element)
// }

// data-search-authors.appendChild(authors)

// data-settings-theme.value === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
// v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' | 'day'

// documentElement.style.setProperty('--color-dark', css[v].dark);
// documentElement.style.setProperty('--color-light', css[v].light);
// data-list-button = "Show more (books.length - BOOKS_PER_PAGE)"

// data-list-button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

// data-list-button.innerHTML = /* html */ [
//     '<span>Show more</span>',
//     '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',
// ]

// data-search-cancel.click() { data-search-overlay.open === false }
// data-settings-cancel.click() { querySelect(data-settings-overlay).open === false }
// data-settings-form.submit() { actions.settings.submit }
// data-list-close.click() { data-list-active.open === false }

// data-list-button.click() {
//     document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
//     actions.list.updateRemaining()
//     page = page + 1
// }

// data-header-search.click() {
//     data-search-overlay.open === true ;
//     data-search-title.focus();
// }

// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1 
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')
    

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }
    
//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview
    
//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         } 
//     }
    
//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title
    
//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }



