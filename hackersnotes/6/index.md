<h1>(Ettercap, Burp Suite). MITM. Часть 3. Использование Burp Suite в атаках MITM. Подмена запроса.</h1>

<b>Материал предоставлен в ознакомительных и образовательных целях.</b><br>

<b><i>Содержание</i></b><br>
<a href="#introduction">1. Введение. Требования.</a><br>
<a href="#ettercap">2. Запускаем Ettercap.</a><br>
<a href="#burpsuite">3. Запускаем Burp Suite.</a><br>
<a href="#action">4. Подмена запросов.</a><br>
<a href="#end">5. Подведение итогов. Рекомендации по защите. Полезные ссылки.</a><br>


<p><a name="introduction"></a></p>
<h2>Введение. Требования.</h2>
Рад приветствовать читателей. Мы продолжаем использовать Burp Suite в атаках MITM и в этой статье мы разберем подмену запросов при помощи Burp Suite.<br><br>

<i>Если вы не читали предыдущие две статьи по MITM, обязательно прочитайте их перед этой. Там рассмотрены понятие MITM, использование Ettercap, Bettercap, net-creds и Burp Suite</i>

Требования:
<ul>
  <li>Иметь доступ к сети, в которой находится цель</li>
</ul>
<i>Примечание: </i> если у вас уже есть доступ к сети, вам не нужен Wi-Fi адаптер с поддержкой режима 
мониторинга. Главное быть просто подключенным к сети.


<p><a name="ettercap"></a></p>
<h2>Запускаем Ettercap.</h2>
Заходим под рута:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo su</pre>
Запускаем Ettercap:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">ettercap -G</pre>

<ul>
  <li>Когда откроется окно Ettercap, выберите интерфейс, который хотите использовать и нажмите ОК.</li>
  <li>Нажмите на кнопку Show hosts (у нее иконка сервера)</li>
  <li>Нажмите на лупу для того, чтобы начать поиск хостов (если нужного не появилось, попробуйте еще раз)</li>
  <li>Выберите IP адрес роутера как цель 1</li>
  <li>Выберите IP адрес атакуемого как цель 2</li>
  <li>Нажмите на меню MITM</li>
  <li>Выберите ARP Poisoning, убедитесь, что стоит галочка Sniff remote connections и нажмите ОК</li>
</ul>


<p><a name="burpsuite"></a></p>
<h2>Запускаем Burp Suite.</h2>
(в другом терминале) 
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo su</pre>

Чтобы перенаправлять данные с порта 80 на 8080:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 8080</pre>

Запустите Burp Suite.
<ul>
  <li>
    Во вкладке Proxy перейдите в подраздел Options
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;В разделе Proxy Listeners нажмите кнопку Add
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;В поле Bind to port укажите порт 8080
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;В списке выберите Specific address и в выпадающем меню выберите IP-адрес, который начинается на 192.168.0/1.
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Во вкладке Request Handling поставьте галочку “Support invisible proxying”
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Нажмите ОК
  </li>
</ul>

После этого, перейдите в подраздел Intercept во вкладке Proxy и ждите, пока атакуемое устройство сделает запрос по http:// (использование Bettercap на порте 8080 невозможно, другой порт я не пробовал (возможно, будет работать), чистый Ettercap с модулем SSLStrip - не вариант, т.к. там SSLStrip устаревший)


<p><a name="action"></a></p>
<h2>Подмена запросов.</h2>
Рассмотрим несколько примеров: подмена User Agent и перенаправление пользователя на страницу 400.<br><br>

<b>Подмена User Agent</b>
Когда атакуемый (или какая-либо программа) сделает запрос на сервер по http:// (либо, если вы сможете запустить Bettercap с SSLStrip, по https://, но после понижения протокола - по http://), в Burp Suite появится сообщение об этом и поле с запросом. Вы можете изменить строчку User Agent и отправить запрос.<br><br>
<i><b>Применение.</b> Какая-либо программа отправила запрос на сервер обновлений для того, чтобы узнать, есть ли обновления. У пользователя установлена последняя версия программы, однако вы меняете User Agent в запросе на более старую версию. Сервер отвечает, что есть более новая версия. Однако, в этом ответе вы подменяете адрес ссылки последней версии программы на свой исполняемый файл с полезной нагрузкой.</i><br><br><br>

<b>Перенаправление пользователя на страницу 400</b>
Когда атакуемый захочет открыть какой-либо сайт в браузере, но не укажет https://, или сайт по http://, или на сайте нет HSTS, то вам в Burp Suite придет сообщение об этом и поле с запросом. Вы меняете, GET HTTP/1.1 на (например) GET HTTP/120. Это некоррректный запрос и пользователя перенаправляет на страницу 400.<br><br>
<i><b>Применение.</b> Страница с сообщением об ошибке 400 не всегда зашифрована. Вы можете подцепить браузер на BeEF (если пользователь не закроет вкладку).</i>


<p><a name="end"></a></p>
<h2>Подведение итогов. Рекомендации по защите. Полезные ссылки.</h2>
<h3>Полезные ссылки.</h3>
<ul>
  <li><a href="https://hackware.ru/?p=872&PageSpeed=noscript" target="_blank">Hackware: Использование Burp Suite в сценариях атаки MITM</a></li>
  <li><a href="https://hackware.ru/?p=784&PageSpeed=noscript" target="_blank">Hackware: Базовое использование BeEF</a></li>
  <li><a href="https://hackware.ru/?p=917&PageSpeed=noscript" target="_blank">Hackware: Инструкция по Ettercap</a></li>
</ul>

<h3>Рекомендации по защите.</h3>
<ul>
  <li>Не использовать открытые сети Wi-Fi</li>
  <li>Поддерживать безопасность личной сети Wi-Fi, иначе будет равноценна открытой сети</li>
  <li>Использовать расширение NoScript (<a href="https://chrome.google.com/webstore/detail/noscript/doojmbjmlfjjnbmnoijecmcbfeoakpjm" target="_blank">Chrome Web Store</a> | <a href="https://addons.mozilla.org/en-US/firefox/addon/noscript/" target="_blank">Firefox Browser Add-ons</a>)</li>
</ul>

Итак, мы познакомились с подменой запросов при помощи Burp Suite.<br><br>
<a href="../index">Назад к списку статей...</a>
