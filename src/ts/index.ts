import { AllHTMLAttributes } from "react";
import { Product } from "./Product";

interface ElementProps<T extends HTMLElement> extends AllHTMLAttributes<T> {
  tag: string;
  text?: string;
}

export const DOMUtils = {
  createHTMLElement: <T extends HTMLElement>({ tag, text, ...props }: ElementProps<T>) => {
    const { className, onClick, onChange, src, type, data } = props;
    const element = document.createElement(tag);

    if (className) element.classList.add(className);
    if (text) element.innerText = text;
    if (onClick) element.addEventListener('click', onClick as any);
    if (onChange) element.addEventListener('change', onChange as any);
    if (src) (element as HTMLImageElement).src = src;
    if (type) (element as HTMLInputElement).type = type;
    if (data) element.setAttribute('data-value', data);

    return element;
  },

  formatBrazilianCurrency: (value: number) => {
    if (typeof value !== "number")
      throw `formatBrazilianCurrency expects a number, but received ${typeof value}`;

    const formattedValue = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
    }).format(Number(value.toFixed(2)));

    return `R$${formattedValue}`;
  }
};

export const DeviceUtils = {
  getCurrentDeviceWidthScreen: () => window.innerWidth <= 959 ? 'mobile' : 'desktop'
};

export const Cart = {
  init: () => {
    Cart.calculateTotalPrice();
    Cart.buildCartItems();
  },

  addToCart: (products: Product[]) => {
    const uniqueProducts = new Set(Cart.products.inCart);
    products.forEach(product => uniqueProducts.add(product));
    Cart.products.inCart = Array.from(uniqueProducts);
    Cart.buildCartItems();
  },

  removeFromCart: (id: string) => {
    Cart.products.inCart = Cart.products.inCart.filter(product => product.id !== id);
    Cart.buildCartItems();
  },

  products: {
    inCart: [] as Product[],
  },

  buildCartItems: () => {
    const cartItemsContainer = document.querySelector(".modal.minicart .modal__products");
    cartItemsContainer.innerHTML = "";

    Cart.products.inCart.forEach((product: Product) => {
      const { price, name, id, image, color } = product;
      const formattedPrice = DOMUtils.formatBrazilianCurrency(price);

      const itemElement = DOMUtils.createHTMLElement({ tag: 'div', className: "minicart__item" });
      const elementsToAppend = [
        DOMUtils.createHTMLElement({ tag: 'img', src: image, className: "minicart__image" }),
        DOMUtils.createHTMLElement({ tag: 'p', text: name, className: "minicart__name" }),
        DOMUtils.createHTMLElement({ tag: 'p', text: color, className: "minicart__color" }),
        DOMUtils.createHTMLElement({ tag: 'p', text: formattedPrice, className: "minicart__price" }),
        DOMUtils.createHTMLElement({ tag: 'a', text: "Remover", className: "minicart__remove", data: id, onClick: () => Cart.removeFromCart(id) })
      ];

      itemElement.append(...elementsToAppend);
      cartItemsContainer.append(itemElement);
    });

    Cart.updateCartQuantity();
    Cart.calculateTotalPrice();
  },

  updateCartQuantity: () => {
    const headerQuantityElement = document.querySelector(".header .header__quantity");
    const productsInCartQuantity = Cart.products.inCart.length;
    headerQuantityElement.innerHTML = productsInCartQuantity.toString();
  },

  calculateTotalPrice: () => {
    const footerValueElement = document.querySelector(".minicart .minicart__footer .minicart__value")
    const minicartValueSum = Cart.products.inCart.reduce((total, product) => total + product.price, 0);
    footerValueElement.innerHTML = DOMUtils.formatBrazilianCurrency(minicartValueSum);
  }
};

