// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

var dateToday = Date.now();

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];
let selectors = {brand: "", descOrder:"", gender:"", price:"", date:""};
//let count = {}

// instantiate the selectors
const sectionBrands = document.querySelector('#brands');
const sectionProducts = document.querySelector('#products');

const selectShow = document.querySelector('#show-select');
const selectBrand = document.querySelector('#brand-select');
const selectGender = document.querySelector('#gender-select');
const selectSort = document.querySelector('#sort-select');

const selectReasonable = document.querySelector('#reasonable-price')
const selectRecently = document.querySelector('#recently-released')

var spanNbProducts = document.querySelector('#nbProducts');
var numberOfBrands = document.getElementById("nbBrands");
var numberOfRecent = document.getElementById("nbNewProds");
var p50 = document.getElementById("p50");
var p90 = document.getElementById("p90");
var p95 = document.getElementById("p95");
var recentDate = document.getElementById("recent-date");

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
const fetchProducts = async (brand = "", descOrder="", gender="", price="", date="") => {
  try {
    const response = await fetch(
     `https://clear-fashion-topaz-seven.vercel.app/products/search/?brand=${brand}&order=${descOrder}&gender=${gender}&date=${date}&price=${price}`
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

// Filters //

const filterRecentProducts = products => {
  const filteredprods = products.filter(product => (dateToday - new Date(product.date))/(1000*60*60*24) <= 20);
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

  const p5 = paginate(currentProducts, currentPagination.pageSize, currentPagination.page, currentPagination);
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
  console.log(price)
  selectors.price = price;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
  console.log(products)
  const p5 = paginate(products, currentPagination.pageSize, 1);
  const pagecount = calculatePagesCount(currentPagination.pageSize, products.length)

  setCurrentProducts(products, pagecount, 1, currentPagination.pageSize);

  renderProducts(p5);

  showPageInfo();
});

selectRecently.addEventListener('change', async (event) => {
  const date = event.target.value;
  console.log(date)
  selectors.date = date;

  let products = await fetchProducts(selectors.brand, selectors.descOrder, selectors.gender, selectors.date, selectors.price);
  
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

  getIndicators(products);
  Pvalues(products);

  setCurrentProducts(products, pagecount, 1, 12);
  setCurrentBrands(brands);

  renderBrands(brands);
  renderProducts(p5);
  
  showPageInfo();

});

