import { books, genres, authors, BOOKS_PER_PAGE } from "./data.js";

import { SHOW_MORE_BTN, lightToggleDialog, data, FRAGMENT } from "./scripts.js";


/*--------------------------------------------------------DISPLAY------------------------------------------------ */


/**
 * This function updates the number of books left and then prints
 * that number on the button used to show more books.
 * @returns { number } the number of books left that haven't been
 * loaded to the page
 */
export const updateBooksLeft = () => {
    /* fetch the books that are already on the page then count them and
use the number of books left in the books object to add more books so the button
can stop adding more books when all the books in the object have been added*/
const booksOnPage = data.home.bookCards;
const booksOnPageCount = booksOnPage.length;
//subtract books on page from total books in object
const booksLeft = books.length - booksOnPageCount;
//add the text to the button element
return booksLeft
   }



/**
 * This function loads the home page of the website with 
 * the books shown in a list of 36 at a time.
 * @param {imported object} books 
 */
export const appendBooks = (books) => {

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
     
    // Append the button to the FRAGMENT.
    FRAGMENT.appendChild(button);
}

     // Append the fragment to the data-list-items div.
     data.home.main.appendChild(FRAGMENT);

data.home.SHOW_MORE_BTN.innerHTML = `Show more <span class = "list__remaining">(${updateBooksLeft() - BOOKS_PER_PAGE})</span>`
    }


    /**
     * This function will add more books to the page and update
     * the number in the show more button everytime it is clicked 
     * until there are no more books left in the books object.
     */
export const showMoreAction = (event) => {
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
            data.home.SHOW_MORE_BTN.innerHTML = `Show more <span class="list__remaining">(${booksLeft - BOOKS_PER_PAGE})</span>`
    
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

        
/*--------------------------------------------BOOK SUMMARY OVERLAY------------------------------------- */


/**
 * This handler shows the book description overlay when the book is clicked on
 * @param event 
 */
export const descriptionOverlay = (event) => {
    event.preventDefault()

    
    /**
     * The dialog box where the overlay will be appended
     */
    const bookSummary = document.querySelector('[data-list-active]')

    //get the book that is clicked
    const book = event.target.closest('.preview');
    //get a book id to use to fetch book information
    const bookId = book.getAttribute('data-preview');

    //for loop to iterate over the book object lloking for matchind ids
    for (let i = 0; i < books.length; i++) {
        //check if the id in the books object matches that of the clicked book
        if (books[i].id === bookId) {
        //The book summary overlay html
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


/*--------------------------------------------------------SEARCH----------------------------------------------------------------*/

/**
 * This handler will run the search through the books object 
 * and create new buttons with the search results then print them to the
 * html page.
 * If multiple criteria has been selected, it will show list of books that meet all the conditions
 * @param event 
 * @returns 
 */
export const searchBooks = (event) => {
    event.preventDefault();

    const searchText = document.querySelector('[data-search-title]').value.toLowerCase().trim();
    const selectedGenre = document.querySelector('[data-search-genres]').value;
    const selectedAuthor = document.querySelector('[data-search-authors]').value;
  
    let filteredBooks = books;
  
     /* apply the search filter on the genres so that if there is no 
    genre selected, it will not run the code here.
    The Object.keys() function returns an array of the number ids in the 
    genres object then the find() method will find the first key in the array
    that has a value that matches the selected Genre.
    The filter function will look if there is a key called genres in the
    books array and and return that book */
    if (selectedGenre !== "All Genres") {
      const genreId = Object.keys(genres).find(key => genres[key] === selectedGenre);
      filteredBooks = filteredBooks.filter(book => book.genres.includes(genreId.toString()));
    }
  
    /* apply the search filter on the authors so that if there is no 
    author selected, it will not run the code here. */
    if (selectedAuthor !== "All Authors") {
      const authorId = Object.keys(authors).find(key => authors[key] === selectedAuthor);
      filteredBooks = filteredBooks.filter(book => book.author.includes(authorId));
    }
  
    // Apply the text search filter so that there is no search if no text
    if (searchText !== "") {
      filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(searchText));
    } 

    //check if there were any books found
    let booksFound = filteredBooks.length > 0;
    //if there are no books found then should print message
    if (!booksFound) {
       // Clear the book list on the homepage
           document.querySelector('[data-list-items]').innerHTML = "";
       //print this to the page
          document.querySelector('[data-list-items]').innerHTML = `<div class = "list__message list__message_show" data-list-message = "">
                                                              <p>No results found.
                                                              Your filters may be too narrow, try again</p>
                                                          </div>`;

  // disable the show more button for the results page
    SHOW_MORE_BTN.disabled = true;

       return filteredBooks
    }

    // Clear the book list on the homepage
    document.querySelector('[data-list-items]').innerHTML = "";

    // Append the filtered books to the book list, used BOOKs_perpage to show only 36 books per page
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
      FRAGMENT.appendChild(button);
    });
    document.querySelector('[data-list-items]').appendChild(FRAGMENT);

    // disable the show more button for the results page
    SHOW_MORE_BTN.disabled = true;

    /* make the summary overlay show when a book in the results page is clicked
 Used a for of loop to iterate over all the book buttons so that
 each one can be clicked on*/
 const searchResultList = document.querySelector('[data-list-items]')
 const searchResultBook = searchResultList.querySelectorAll('button')
 for (const singleResult of searchResultBook ) {
    singleResult.addEventListener("click", descriptionOverlay);
 };
 
  /* when no search content is entered but search is clicked instead of cancel */
 if (!searchText && (selectedAuthor === "All Authors") && (selectedGenre === "All Genres")){
  // Clear the book list on the homepage
  document.querySelector('[data-list-items]').innerHTML = "";
  //print this to the page
 document.querySelector('[data-list-items]').innerHTML = `<div class = "list__message list__message_show" data-list-message = "">
                                                              <p>No results found.
                                                              Your filters may be too narrow, try again</p>
                                                          </div>`;
}
  };

/*----------------------------------------------------------TOGGLE LIGHT/DARK MODE------------------------------------------------------------------ */ 



/**
 * This handler will switch the theme of the webpage when clicked.
 * It fetch the value attribute of each of the options and check whether they were
 * the selected option when the save button was clicked then change the theme.
 * @param event 
 */
export const changeTheme = (event) => {
    event.preventDefault();
  
    const day = {
      dark: '10, 10, 20',
      light: '255, 255, 255',
    };
    
    const night = {
      dark: '255, 255, 255',
      light: '10, 10, 20',
    };
  
    const themeOption = document.querySelector('[data-settings-theme]').querySelectorAll('option')
  //first find the selected theme
  let selectedTheme = null;
  for (const singleOption of themeOption) {
    if (singleOption.selected) {
      selectedTheme = singleOption.value
    }
  }
  
  
  //fetch the whole document to change its colors
  const root = document.documentElement;
  
    if (selectedTheme.toLocaleLowerCase() !== 'night') {
      root.style.setProperty('--color-dark', day.dark);
      root.style.setProperty('--color-light', day.light);
    } else {
      root.style.setProperty('--color-dark', night.dark);
      root.style.setProperty('--color-light', night.light);
    }
  
    
  
  //  close the toggle overlay
  lightToggleDialog.close()
  
  }
  