const ProductShelf = {
  init: () => {
    ProductShelf.fetchProductData();
    ProductShelf.showMoreProducts();
  },

  products: {
    filtereds: [] as Product[],
    available: [] as Product[],
  },

  fetchProductData: async () => {
    const serverUrl = "http://localhost:5000/products";
    const response = await fetch(serverUrl);
    const data: Product[] = await response.json();

    ProductShelf.products.filtereds.push(...data);
    ProductShelf.products.available.push(...data);
    ProductShelf.buildProductCards();
  },

  buildProductCard: (product: Product) => {
    const { price, name, id, image, parcelamento: installment } = product;
    const formattedPrice = DOMUtils.formatBrazilianCurrency(price);
    const [installmentTimes, installmentValue] = installment;
    const formattedInstallmentValue = DOMUtils.formatBrazilianCurrency(installmentValue);
    const installmentLabel = `até ${installmentTimes}x de ${formattedInstallmentValue}`;

    const cardElement = DOMUtils.createHTMLElement({ tag: 'div', className: "shelf" });
    const elementsToAppend = [
      DOMUtils.createHTMLElement({ tag: 'img', className: "shelf__image", src: image }),
      DOMUtils.createHTMLElement({ tag: 'h2', className: "shelf__name", text: name }),
      DOMUtils.createHTMLElement({ tag: 'p', className: "shelf__price", text: formattedPrice }),
      DOMUtils.createHTMLElement({ tag: 'p', className: "shelf__installment", text: installmentLabel }),
      DOMUtils.createHTMLElement({ tag: 'button', className: "shelf__button", text: "Comprar", onClick: () => Cart.addToCart([product]) })
    ];

    cardElement.append(...elementsToAppend);
    return cardElement;
  },

  productsToShow: 9,

  showMoreProducts: () => {
    const button = document.querySelector(".showMoreProducts");
    const hideSeeMoreButton = () => button.classList.add("_hide");
    const showSeeMoreButton = () => button.classList.remove("_hide");

    if (ProductShelf.productsToShow < ProductShelf.products.filtereds.length)
      showSeeMoreButton();
    else hideSeeMoreButton();


    button.addEventListener("click", () => {
      ProductShelf.productsToShow += 9;
      ProductShelf.buildProductCards();
      hideSeeMoreButton();
      ProductShelf.productsToShow = 9;
    });
  },

  buildProductCards: () => {
    const shelfsContainer = document.querySelector(".container .shelfs");
    const products = ProductShelf.products.filtereds.slice(0, ProductShelf.productsToShow);

    shelfsContainer.innerHTML = "";

    products.forEach(product => {
      const cardElement = ProductShelf.buildProductCard(product);
      shelfsContainer.append(cardElement);
    });
  },
};

