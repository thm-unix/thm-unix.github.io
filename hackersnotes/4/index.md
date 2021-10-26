<h1>(Bettercap, net-creds). MITM. Часть 1. Введение в атаку MITM. Перехват данных в локальной сети.</h1>

<b>Материал предоставлен в ознакомительных и образовательных целях.</b><br>

<b>Внимание! В этой теме очень часто что-нибудь меняется. Следите за обновлениями. Если гайд стал
некорректным, а я этого не заметил, пишите на highsierra.2007@mail.ru</b><br>
<i>Последнее обновление: </i> 26.10.2021

<b><i>Содержание</i></b><br>
<a href="#introduction">1. Введение. Требования.</a><br>
<a href="#introtomitm">2. Понятие атаки MITM.</a><br>
<a href="#prepare">3. Подготовка среды.</a><br>
<a href="#bettercap">4. Запускаем Bettercap.</a><br>
<a href="#netcreds">5. Запускаем net-creds.</a><br>
<a href="#example">6. Пример перехваченных данных.</a><br>
<a href="#end">8. Подведение итогов. Рекомендации по защите. Полезные ссылки.</a><br>

<p><a name="introduction"></a></p>
<h2>Введение. Требования.</h2>
Рад приветствовать читателей. В этой статье мы разберем что такое атака MITM, когда она применима
и попробуем ее произвести.
Требования:
<ul>
  <li>Иметь доступ к сети, в которой находится цель</li>
</ul>
<i>Примечание: </i> если у вас уже есть доступ к сети, вам не нужен Wi-Fi адаптер с поддержкой режима 
мониторинга. Главное быть просто подключенным к сети.

<p><a name="introtomitm"></a></p>
<h2>Понятие атаки MITM.</h2>
MITM (Man In The Middle - Человек Посередине) - атака, суть которой заключается в том, чтобы
встать посередине соединения цели с роутером и перехватывать данные. <br><br>

<img src="mitm-attack.png" width="40%" height="40%">

<h3>Немного истории</h3>
<ul>
  <li>
  Когда все сайты были по http://, атака MITM была очень эффективной, получалось перехватить все данные. <br>
Однако, для того, чтобы этому противостоять, был создан протокол https://, который подразумевает шифрование данных. Вроде бы проблема должна была быть
    решена, однако, никто принудительно не заставлял использовать https.</li>
  <li>В итоге получалось с помощью утилиты SSLStrip убрать букву s из https:// и получить http://, что снова позволяло перехватывать данные.</li>
<li>В противодействие этому был придуман HSTS. Он принудительно переводит на страницу по https:// (а если это невозможно, зайти на сайт не получится). Однако,
HSTS - это просто кука, которую пользователь должен каким-либо образом получить. Т.е., если пользователь
пользуется режимом инкогнито, либо очищает куки при закрытии браузера, либо посещает сайт первый раз,
  этой куки у него нет, и есть вероятность, что пользователь все равно попадет на http://. </li> 
  <li>Тогда последним 
шагом к защите пользователей от атаки MITM, стало включение во все браузеры списка сайтов, которые должны 
    открываться только по https://. Туда входят все крупные сайты. </li> 
</ul>

Проверить, выйдет ли у вас что-нибудь во время сегодняшней атаки, вы можете, введя желаемый адрес сайта здесь: 
<a href="https://hstspreload.org" target="_blank">hstspreload.org</a>

<p><a name="prepare"></a></p>
<h2>Подготовка среды.</h2>
Начнем с простого и установим Bettercap в нашу систему:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo apt update && sudo apt install bettercap</pre>
Далее нам предстоит установить net-creds. Если бы сейчас перед нами был не Kali Linux, а тот же Arch Linux, то хватило бы двух команд, но в Debian, Kali Linux, Ubuntu и множестве других дистрибутивов прекратили поддержку Python 2, а net-creds написан именно на нем. Поэтому, первым делом, добываем себе PIP для Python 2 и устанавливаем его:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">wget https://bootstrap.pypa.io/pip/2.7/get-pip.py && python2 get-pip.py</pre> // если из дистрибутивов уберут и сам пакет python2, то по-видимому, мне придется делать форк net-creds но переделанный уже на Python 3, ибо забросили его.<br><br>
Переходим в директорию, куда был только что установлен PIP:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">cd ~/.local/bin</pre>
Обновляем пакет setuptools, т.к. со старой версией последующие пакеты не установятся.
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">./pip2 install --upgrade setuptools</pre>
Устанавливаем модули scapy и wsgiref
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">./pip2 install scapy wsgiref</pre>
Т.к. мы запустили pip2 от имени обычного пользователя, то модуль scapy установился в домашнюю директорию пользователя. Все бы хорошо, но net-creds мы запускаем от рута, а значит Python будет искать модули в /usr/lib, копируем scapy туда. Прошу обратить внимание на то, что pip установил их в директорию с модулями Python 3, а не 2 и нужно скопировать установленный нами модуль туда, куда нужно:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sudo mkdir /usr/lib/python2.7/dist-packages/scapy && sudo cp -avr /usr/lib/python3/dist-packages/scapy/* /usr/lib/python2.7/dist-packages/scapy</pre>
Возвращаемся в домашнюю директорию и клонируем репозиторий net-creds.
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">cd ~ && git clone https://github.com/DanMcInerney/net-creds.git</pre>
