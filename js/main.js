var sendURL = '/send.php';

var inputsTel_1 = document.querySelector('.form-1 input[type="tel"]');
var inputsTel_2 = document.querySelector('.form-2 input[type="tel"]');
var inputsTel_3 = document.querySelector('.form-3 input[type="tel"]');

var countMasks = 0;
// var mask1 = IMask(inputsTel_1, {
//   mask: '+{380} (99) 999-99-99',
//   //placeholderChar: '_',
//   lazy: false,
// });


var form1 = document.querySelector('.form-1');
var form2 = document.querySelector('.form-2');
var form3 = document.querySelector('.form-3');

function formError(form, text, success) {
  var inf = form.querySelector('.form-err');
  if (success == 'success') inf.classList.add('success');
  else inf.classList.remove('success');
  inf.innerHTML = text;
}

function formSend(form, mask) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    var phoneNumber = mask.unmaskedValue;

    if (
      mask.unmaskedValue.toString().length !== 12 ||
      form.querySelector('input[name="name"]').value.length < 2
    ) {
      return formError(form, "Введіть коректний номер телефону або ім'я!");
    }
    form.querySelector('.form-err').innerHTML = '';
    var btn = form.querySelector('button');
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    btn.classList.add('btn-load');

    var data = {
      name: form.querySelector('input[name="name"]').value,
      phone: phoneNumber,
    };
    sendCrm(sendURL, data, (res) => {
      if (res.type === 'success') {
        window.location.href =
          window.location.origin + '/thanks.php?name=' + data.name + '&phone=' + mask.value;
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

formSend(form1, mask1);
formSend(form2, mask2);
formSend(form3, mask3);

// fetch data

function sendCrm(url, data, success) {
  fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    // headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    // }
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

// const yearsOld = localStorage.getItem('years');

// if (yearsOld !== 'yes') {
//   const $body = document.body;
//   const $modal = document.querySelector('.modal-old');

//   $body.classList.add('open-modal');
//   $modal.style.display = 'flex';

//   const $btnYes = document.querySelector('a.btn[data-old="yes"]');
//   const $btnNo = document.querySelector('a.btn[data-old="no"]');

//   $btnYes.addEventListener('click', (e) => {
//     $body.classList.remove('open-modal');
//     $modal.style.display = 'none';

//     localStorage.setItem('years', 'yes');
//   });

//   $btnNo.addEventListener('click', (e) => {
//     $modal.querySelector('.modal-content').innerHTML = '<div>Дякуємо за розуміння</div>';
//   });
// }

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