const Filters = {
  init: () => {
    const filterContainer = document.querySelector(".container>.modal");
    const device = DeviceUtils.getCurrentDeviceWidthScreen();

    if (filterContainer && device !== "mobile") filterContainer.classList.remove("modal");

    Filters.orderBy();
    Filters.colors();
    Filters.sizes();
    Filters.prices();
    Filters.clearFilters();
    Filters.accordion();
  },

  active: {
    color: [] as any,
    size: [] as any,
    priceMin: undefined as number,
    priceMax: undefined as number,
    date: '' as string,
    sortOrder: '' as string,
  },

  orderBy: () => {
    const orderByContainer = document.querySelector(".breadcrumb #order");
    const options = ['Mais recentes', 'Menor preço', 'Maior preço'];

    orderByContainer.addEventListener("change", (event) => {
      if (event.target instanceof HTMLSelectElement) {
        const selectedOption = event.target.value;
        Filters.active.sortOrder = selectedOption
        Filters.applyFilters();
      }
    });

    options.forEach(optionText => {
      const optionElement = DOMUtils.createHTMLElement({ tag: 'option', text: optionText });
      orderByContainer.append(optionElement);
    });

    const ordersContainer = document.querySelector(".modal.order .modal__products");
    const orderItems = ordersContainer.querySelectorAll("label");

    orderItems.forEach((item) => {
      item.addEventListener("click", () => {
        Filters.active.sortOrder = item.dataset.value
        Filters.applyFilters()
      });
    });
  },

  colors: () => {
    const filtersColorsContainer = document.querySelector(".container .filters__colors");
    const filtersColors = [
      "Amarelo", "Azul", "Branco", "Cinza", "Laranja",
      "Verde", "Vermelho", "Preto", "Rosa", "Vinho"
    ];

    filtersColors.forEach(filter => {
      const onChange = () => {
        const inputs = filtersColorsContainer.querySelectorAll("input[type='checkbox']:checked");
        const checkeds = Array.from(inputs).map((input: HTMLInputElement) => input.dataset.value);
        Filters.active.color = checkeds.length > 0 ? [checkeds] : []
        Filters.applyFilters()
      };

      const filterElement = Filters.buildFilter(filter, onChange, filter);
      filtersColorsContainer.appendChild(filterElement);
    });

    const toggleColorFilterStatus = () => filtersColorsContainer.classList.toggle("_active");
    const buttonSeeAll = DOMUtils.createHTMLElement({ tag: "button", text: "Ver todas as cores", className: "_see-all", onClick: toggleColorFilterStatus });
    filtersColorsContainer.appendChild(buttonSeeAll);
  },

  sizes: () => {
    const filtersSizesContainer = document.querySelector(".container .filters__sizes");
    const filtersSizes = ["P", "M", "G", "GG", "U", "36", "38", "40", "36", "38", "40"];

    filtersSizes.forEach(filter => {
      const onChange = () => {
        const inputs = filtersSizesContainer.querySelectorAll("input[type='checkbox']:checked");
        const checkeds = Array.from(inputs).map((input: HTMLInputElement) => input.dataset.value);
        Filters.active.size = checkeds.length > 0 ? [checkeds] : []
        Filters.applyFilters()
      };

      const filterElement = Filters.buildFilter(filter, onChange, filter);
      filtersSizesContainer.appendChild(filterElement);
    });
  },

  prices: () => {
    const filtersPricesContainer = document.querySelector(".container .filters__prices") as HTMLElement;
    const filtersPrices = [
      { label: "de R$0 até R$50", data: '0-50' },
      { label: "de R$51 até R$150", data: '51-100' },
      { label: "de R$151 até R$300", data: '151-300' },
      { label: "de R$301 até R$500", data: '301-500' },
      { label: "a partir de R$500", data: "500-9999" },
    ];

    const getCheckedValues = (container: HTMLElement): number[][] => {
      const inputs = container.querySelectorAll("input[type='checkbox']:checked");
      return Array.from(inputs).map((input: HTMLInputElement) => input.dataset.value.split('-').map(Number));
    };

    const filterValidValues = (values: number[][]): number[][] => {
      return values.filter(([min, max]) => !isNaN(min) && !isNaN(max));
    };

    const getMinMaxValues = (values: number[][]): [number, number] => {
      const minValue = Math.min(...values.map(([min, _]) => min));
      const maxValue = Math.max(...values.map(([_, max]) => max));
      return [minValue, maxValue];
    };

    const applyPriceFilters = (minValue: number, maxValue: number): void => {
      Filters.active.priceMin = minValue;
      Filters.active.priceMax = maxValue;
      Filters.applyFilters();
    };

    const onChange = () => {
      const checkedValues = getCheckedValues(filtersPricesContainer);
      const validValues = filterValidValues(checkedValues);

      if (validValues.length === 0) {
        Filters.active.priceMin = 0;
        Filters.active.priceMax = 9999;
        Filters.applyFilters();
        return;
      }

      const [minValue, maxValue] = getMinMaxValues(validValues);
      applyPriceFilters(minValue, maxValue);
    };

    filtersPrices.forEach(filter => {
      const filterElement = Filters.buildFilter(filter.label, onChange, filter.data);
      filtersPricesContainer.appendChild(filterElement);
    });
  },

  buildFilter: (filter: string, onChange?: () => void, data?: string) => {
    const label = DOMUtils.createHTMLElement({ tag: "label", text: filter, className: "filter", onChange: onChange });
    const input = DOMUtils.createHTMLElement({ tag: "input", type: "checkbox", data: data });
    label.append(input);
    return label;
  },

  applyFilters: () => {
    let filteredProducts = ProductShelf.products.available;
    const { color: [color], size: [size], priceMax, priceMin, sortOrder } = Filters.active;

    if (color) filteredProducts = filteredProducts.filter(product => color.includes(product.color));
    if (size) filteredProducts = filteredProducts.filter(product => size.some((size: any) => product.size.includes(size)));
    if (priceMin !== undefined && priceMax !== undefined) filteredProducts = filteredProducts.filter(product => product.price >= priceMin && product.price <= priceMax);

    if (sortOrder === 'Menor preço') filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'Maior preço') filteredProducts.sort((a, b) => b.price - a.price);
    else if (sortOrder === 'Mais recentes') filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    ProductShelf.products.filtereds = filteredProducts;
    ProductShelf.buildProductCards();
    ProductShelf.showMoreProducts();
  },

  clearFilters: () => {
    const cleatButton = document.querySelector(".modal .modal__clear");
    const modalInputs = document.querySelectorAll<HTMLInputElement>(".modal .filters__content input[type='checkbox']");

    cleatButton.addEventListener('click', () => {
      Filters.active = { color: [], priceMax: undefined, priceMin: undefined, size: [], sortOrder: '', date: '' };
      Filters.applyFilters();
      modalInputs.forEach((input) => input.checked = false);
    });
  },

  accordion: () => {
    const titleElement = document.querySelectorAll(".modal .filters__title");

    titleElement.forEach((title) => {
      title.addEventListener("click", () => {
        title.classList.toggle("active");
      });
    });
  }
};

ProductShelf.init();
Filters.init();
Cart.init();
