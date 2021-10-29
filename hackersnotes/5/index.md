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
    &nbsp;&nbsp;&nbsp;Пример: на доске объявлений в поле имя ввел <script>alert('Stored XSS')</script> и теперь каждый раз, когда кто-то заходит на страницу его профиля, он видит на экране сообщение 'Stored XSS'
  </li>
  
  <li>
    <b>Reflected XSS</b><br>
    &nbsp;&nbsp;&nbsp;Пример: http://myunsafewebsite.com/store/product.php?id=<script>alert('ReflectedXSS')</script>
  </li>
  
  <li>
    <b>DOM-Based XSS</b><br>
    &nbsp;&nbsp;&nbsp;Пример: http://myunsafewebsite.com/arictle/25/text.html#<script>alert('DOM-BasedXSS')</script>
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
  <li>Нажмите на кнопку Hosts (у нее иконка сервера), в некоторых случаях у вас может быть сверху меню Hosts, где вам нужен пункт Show hosts</li>
  <li></li>
</ul>
