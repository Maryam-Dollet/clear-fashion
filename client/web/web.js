// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

var dateToday = Date.now();

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];
let selectors = {brand: "", descOrder:"", gender:"", price:"", date:""};
//let count = {}

let favoriteProducts = getLocalStorage();

// instantiate the selectors
const sectionBrands = document.querySelector('#brands');
const sectionProducts = document.querySelector('#products');

const selectShow = document.querySelector('#show-select');
const selectBrand = document.querySelector('#brand-select');
const selectGender = document.querySelector('#gender-select');
const selectSort = document.querySelector('#sort-select');

const selectReasonable = document.querySelector('#reasonable-price');
const selectRecently = document.querySelector('#recently-released');

var spanNbProducts = document.querySelector('#nbProducts');
var numberOfBrands = document.getElementById("nbBrands");
var numberOfRecent = document.getElementById("nbNewProds");
var p50 = document.getElementById("p50");
var p90 = document.getElementById("p90");
var p95 = document.getElementById("p95");
var recentDate = document.getElementById("recent-date");

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

const setCurrentBrands = (result) => {
  result.unshift("");
  currentBrands = result;
}


const fetchProducts = async (brand = "", descOrder="", gender="", price="", date="") => {
  try {
    const response = await fetch(
     `https://clear-fashion-topaz-seven-api.vercel.app/products/search/?brand=${brand}&order=${descOrder}&gender=${gender}&date=${date}&price=true`
    );
    const body = await response.json();
    console.log(body)
    return body;

    } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchCount = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-topaz-seven-api.vercel.app/products/count`
    );
    const body = await response.json();

    return body;

  } catch (error) {
    console.error(error);
    return {count};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-topaz-seven-api.vercel.app/brands`
    );
    const body = await response.json();

    return body;

  } catch (error) {
    console.error(error);
    return {currentBrands};
  }
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
            <div class="underline">${product.brand}</div>
            <div>
              <a href="${product.link}" target="_blank" rel="noopener noreferrer">${product.name}</a>
            </div>
            <div>price : ${product.price} €</div>
            <div>release date : <span class="date">${product.date}</span></div>
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
                                <h2>Products</h2>
                                <h3>Number of products : ${currentProducts.length}</h3>
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
      //console.log(document.getElementById(element._id));
      document.getElementById(element._id).style.color = "red";
    }
  });
};

