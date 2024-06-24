document.addEventListener('DOMContentLoaded', showProducts);

document.querySelector('nav').addEventListener('click', function (e) {
    if (e.target.classList.contains('radio_toolbar')) {
        return;
    }

    setSelection(e.target.dataset.selection);
    showProducts();
});

function showProducts() {
    clearProducts();

    const selection = getSelection();
    let products = getProducts();

    if (selection === 'FAVOURITES') {
        products = products.filter(p => isProductInFavourites(p))
    } else if (selection === 'COMPARISON') {
        products = products.filter(p => isProductInComparison(p))
    }

    products.forEach(product => showProduct(product));
}

function showProduct(product) {
    const isHiddenProduct = isHidden(product);
    if (isHiddenProduct && notVisible()) {
        return;
    }

    const ul = document.querySelector('ul');
    const elem = document.createElement('li');
    elem.classList = 'product__item';

    elem.append(productItem.content.cloneNode(true));
    populateProductElement(elem, product);
    setButtonsState(elem, product);

    if (isHiddenProduct) {
        elem.style = "opacity: 0.5";
    }

    ul.append(elem);
}

function getId(product) {
    return 'product' + product.id;
}

function populateProductElement(elem, product) {
    elem.id = getId(product);

    elem.querySelector('.discount').textContent = product.price + '$';
    elem.querySelector('.old_price').textContent = product.priceWithoutDiscount + '$';
    elem.querySelector('img').src = product.image;
    elem.querySelector('.product_description').textContent = product.description;
    elem.querySelector('.product-type').textContent = product.productType;

    setButtonsValues(elem);
    createStars(elem, product.rating);
}

function setButtonsState(elem, product) {
    if (getHiddenProducts().has(getId(product))) {
        elem.querySelector(".hidden_button").classList = "hidden_button_active";
    }

    if (getFavouriteProducts().has(getId(product))) {
        elem.querySelector(".like_button").classList = "like_button_active";
    }

    if (getProductsInComparison().has(getId(product))) {
        elem.querySelector(".comparison_button").classList = "comparison_button_active";
    }
}

function createStars(elem, rating) {
    const starsContainer = elem.querySelector('.stars__container');

    const fullStarsCount = Math.floor(rating);
    const fractionalStarValue = rating - fullStarsCount;
    const emptyStarsCount = 5 - Math.ceil(fractionalStarValue) - fullStarsCount;

    for (let i = 0; i < fullStarsCount; i++) {
        const star = document.createElement('div')
        star.className = "star full-star";
        starsContainer.append(star);
    }

    if (fractionalStarValue) {
        const star = document.createElement('div')
        star.className = "star";
        star.style.background = " gray linear-gradient(to right, gold " + fractionalStarValue * 100
            + "%, transparent 0%)"
        starsContainer.append(star);
    }

    for (let i = 0; i < emptyStarsCount; i++) {
        const star = document.createElement('div')
        star.className = "star";
        starsContainer.append(star);
    }
}

function setButtonsValues(elem) {
    elem.querySelector('.hidden_button').value = elem.id;
    elem.querySelector('.like_button').value = elem.id;
    elem.querySelector('.comparison_button').value = elem.id;
}

function switchProductVisibility(product) {
    const hiddenProducts = getHiddenProducts();

    if (hiddenProducts.has(product)) {
        setPassiveNotVisibilityButton(product);
        hiddenProducts.delete(product);
    } else {
        setActiveNotVisibilityButton(product);
        hiddenProducts.add(product);
    }

    localStorage.setItem('hiddenProducts', Array.from(hiddenProducts).toString());
}

function switchProductLike(product) {
    const favouriteProducts = getFavouriteProducts();

    if (favouriteProducts.has(product)) {
        setPassiveLikeButton(product);
        favouriteProducts.delete(product);
    } else {
        setActiveLikeButton(product);
        favouriteProducts.add(product);
    }

    localStorage.setItem('favouriteProducts', Array.from(favouriteProducts).toString());
}

function switchProductComparison(product) {
    const productsInComparison = getProductsInComparison();

    if (productsInComparison.has(product)) {
        setPassiveComparisonButton(product);
        productsInComparison.delete(product);
    } else {
        setActiveComparisonButton(product);
        productsInComparison.add(product);
    }

    localStorage.setItem('productsInComparison', Array.from(productsInComparison).toString());
}

function getHiddenProducts() {
    const hiddenProducts = localStorage.getItem('hiddenProducts');

    if (hiddenProducts == null) {
        return new Set();
    }

    return new Set(hiddenProducts.split(',').filter(e => e));
}

function getFavouriteProducts() {
    const favouriteProducts = localStorage.getItem('favouriteProducts');

    if (favouriteProducts == null) {
        return new Set();
    }

    return new Set(favouriteProducts.split(',').filter(e => e));
}

function getProductsInComparison() {
    const productsInComparison = localStorage.getItem('productsInComparison');

    if (productsInComparison == null) {
        return new Set();
    }

    return new Set(productsInComparison.split(',').filter(e => e));
}

function setActiveNotVisibilityButton(product) {
    const elem = document.querySelector('.hidden_button[value="' + product + '"]');
    elem.classList = "hidden_button_active";

    if (visible()) {
        document.querySelector('#' + product).style = "opacity: 0.5";
    } else {
        document.querySelector('#' + product).style = 'display:none';
    }
}

function setPassiveNotVisibilityButton(product) {
    document.querySelector('#' + product).style = 'display:block';
    document.querySelector('.hidden_button_active[value="' + product + '"]').classList = "hidden_button";
}

function setActiveLikeButton(product) {
    document.querySelector('.like_button[value="' + product + '"]').classList = "like_button_active";
}

