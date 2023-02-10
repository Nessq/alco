var sendURL = '/send.php';

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
} else {
  document.body.classList.add('no-touch');
}

var inputsTel_1 = document.querySelector('.form-1 input[type="tel"]');
var inputsTel_2 = document.querySelector('.form-2 input[type="tel"]');
var inputsTel_3 = document.querySelector('.form-3 input[type="tel"]');

var countMasks = 0;

// Burger burger
let isMenuOpen = false;
const $btnBurger = document.querySelector('.burger');
const $mobileNav = document.querySelector('.nav-mobile');
const $site = document.querySelector('.site');

// forms
var form1 = document.querySelector('.form-1');
var form2 = document.querySelector('.form-2');

// show more
const showMore = document.querySelector('.catalog-btn-all');

// open modal
let isOpenModalProduct = false;
const $modal = document.querySelector('.modal-product');

// anchor
const anchors = document.querySelectorAll('a[href*="#"]');

formSend(form1);
formSend(form2);

newSocialApp();
showMoreInit();
initAnchorScroll();
initAnchorActiveScroll();
initModalProductEvents();
initOpenMobileMenu();
initFixedMenu();
// var mask1 = IMask(inputsTel_1, {
//   mask: '+{380} (99) 999-99-99',
//   //placeholderChar: '_',
//   lazy: false,
// });

function initFixedMenu(){
  const $header = document.querySelector('header.header');
  const $nav = document.querySelector('.nav-pk');
  if(window.innerWidth > 767) {;
    const func = () => {
      if($header.offsetHeight <= window.scrollY){
        $nav.classList.add('fixed');
      }else{
        $nav.classList.remove('fixed');
      }
    }
    func();
    window.addEventListener('scroll', func);
  }else{
    const func = () => {
      if(window.scrollY > 150){
        $header.classList.add('scrolled');
      }else{
        $header.classList.remove('scrolled');
      }
    }
    func();
    window.addEventListener('scroll', func);
  }
}

function formError(form, text, success) {
  var inf = form.querySelector('.form-err');
  if (success == 'success') inf.classList.add('success');
  else inf.classList.remove('success');
  inf.innerHTML = '<p>'+ text +'</p>';
}

function formSend(form, mask) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const $name = form.querySelector('input[name="name"]');
    const $tel = form.querySelector('input[name="phone"]');
    const $productId = form.querySelector('input[name="product"]');
    const $counts = form.querySelector('input[name="counts"]');
    const dataForm = {};

    if ($name) dataForm.name = $name.value;
    if ($tel) dataForm.tel = $tel.value.replace(/\D+/g, '');
    if ($productId) dataForm.id = $productId.value;
    if ($counts) dataForm.counts = $counts.value;

    if ((dataForm.tel.length !== 12 && dataForm.tel.length !== 10) || dataForm.name.length < 2) {
      return formError(form, "Введіть коректний номер телефону або ім'я!");
    }
    if (dataForm.counts && !(dataForm.counts > 0)) {
      return formError(form, 'Кількість введена не вірно!');
    }

    form.querySelector('.form-err').innerHTML = '';
    var btn = form.querySelector('button');
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    btn.classList.add('btn-load');

    sendCrm(sendURL, dataForm, (res) => {
      if (res.type === 'success') {
        window.location.href =
          window.location.origin + '/thanks.php?name=' + dataForm.name + '&phone=' + dataForm.tel;
      } else {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
        btn.classList.remove('btn-load');
        form.reset();
        formError(form, res.msg, res.type);
      }
    });
  });
}
function sendCrm(url, data, success) {
  fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (success !== undefined) success(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

function newSocialApp() {
  var socialsLink = document.querySelectorAll('.socials a');
var phoneModal = document.querySelector('.modal-tel');
var phoneModalText = phoneModal.querySelector('.modal-tel__text');
var phoneModalPhone = phoneModal.querySelector('.modal-tel__phone');
var phoneModalClose = phoneModal.querySelector('.modal-tel__close');

phoneModalClose.addEventListener('click', (e) => {
  e.preventDefault();
  phoneModal.classList.remove('open');
  document.body.classList.remove('open-modal');
});

for (const link of socialsLink) {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    var elem = e.currentTarget;
    var dataText = elem.dataset.text;
    var dataPhones = JSON.parse(elem.dataset.phone, true);

    phoneModalText.innerHTML = '<h3>' + dataText + '</h3>';

    phoneModalPhone.innerHTML = '';

    for (const key in dataPhones) {
      if (Object.hasOwnProperty.call(dataPhones, key)) {
        const element = dataPhones[key];
        phoneModalPhone.innerHTML += `<a href="${element}">${key}</a>`;
      }
    }
    setTimeout(() => {
      document.body.classList.add('open-modal');
      phoneModal.classList.add('open');
    }, 0);
  });
}

window.addEventListener('click', (e) => {
  if (!phoneModal.classList.contains('open')) return;
  if (!e.target.closest('.modal-tel')) {
    e.preventDefault();
    e.stopPropagation();
    phoneModal.classList.remove('open');
    document.body.classList.remove('open-modal');
  }
});
}

