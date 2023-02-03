<?php

header("Content-Type: application/json; charset=UTF-8");

$dataJson = file_get_contents("php://input");

$dataJson = json_decode($dataJson);

$_REQUEST['name'] = $dataJson->name;
$_REQUEST['phone'] = '+' . $dataJson->phone;



//***************** Страница с завершением заказа ******************
session_start();


$currentPrice = '680';
$currentId = '8';


if ($slct == 'Люкс') {
    $currentPrice = '680';
    $currentId = '8';
}

if ($slct == 'Альфа') {
    $currentPrice = '700';
    $currentId = '9';
}

if ($slct == 'Пшеничний') {
    $currentPrice = '720';
    $currentId = '10';
}

$products_list = array(
    0 => array(
        'product_id' => $currentId,    //код товара (из каталога CRM)
        'price'      => $currentPrice, //цена товара 1
        'count'      => '1',                     //количество товара 1
        // если есть смежные товары, тогда количество общего товара игнорируется

    ),

);

$products = urlencode(serialize($products_list));
$sender = urlencode(serialize($_SERVER));
// параметры запроса




$data = array(
    'key' => 'b8fff71a69ad00f0aba0512240889eea', //Ваш секретный токен
    'order_id'        => number_format(round(microtime(true) * 10), 0, '.', ''), //идентификатор (код) заказа (*автоматически*)
    'country'         => 'UA',                         // Географическое направление заказа
    'office'          => '24',                          // Офис (id в CRM)
    'products'        => $products,                    // массив с товарами в заказе
    'bayer_name'      => $_REQUEST['name'],            // покупатель (Ф.И.О)
    'phone'           => $_REQUEST['phone'],           // телефон
    'email'           => $_REQUEST['email'],           // электронка
    'comment'         => $_REQUEST['product_name'],    // комментарий
    'delivery'        => $_REQUEST['delivery'],        // способ доставки (id в CRM)
    'delivery_adress' => $_REQUEST['delivery_adress'], // адрес доставки
    'payment'         => '',                           // вариант оплаты (id в CRM)
    'sender'          => $sender,
    'utm_source'      => $_SESSION['utms']['utm_source'],  // utm_source
    'utm_medium'      => $_SESSION['utms']['utm_medium'],  // utm_medium
    'utm_term'        => $_SESSION['utms']['utm_term'],    // utm_term
    'utm_content'     => $_SESSION['utms']['utm_content'], // utm_content
    'utm_campaign'    => $_SESSION['utms']['utm_campaign'], // utm_campaign
    'additional_1'    => '',                               // Дополнительное поле 1
    'additional_2'    => '',                               // Дополнительное поле 2
    'additional_3'    => '',                               // Дополнительное поле 3
    'additional_4'    => ''                                // Дополнительное поле 4
);


// запрос
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'http://wheatbar.lp-crm.biz/api/addNewOrder.html');
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
$out = curl_exec($curl);
curl_close($curl);
//$out – ответ сервера в формате JSON


$chat_id = '-866193565';
$token = '5697162585:AAF42uXFpSlMIe1m5qE_SfTdhVtRkz3rynY';

$nameFieldset = "Имя: ";
$phoneFieldset = "Телефон: ";
$productFieldset = "Оффер: ";
$priceFieldset = "Цена: ";
$delivery_adressFieldset = "Адресс доставки: ";

$name = $_REQUEST['name'];
$phone = $_REQUEST['phone'];

$arr = array(
    'Новый заказ! ' => $_SERVER['HTTP_HOST'],
    $nameFieldset => $_REQUEST['name'],
    $phoneFieldset => $_REQUEST['phone'],
    // $delivery_adressFieldset => $_REQUEST['delivery_adress'],
    // $productFieldset => 'Vodka',
    // $priceFieldset => '? грн',
    // 'Сайт: ' => $website,
);


foreach ($arr as $key => $value) {
    $txt .= "<b>" . $key . "</b> " . $value . "\n";
};
$txt = urlencode($txt);
$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}&disable_web_page_preview=true", "r");


if ($sendToTelegram) {

    $res = [
        'type' => 'success',
        'msg' => 'Дякую! Ваше замовлення прийнято!',
    ];

    $res = json_encode($res);
    echo $res;
} else {
    $res = [
        'type' => 'error',
        'msg' => 'Сталась помилка, спробуйте ще!',
    ];

    $res = json_encode($res);
    echo $res;
}
