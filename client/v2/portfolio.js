// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
var dateToday = Date.now();
let currentBrands = [];

let tempProducts = [];
let tempbrand = "";
let recent = "No";
let reasonale = "No";
let sort = "";

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const selectBrand = document.querySelector('#brand-select');
const selectReasonable = document.querySelector('#reasonable-price')
const selectRecently = document.querySelector('#recently-released')
const sortSelect = document.querySelector('#sort-select');

var numberOfBrands = document.getElementById("nbBrands");

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  currentPagination.brand = "";
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
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentBrands};
    }

    return body.data.result;
  } catch (error) {
    console.error(error);
    return {currentBrands};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <span> <FONT COLOR="#ff0000"> ${product.released}</FONT> </span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrands = brand => {
  const options = Array.from(brand, x => `<option value="${x}">${x}</option>`);
  selectBrand.innerHTML = options;
  numberOfBrands.innerHTML = brand.length - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

// Filters 

const filterProductsBrand = (products, tbrand) => {
  const filteredprods = products.filter( product => product.brand == tbrand);
  return filteredprods;
};

const filterReasonableProducts = (products) =>{
  const filteredprods = products.filter(product => product.price <= 50);
  return filteredprods;
};

const filterRecentProducts = products => {
  const filteredprods = products.filter(product => (dateToday - new Date(product.released))/(1000*60*60*24) <= 60);
  return filteredprods;
};

// Sorts

const sortByPrice = products => {
  const sortedprods = products.sort((a,b) => a.price - b.price);
  return sortedprods;
};

const sortByDate = products => {
  const sortedprods = products.sort((a,b) => new Date(a.released)- new Date(b.released));
  return sortedprods;
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  
  if (tempbrand != ""){
    products.result = filterProductsBrand(products.result, tempbrand)
  }
  if (recent == "Yes"){
    products.result = filterRecentProducts(products.result);
  }
  if (reasonale == "Yes"){
    products.result = filterReasonableProducts(product.result);
  }
  
  setCurrentProducts(products);
  render(currentProducts, currentPagination);

});

selectPage.addEventListener('change', async (event) => {

  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);

  
  if (tempbrand != ""){
    products.result = filterProductsBrand(products.result, tempbrand)
  }
  if (recent == "Yes"){
    products.result = filterRecentProducts(products.result);
  }
  if (reasonale == "Yes"){
    products.result = filterReasonableProducts(products.result)
  }
  

  setCurrentProducts(products);
  render(currentProducts, currentPagination)

});

selectBrand.addEventListener('change', async(event) =>{
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value != ""){
    //alert(event.target.value);
    products.result = filterProductsBrand(products.result, event.target.value)
  }
  if (recent == "Yes"){
    products.result = filterRecentProducts(products.result)
  }
  if (reasonale == "Yes"){
    products.result = filterReasonableProducts(products.result)
  }

  tempbrand = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectRecently.addEventListener('change', async(event)  =>{
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (tempbrand != ""){
    //alert(event.target.value);
    products.result = filterProductsBrand(products.result, event.target.value)
  }
  if (event.target.value == "Yes"){
    products.result = filterRecentProducts(products.result)
  }
  if (reasonale == "Yes"){
    products.result = filterReasonableProducts(products.result)
  }

  recent = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectReasonable.addEventListener('change', async(event) =>{
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  
  if (tempbrand != ""){
    products.result = filterProductsBrand(products.result, tempbrand)
  }
  if (recent == "Yes"){
    products.result = filterRecentProducts(products.result)
  }
  if (event.target.value == "Yes"){
    products.result = filterReasonableProducts(products.result)
  }

  reasonale = event.target.value;
  setCurrentProducts(products);
  render(currentProducts, currentPagination);

});

sortSelect.addEventListener('change', async(event) =>{
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value == "Cheaper"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (event.target.value == "Expensive"){
    products.result = sortByPrice(products.result)
  }

  if (tempbrand != ""){
    products.result = filterProductsBrand(products.result, tempbrand)
  }
  if (recent == "Yes"){
    products.result = filterRecentProducts(products.result)
  }
  if (event.target.value == "Yes"){
    products.result = filterReasonableProducts(products.result)
  }

  sort = event.target.value
  setCurrentBrands(products)

});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentBrands(brands);
  setCurrentProducts(products);

  renderBrands(brands);
  render(currentProducts, currentPagination);

});