function showMoreInit(){
  if (showMore) {
    showMore.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      e.preventDefault();
      document.querySelector('.catalog-grid').classList.add('opened');
      this.remove();
    });
  }
}

function increaseCount(a, b) {
  var input = b.previousElementSibling;
  var value = parseInt(input.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  input.value = value;
}

function decreaseCount(a, b) {
  var input = b.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}



function modalAnimation(ms, target) {
  if (isOpenModalProduct) {
    target.classList.remove('opened');
    target.classList.add('closing');
    setTimeout(() => {
      target.classList.remove('closing');
      target.classList.add('closed');
      document.body.classList.remove('open-modal');
      isOpenModalProduct = false;
    }, ms);
  } else {
    target.classList.remove('closed');
    target.classList.add('opening');
    document.body.classList.add('open-modal');
    setTimeout(() => {
      target.classList.remove('opening');
      target.classList.add('opened');
      isOpenModalProduct = true;
    }, ms);
  }
}

function renderInfoProductModal(btn, $modal, $form) {
  const $card = btn.closest('.card');
  $form.reset();
  $form.querySelector('.form-err').innerHTML = '';
  const dataCard = {
    srcImage: $card.querySelector('.card__image img').getAttribute('src'),
    title: $card.querySelector('.card__title').textContent,
    price: $card.querySelector('.card__price').textContent,
    prices: $card.querySelector('.card__prices').innerHTML,
    table: $card.querySelector('.card__table')?.innerHTML,
    productId: btn.getAttribute('data-product-id'),
  };
  $form.querySelector('input[name="product"]').value = dataCard.productId;
  $modal.querySelector('.modal-product__image img').setAttribute('src', dataCard.srcImage);
  $modal.querySelector('.modal-product__title').innerHTML = dataCard.title || '';
  $modal.querySelector('.modal-product__price').innerHTML = dataCard.price || '';
  $modal.querySelector('.modal-product__list').innerHTML = dataCard.prices || '';
  $modal.querySelector(' .modal-product__table').innerHTML = dataCard.table || '';
}


function initModalProductEvents(){
  document.querySelector('#catalog').addEventListener('click', (e) => {
    const clickElement = e.target;
    if (!clickElement.getAttribute('data-product-id')) return;
    e.preventDefault();
    renderInfoProductModal(clickElement, $modal, form2);
    modalAnimation(0, $modal);
  });
  
  document.querySelector('.modal-product').addEventListener('click', (e) => {
    if (e.target === e.currentTarget || e.target.closest('.modal-product__close'))
      modalAnimation(300, $modal);
  });
}

function initAnchorScroll(){
  for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      if(e.target.closest('.nav-mobile') && isMenuOpen){
        openMobileMenu();
        setTimeout(()=>{
          const blockID = anchor.getAttribute('href').substr(1);
  
          document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        },300)
      }else{
      const blockID = anchor.getAttribute('href').substr(1);
  
      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    });
  }
}


function initAnchorActiveScroll(){
  if (window.innerWidth > 767) {
    let navbarLinks = document.querySelectorAll('.nav-pk a[href*="#"]');
    window.addEventListener('scroll', (e) => {
      navbarLinks.forEach((link) => {
        let section = document.querySelector(link.hash);
        let {top, height} = section.getBoundingClientRect();
        if (
          top <= 150 &&
          top + height > 150
        ) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
          
        }
      });
    });
  }
}

function openMobileMenu() {

  if (isMenuOpen) {
    document.body.classList.remove('open-modal');
    $btnBurger.classList.remove('active');
   
      $mobileNav.classList.remove('active');
   
    $site.classList.remove('nav-open');
    isMenuOpen = false;
  } else {
    document.body.classList.add('open-modal');
    $btnBurger.classList.add('active');
    $mobileNav.classList.add('active');
    $site.classList.add('nav-open');
    isMenuOpen = true;
  }
}

function initOpenMobileMenu() {
  $btnBurger.addEventListener('click', openMobileMenu);
}

async function fetchIsDetect() {
  const api = new Promise((r,rj)=> {
    r(100).then((data)=> {
      rj();
       
    });
  
  });
}