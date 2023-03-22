// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];
let selectors = {};
//let count = {}

// instantiate the selectors
const sectionBrands = document.querySelector('#brands');
const sectionProducts = document.querySelector('#products');

const selectShow = document.querySelector('#show-select');
const selectBrand = document.querySelector('#brand-select');

var numberOfBrands = document.getElementById("nbBrands");

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

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (brand = "", descOrder="", gender="") => {
  try {
    const response = await fetch(
     `https://clear-fashion-topaz-seven.vercel.app/products/search/?brand=${brand}&desc=${descOrder}&gender=${gender}`
    );
    const body = await response.json();
  
    return body;

    } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchCount = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-topaz-seven.vercel.app/products/count`
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
      `https://clear-fashion-topaz-seven.vercel.app/brands`
    );
    const body = await response.json();

    return body;

  } catch (error) {
    console.error(error);
    return {currentBrands};
  }
};

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product._id}>
        <div class="col">
          <img src=${product.image}>
        </div>
        <div class="col">
          <pre>
            <span class="underline"><font size="+3">${product.brand}</font></span>
            <a href="${product.link}" target="_blank" rel="noopener noreferrer">${product.name}</a>
            price : ${product.price} €
            release date : <span class="date">${product.date}</span>
          </pre>
        </div>
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

const renderBrands = brands => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = brands
    .map(brand => {
      return `
      <div>
        ${brand}
      </div>
     `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionBrands.innerHTML = '<h2>Brands</h2>';
  sectionBrands.appendChild(fragment);

  const options = Array.from(brands, x => `<option value="${x}">${x}</option>`);
  selectBrand.innerHTML = options;
  numberOfBrands.innerHTML = brands.length - 1;

};

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
  sectionProducts.scrollIntoView({ behavior: "smooth" })
  }
}

function previous(){
  if(currentPagination.page-1 > 0){
    currentPagination.page --;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionProducts.scrollIntoView({ behavior: "smooth" })
  }
}

function firstPage(){
  if(currentPagination.page != 1){
  currentPagination.page = 1;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionProducts.scrollIntoView({ behavior: "smooth" })
  }
}

function lastPage(){
  if(currentPagination.page != currentPagination.pageCount){
  currentPagination.page = currentPagination.pageCount;

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page);
  setCurrentProducts(currentProducts, currentPagination.pageCount, currentPagination.page, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
  sectionProducts.scrollIntoView({ behavior: "smooth" })
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

  //const products = await fetchProducts();

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

  let products = [];
  if (brand == ""){
    products = await fetchProducts();
  }
  else{
    products = await fetchProducts(selectors.brand, "", "");
  }
  console.log(products)
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length)

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

// Load Page //

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const nbprods = await fetchCount();

  const p5 = paginate(products, 12, 1);
  const pagecount = calculatePagesCount(12, nbprods.count)

  const brands = await fetchBrands();

  setCurrentProducts(products, pagecount, 1, 12);
  setCurrentBrands(brands);

  renderBrands(brands);
  renderProducts(p5);
  
  showPageInfo();

});

