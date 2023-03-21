// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

let currentProducts = [];
let currentPagination = {};
let currentBrands = [];

// instantiate the selectors
const sectionBrands = document.querySelector('#brands');
const sectionProducts = document.querySelector('#products');

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
const fetchProducts = async () => {
  try {
    const response = await fetch(
     `https://clear-fashion-topaz-seven.vercel.app/products/search`
    );
    const body = await response.json();
  
    return body;

    } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
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
};

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const calculatePagesCount = (pageSize, totalCount) => {
  // we suppose that if we have 0 items we want 1 empty page
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  const p5 = paginate(products, 100, 1);

  console.log(products);

  console.log(p5);

  const brands = await fetchBrands();
  console.log(brands);
  setCurrentBrands(brands);
  renderBrands(brands);
  renderProducts(products);
  

});

