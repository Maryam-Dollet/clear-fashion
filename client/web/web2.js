// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
const sectionProducts = document.querySelector('#products');

let currentProducts = [];
let currentPagination = {};

//navbar
const navbar = document.getElementById('nav');
const navHeight = navbar.getBoundingClientRect().height;

const setCurrentProducts = (result, pagecount, page, pagesize) => {
    currentProducts = result;
    currentPagination.pageCount = pagecount;
    currentPagination.pageSize = pagesize
    currentPagination.page = page
    //currentPagination.brand = "";
};

const renderProducts = products => {
    const div = document.createElement('div');
    div.className = "products-container";
    const template = products
      .map(product => {
        return `
        <div class="product">
          <div class="resize">
            <img src=${product.image}>
          </div>
          <div class="col">
              <span class="underline">${product.brand}</span><br>
              <a href="${product.link}" target="_blank" rel="noopener noreferrer">${product.name}</a><br>
              <span>price : ${product.price} €</span><br>
              <span>release date : <span class="date">${product.date}</span></span>
              <div>
                <button class="fav-btn" id=${product._id} type="button" onclick="manageFavorites(this.id)">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
          </div>
        </div>
       `;
      })
      .join('');
  
    div.innerHTML = template;
    sectionProducts.innerHTML = `<div class="title">
                                  <h2>Favorite Products</h2>
                                </div>`;
    const pdiv = document.createElement('div');
    pdiv.className = "products-center";
    pdiv.appendChild(div);
    sectionProducts.appendChild(pdiv);
    //console.log(pdiv);
    // check if product id is in favorite if yes the fav-button is red
    const localfavs = getLocalStorage()
    localfavs.forEach(element => {
      if(document.getElementById(element._id)){
        console.log(document.getElementById(element._id));
        document.getElementById(element._id).style.color = "red";
      }
    });
  };

// navbar //

window.addEventListener('scroll', function(){
    //console.log(window.pageYOffset);
    const scrollHeight = window.pageYOffset;
    const navheight = navbar.getBoundingClientRect().height;
    if(scrollHeight > navheight){
        navbar.classList.add('fixed-nav');
    }
    else{
        navbar.classList.remove('fixed-nav');
    }
})

// Local Storage //
//get favorite products from local storage and put into a list 
function getLocalStorage(){
    return localStorage.getItem("prods")?JSON.parse(localStorage.getItem('prods')) : [];
  }

// Calculate pagination //

function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
  
const calculatePagesCount = (pageSize, totalCount) => {
// we suppose that if we have 0 items we want 1 empty page
return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};

// Navigation //

function nextPage(){
    if(currentPagination.page+1<=currentPagination.pageCount){
        currentPagination.page ++;
    
        const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
        setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);
    
        renderProducts(p5);
    
        showPageInfo();
        // sectionBrands.scrollIntoView({ behavior: "smooth" })
    }
}

function previous(){
    if(currentPagination.page-1 > 0){
        currentPagination.page --;

        const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
        setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

        renderProducts(p5);

        showPageInfo();
        // sectionBrands.scrollIntoView({ behavior: "smooth" })
    }
}

function firstPage(){
    if(currentPagination.page != 1){
        currentPagination.page = 1;

        const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
        setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

        renderProducts(p5);

        showPageInfo();
        // sectionBrands.scrollIntoView({ behavior: "smooth" })
    }
}

function lastPage(){
    if(currentPagination.page != currentPagination.pageCount){
        currentPagination.page = currentPagination.pageCount;

        const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
        setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

        renderProducts(p5);

        showPageInfo();
        // sectionBrands.scrollIntoView({ behavior: "smooth" })
    }
}

function showPageInfo(){
    document.getElementById('pageInfo').innerHTML = `
        Page ${currentPagination.page} / ${currentPagination.pageCount}
    `
}


// Load Page //

document.addEventListener('DOMContentLoaded', async () => {
    let products = getLocalStorage()
    
    console.log(products);

    const p5 = paginate(products, 12, 1);
    const pagecount = calculatePagesCount(12, products.length)

    setCurrentProducts(products, pagecount, 1, 12);
    
    renderProducts(p5);
    
    showPageInfo();
  
  });