const renderBrands = brands => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = "brands-container";
  const template = brands.slice(1)
    .map(brand => {
      return `
      <div class="brand">
        ${brand}
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionBrands.innerHTML = `<div class="title">
                              <h2>Brands</h2>
                            </div>`;
  sectionBrands.appendChild(fragment);

  const options = Array.from(brands, x => `<option value="${x}">${x}</option>`);
  selectBrand.innerHTML = options;
  numberOfBrands.innerHTML = brands.length - 1;

};

// Filters //

const filterRecentProducts = products => {
  const filteredprods = products.filter(product => (dateToday - new Date(product.date))/(1000*60*60*24) <= 30);
  return filteredprods;
};

// Sorts //

const sortByDate = products => {
  const sortedprods = products.sort((a,b) => new Date(a.date)- new Date(b.date));
  return sortedprods;
};

// Indicators //

const getIndicators = async(prods) => {
  var date = sortByDate(prods).reverse()[0].date;
  recentDate.innerHTML = date;
  spanNbProducts.innerHTML  = prods.length;
  numberOfRecent.innerHTML = filterRecentProducts(prods).length
}

const p_value = (products, q) => {
  var pvalue
  products.shift();
  q = q/100;
  var pos = ((products.length)-1)*q;
  var base = Math.floor(pos);
  var rest = pos - base;

  if ((products[base+1].price !== undefined)){
    pvalue = products[base].price + rest * (products[base+1].price-products[base].price);
  }
  else{
    pvalue =  products[base].price;
  }
  return Math.round(pvalue * 100) / 100;
}

const Pvalues = async(prods) =>{
  p50.innerHTML = p_value(prods, 50);
  p90.innerHTML = p_value(prods, 90);
  p95.innerHTML = p_value(prods, 95);
}

// Favorite products //
//add favorite product to localStorage
function manageFavorites(id){
  if(favoriteProducts.some(product => product._id === id)){
    alert('Product removed from favorites')
    var fav = currentProducts.find(item => item._id === id);
    removeFromLocalStorage(fav._id);
    const favBtn = document.getElementById(fav._id);
    favBtn.style.color = "black";
    favoriteProducts = getLocalStorage();
  }
  else{
    alert("Product added to favorites");
    // currentProducts.find(item => item.id === id).favorite = true
    var fav = currentProducts.find(item => item._id === id);
    // console.log(fav)
    addToLocalStorage(fav);
    const favBtn = document.getElementById(fav._id);
    favBtn.style.color = "red";
    favoriteProducts = getLocalStorage();
  }
}

// Local Storage 
//get favorite products from local storage and put into a list 
function getLocalStorage(){
  return localStorage.getItem("prods")?JSON.parse(localStorage.getItem('prods')) : [];
}

function addToLocalStorage(id){
  const prod = id;
  //console.log(grocery);
  let items = getLocalStorage();
  
  items.push(prod);
  localStorage.setItem('prods', JSON.stringify(items));
  // console.log(items);
}

//remove favorite product from local storage 
function removeFromLocalStorage(id){
  let items = getLocalStorage();
  // console.log(items)
  items = items.filter(function(item){
      if(item._id !== id){
          return item
      }
  });
  localStorage.setItem('prods', JSON.stringify(items));
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
  sectionBrands.scrollIntoView({ behavior: "smooth" })
  }
}

function previous(){
  if(currentPagination.page-1 > 0){
    currentPagination.page --;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionBrands.scrollIntoView({ behavior: "smooth" })
  }
}

function firstPage(){
  if(currentPagination.page != 1){
  currentPagination.page = 1;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionBrands.scrollIntoView({ behavior: "smooth" })
  }
}

function lastPage(){
  if(currentPagination.page != currentPagination.pageCount){
  currentPagination.page = currentPagination.pageCount;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionBrands.scrollIntoView({ behavior: "smooth" })
  }
}

function showPageInfo(){
  document.getElementById('pageInfo').innerHTML = `
    Page ${currentPagination.page} / ${currentPagination.pageCount}
  `
}

// Listeners //

selectShow.addEventListener('change', async (event) => {
  var pageSize = parseInt(event.target.value)
  if (pageSize==0){
    pageSize = currentProducts.length
  }

  const p5 = paginate(currentProducts, pageSize, 1);
  const pagecount = calculatePagesCount(pageSize, currentProducts.length)

  setCurrentProducts(currentProducts, pagecount, 1, pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectBrand.addEventListener('change', async (event) => {
  const brand = event.target.value;
  console.log(brand)
  selectors.brand = brand;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);

  console.log(products)
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length)

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectGender.addEventListener('change', async (event) => {
  const gender = event.target.value;
  console.log(gender)
  selectors.gender = gender;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
  console.log(products)
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length)

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectSort.addEventListener('change', async (event) => {
  const sort = event.target.value;
  console.log(sort)
  selectors.descOrder = sort;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
  console.log(products)
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length)

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectReasonable.addEventListener('change', async (event) => {
  const price = event.target.value;
  console.log(price);
  selectors.price = price;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
  console.log(products);
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length);

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectRecently.addEventListener('change', async (event) => {
  const date = event.target.value;
  console.log(date)
  selectors.date = date;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
  console.log(products);
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length);

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

//navbar

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

// Load Page //

document.addEventListener('DOMContentLoaded', async () => {
  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  const nbprods = await fetchCount();

  const p5 = paginate(products, 12, 1);
  const pagecount = calculatePagesCount(12, nbprods.count)

  const brands = await fetchBrands();

  getIndicators(products);
  Pvalues(products);

  setCurrentProducts(products, pagecount, 1, 12);
  setCurrentBrands(brands);

  renderBrands(brands);
  renderProducts(p5);
  
  showPageInfo();

});

