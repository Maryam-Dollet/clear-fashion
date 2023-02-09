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
let currentBrands = [];

var dateToday = Date.now();

let tempProducts = [];
let tempbrand = "";
let recent = "No";
let reasonale = "No";
let sort = "";

let favoriteProducts = [];

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
var numberOfRecent = document.getElementById("nbNewProds");
var p50 = document.getElementById("p50");
var p90 = document.getElementById("p90");
var p95 = document.getElementById("p95");
var recentDate = document.getElementById("recent-date");

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
        <a href="${product.link}" target="_blank" rel="noopener noreferrer">${product.name}</a>
        <span>${product.price}</span>
        <span> <b><FONT COLOR="#ff0000"> ${product.released}</FONT> </b> </span>
        <button id=${product.uuid} type="button" onclick="addToFavorites(this.id)">Add to favorites</button>
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

// number ofs

const getRecentProducts = async () => {
  const prods = await fetchProducts(1, currentPagination.count);
  prods.result = filterRecentProducts(prods.result)
  numberOfRecent.innerHTML = prods.result.length;
};

const p_value = (products, q) => {
  var pvalue
  products = sortByPrice(products);
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

const Pvalues = async() =>{
  const prods = await fetchProducts(1,currentPagination.count);
  p50.innerHTML = p_value(prods.result, 50);
  p90.innerHTML = p_value(prods.result, 90);
  p95.innerHTML = p_value(prods.result, 95);
}

const getMostRecentdate = async() => {
  const prods = await fetchProducts(1,currentPagination.count);
  var date = sortByDate(prods.result).reverse()[0].released;
  recentDate.innerHTML = date;
}

// Add to favorites 

const addToFavorites = (id) => {
  if(favoriteProducts.some(product => product.uuid === id)){
    alert('Product already in your favorites')
  }
  else{
    alert("Product added");
    currentProducts.find(item => item.uuid === id).favorite = true
    var fav = currentProducts.find(item => item.uuid === id);
    favoriteProducts.push(fav);
  }

};

// filter favorite products

const filterFavoriteProducts = products => {
  const filteredprods = Object.keys(products).filter( product => product["favorite"] == true);
  return filteredprods;
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
    products.result = filterReasonableProducts(products.result);
  }
  
  if (sort == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (sort == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (sort == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (sort == "date-desc"){
    products.result = sortByDate(products.result)
  }

  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = "all"
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }

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
  
  if (sort == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (sort == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (sort == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (sort == "date-desc"){
    products.result = sortByDate(products.result)
  }
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = 222
  }

  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = "all"
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }

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

  if (sort == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (sort == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (sort == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (sort == "date-desc"){
    products.result = sortByDate(products.result)
  }
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = 222
  }

  tempbrand = event.target.value;
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = "all"
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
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

  if (sort == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (sort == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (sort == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (sort == "date-desc"){
    products.result = sortByDate(products.result)
  }
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = 222
  }

  recent = event.target.value;
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = "all"
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }
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

  if (sort == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (sort == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (sort == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (sort == "date-desc"){
    products.result = sortByDate(products.result)
  }
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = 222
  }

  reasonale = event.target.value;
  if (sort == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = "all"
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  }

});

sortSelect.addEventListener('change', async(event) =>{
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value == "price-asc"){
    products.result = sortByPrice(products.result)
  }
  if (event.target.value == "price-desc"){
    products.result = sortByPrice(products.result).reverse()
  }
  if (event.target.value == "date-asc"){
    products.result = sortByDate(products.result).reverse()
  }
  if (event.target.value == "date-desc"){
    products.result = sortByDate(products.result)
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
  if (event.target.value == "fav-prod"){
    products.result = filterFavoriteProducts(products.result)
    selectShow.value = 222;
    render(favoriteProducts, currentPagination)
  }
  else{
    setCurrentProducts(products)
    render(currentProducts, currentPagination);
  }

});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const brands = await fetchBrands();

  setCurrentBrands(brands);
  setCurrentProducts(products);

  renderBrands(brands);
  getRecentProducts();
  Pvalues();
  getMostRecentdate();
  render(currentProducts, currentPagination);

});