function setPassiveLikeButton(product) {
    document.querySelector('.like_button_active[value="' + product + '"]').classList = "like_button";
    if (getSelection() === 'FAVOURITES') {
        document.querySelector('#' + product).style = 'display:none';
    }
}

function setActiveComparisonButton(product) {
    document.querySelector('.comparison_button[value="' + product + '"]').classList = "comparison_button_active";
}

function setPassiveComparisonButton(product) {
    document.querySelector('.comparison_button_active[value="' + product + '"]').classList = "comparison_button";
    if (getSelection() === 'COMPARISON') {
        document.querySelector('#' + product).style = 'display:none';
    }
}

function clearProducts() {
    document.querySelector('.products__list').innerHTML = '';
}

function isHidden(product) {
    return getHiddenProducts().has(getId(product));
}

function isProductInFavourites(product) {
    return getFavouriteProducts().has(getId(product));
}

function isProductInComparison(product) {
    return getProductsInComparison().has(getId(product))
}

function visible() {
    return document.querySelector('#show_hidden').checked;
}

function notVisible() {
    return !visible();
}

function getSelection() {
    return localStorage.getItem('selection');
}

function setSelection(selection) {
    return localStorage.setItem('selection', selection);
}

const radioButtons = document.querySelectorAll('.radio_toolbar input[type="radio"]');
radioButtons.forEach(radio => {
    radio.addEventListener('change', function () {
        radioButtons.forEach(rb => {
            rb.checked = false;
        });
        radio.checked = true;
    });
});

document.addEventListener('DOMContentLoaded', function ()  {
    document.querySelectorAll('.radio_toolbar input[type="radio"]').forEach(radio => {
        radio.checked = radio.dataset.selection === getSelection();
    });
});

function getProducts() {
    return [
        {
            id: 1,
            image: "https://oldfpmi.bsu.by/ImgFpmi/Cache/Page/46933.jpg",
            description: "Математический Анализ Леваков",
            productType: "Математика",
            price: 100.0,
            priceWithoutDiscount: 200.0,
            rating: 5
        },
        {
            id: 2,
            image: "https://s2-goods.ozstatic.by/480/592/109/10/10109592_0_CHistiy_kod_Sozdanie_analiz_i_refaktoring_Robert_Martin.jpg",
            description: "Чистый код. Создание, анализ и рефакторинг",
            productType: "Программирование",
            price: 300.0,
            priceWithoutDiscount: 400.0,
            rating: 4.5
        },
        {
            id: 3,
            image: "https://s5-goods.ozstatic.by/480/529/936/10/10936529_0_Patterni_obektno-orientirovannogo_proektirovaniya_Erik_Ramma_R_Helm_R_Dzhonson_Dzhon_Vlissides.jpg",
            description: "Паттерны объектно-ориентированного проектирования",
            productType: "Программирование",
            price: 220.0,
            priceWithoutDiscount: 320.0,
            rating: 4.8
        },
        {
            id: 4,
            image: "https://s3-goods.ozstatic.by/480/224/43/101/101043224_0_Head_First_Patterni_proektirovaniya.jpg",
            description: "Head First. Паттерны проектирования",
            productType: "Программирование",
            price: 299.9,
            priceWithoutDiscount: 309.0,
            rating: 2.8
        },
        {
            id: 5,
            image: "https://s3-goods.ozstatic.by/480/394/157/101/101157394_0_Kompyuter_glazami_hakera_Mihail_Flenov.jpg",
            description: "Компьютер глазами хакера",
            productType: "Компьютерная безопасность",
            price: 99.0,
            priceWithoutDiscount: 201.0,
            rating: 4
        },
        {
            id: 6,
            image: "https://s5-goods.ozstatic.by/480/409/28/1/1028409_0_Arhitektura_kompyutera_Endryu_Tanenbaum.jpg",
            description: "Архитектура компьютера Эндрю Таненбаум",
            productType: "Архитектура компьютера",
            price: 89.0,
            priceWithoutDiscount: 450.0,
            rating: 3.8
        },
        {
            id: 7,
            image: "https://s5-goods.ozstatic.by/480/678/346/101/101346678_0_Red_Dead_Redemption_Horoshaya_plohaya_kultovaya_Rozhdenie_vesterna_ot_Rockstar_ames_Romen_Dasnua.jpg",
            description: "Red Dead Redemption. Хорошая, плохая, культовая. Рождение вестерна от Rockstar Games",
            productType: "Компьютерные игры",
            price: 99.0,
            priceWithoutDiscount: 999.0,
            rating: 4.3
        },
        {
            id: 8,
            image: "https://s3-goods.ozstatic.by/480/584/605/10/10605584_0_Data_Science_Nauka_o_dannih_s_nulya_Dzhoel_Rras.jpg",
            description: "Data Science. Наука о данных с нуля",
            productType: "Data Science",
            price: 333.0,
            priceWithoutDiscount: 1000.0,
            rating: 4.0
        },
        {
            id: 9,
            image: "https://s1-goods.ozstatic.by/480/60/779/10/10779060_0_Python_Razrabotka_na_osnove_testirovaniya_Rarri_Persival.jpg",
            description: "Python. Разработка на основе тестирования",
            productType: "Программирование",
            price: 20.0,
            priceWithoutDiscount: 50.0,
            rating: 2.8
        },
        {
            id: 10,
            image: "https://s2-goods.ozstatic.by/480/183/86/101/101086183_0_Rid_Java-razrabotchika_Proektno-orientirovanniy_podhod_Raul-Rabriel_Urma_Richard_Uorberton.jpg",
            description: "Гид Java-разработчика. Проектно-ориентированный подход",
            productType: "Программирование",
            price: 30.0,
            priceWithoutDiscount: 65.0,
            rating: 3.9
        }
    ]
}
