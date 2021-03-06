# Хакинтош
<b><i>Содержание</i></b><br>
<a href="#introduction">1. Введение. Базовые понятия.</a><br>
<a href="#requirements">2. Требования к компьютеру. Выбор версии macOS.</a><br>
<a href="#prepareusb">3. Запись флешки.</a><br>
<a href="#installation">4. Установка.</a><br>
<a href="#postinstall">5. Post-Install.</a><br>
<a href="#laptops">6. Ноутбуки</a><br>
<a href="#oldhardware">7. Старое железо</a><br>
<a href="#fixproblems">8. Устранение неполадок.</a><br>
<a href="#incompatiblehardware">9. Несовместимое железо.</a><br>
<a href="#faq">10. FAQ</a>

<i>Если найдете ошибку в гайде, пишите в Issues</i>

<p><a name="introduction"></a></p>
<h2>Введение. Базовые понятия.</h2>
Рад приветствовать читателей! В этой заметке мне хотелось бы разобрать тему хакинтоша. Начнем.<br>
<h3>Базовые понятия.</h3>
<table>
  <tr>
    <th>Термин</th>
    <th>Определение</th>
  </tr>
  
  <tr>
    <td><b>Хакинтош</b></td>
    <td>Mac OS X, установленная на не-Apple компьютер</td>
  </tr>
  
  <tr>
    <td><b>Кекст</b></td>
    <td>Кекст (от англ. Kext - Kernel Extension - расширение ядра) - своего рода драйвер для Mac OS X.</td>
  </tr>
  
  <tr>
    <td><b>Загрузчик</b></td>
    <td>Программа, которая запускает ОС. Для хакинтоша: Clover/Chameleon/OpenCore/...</td>
  </tr>
  
  <tr>
    <td><b>Паника ядра</b></td>
    <td>Критическая ошибка во время работы ядра, ОС не может продолжать работу до перезагрузки.</td>
  </tr>
  
  <tr>
    <td><b>SMBIOS</b></td>
    <td>Идентификатор компьютера, по которому Mac OS X определяет модель Mac. Пример: <i>MacBookPro15,1</i></td>
  </tr>
</table>

<p><a name="requirements"></a></p>
<h2>Требования к компьютеру. Выбор версии macOS.</h2>
Сразу скажу, что в данной части заметки мы будем рассматривать установку новых версий macOS (10.12 - 11). Про установку на старое железо (<= 10.11), читайте в <a href="#oldhardware">пункте 7</a>
<h3>Требования к компьютеру.</h3>
<table>
  <tr>
    <th>Что?</th>
    <th>Какое?</th>
  </tr>
  
  <tr>
    <td>Процессор</td>
    <td>Core i3/i5/i7 only</td>
  </tr>
  
  <tr>
    <td>ОЗУ</td>
    <td>>= 4 ГБ</td>
  </tr>
  
  <tr>
    <td>Графика</td>
    <td><u><b>ЛИБО</b></u> совместимая интегрированная,<br><u><b>ЛИБО</b></u> совместимая независимая<br>(мы идем по пути наименьшего<br>сопротивления)</td>
  </tr>
  
  <tr>
    <td>Тип BIOS</td>
    <td>UEFI крайне желательно<br>(Legacy теоретически возможен,<br>но лучше UEFI)</td>
  </tr>
  
  <tr>
    <td>Монитор подключен</td>
    <td>по HDMI</td>
  </tr>
</table>

Запомните, при желании и наличии времени хакинтош можно поднять практически на любом ведре (Амудне / Pentium / Celeron / Atom / whatever else). Вопрос в том, насколько он будет хорошо работать и сколькими костылями вам придется воспользоваться. Как я уже сказал, в данной части заметки, <i>мы идем по пути наименьшего сопротивления</i> и пока что ставить хак будем на близкое к нативному железо.<br><br>
Установка на Legacy старых версий будет рассмотрена в разделе "Старое железо"
<h3>Выбор версии macOS.</h3>
Выбор версии macOS осуществляется по нескольким признакам:
<ul>
  <li>Все ли нужные конкретной версии macOS инструкции поддерживает ваш процессор?</li>
  <li>Поддерживается ли ваша видеокарта конкретной версией macOS?</li>
  <li>Наличие кекстов/драйверов для переферии (звук/сеть/...)</li>
</ul>
За этими данными нужно идти на форумы (<a href="https://www.tonymacx86.com/">tonymacx86</a>, <a href="https://www.insanelymac.com/">InsanelyMac</a>, и др.)
Если вы нашли несколько подходящих вам версий macOS, выбирайте среди них на свой вкус.

<p><a name="prepareusb"></a></p>
<h2>Запись флешки.</h2>

Итак, теперь, когда мы разобрались с железом и версией, нужно скачать образ и записать его на флешку. Конечно, идеальным вариантом было бы сделать свою флешку, записав чистый оригинальный образ macOS на флешку, а затем установить на нее загрузчик и положить жизненно-важные кексты, но предположим, что у вас нет под рукой компьютера Mac или хакинтоша, а возможности установить macOS на виртуальную машину нет. В таком случае, придется воспользоваться готовым образом с рутрекера. Большинство из них идут в виде ISO файла, который содержит в себе сам образ macOS (.rdr), программу R-Drive Image, а также Bootice с загрузочным сектором (которые в случае с UEFI нам не пригодятся).<br><br>

Для начала нам потребуется флешка желательно 32 ГБ.<br><br>

### Форматируем флешку через diskpart

Запускаем командную строку и выполняем команды по очереди:
<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">diskpart</pre>

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">lis dis</pre>
Ищем нашу флешку по размеру

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sel dis [n]</pre>, где [n] - номер нужного диска в lis dis, без скобок

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">clean</pre>

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">cre par pri</pre>

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">sel par 1</pre>

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">act</pre>

<pre class="hljs" style="display: block; overflow-x: auto; padding: 0.5em; background: rgb(240, 240, 240) none repeat scroll 0% 0%; color: rgb(68, 68, 68);">for fs=fat32 quick</pre>

По окончании процесса закрываем командную строку.<br><br>

### Установка R-Drive и запись флешки
<ul>
  <li>Я рекомендую примонтировать ISO-файл, который вы скачали с рутрекера при помощи UltraISO.</li>
  <li>Установите R-Drive по принципу Next, Next, Next.</li>
  <li>Запустите R-Drive</li>
  <li>Нажмите Далее, затем Восстановить из образа</li>
  <li>Выберите RDR-файл, лежащий в образе диска и нажмите Далее</li>
  <li>Нажмите Далее</li>
  <li>Теперь сверху находятся разделы образа, а снизу флешки. Нажмите на бОльший из разделов в образе (он должен подсветиться красным цветом), а затем нажмите на пока что единственный раздел на флешке (он тоже подсветится красным цветом). Нажмите Далее</li>
  <li>Тип раздела: Основной; ФС: HFS+; Буква диска: Не подключать. Нажмите Далее</li>
  <li>Нажмите Добавить другой объект и нажмите Далее</li>
  <li>Теперь выберите мЕньший из разделов в образе (это загрузчик) и оставшийся раздел на флешке</li>
  <li>Тип раздела: Основной (активный); ФС: FAT32; Буква диска: По умолчанию. Нажмите Далее</li>
  <li>Сразу начать выполнять действие. Начать</li>
  <li>Ожидайте окончания процесса. В некоторых раздачах рутрекера пишут, что если в конце может появиться ошибка, и что все нормально. У меня таких ошибок не появлялось.</li>
</ul>


<p><a name="installation"></a></p>
<h2>Установка.</h2>
Еще перед включением, убедитесь, что в USB вставлена только клавиатура, мышь и флешка. Все должно быть вставлено по USB 2. Если у вас очень новая материнская плата и есть только USB 3, можете попробовать, но скорее всего, придется класть дополнительные кексты для завода USB 3 на стадии установки, иначе получите 'Still waiting for root device'.<br>

### Настройка BIOS
<ul>
  <li>Первое, что мы делаем - сбрасываем BIOS до заводских настроек</li>
  <li>Включите режим AHCI</li>
  <li>На время установки выключите виртуализацию</li>
  <li>Выключите Secure Boot (в большинстве случаев для этого нужно задать пароль администратора и потом выключить Secure Boot, после этого пароль можно будет убрать)</li>
  <li>(если будете использовать нативную независимую графику) Выключить интегрированную графику и наоборот</li>
  <li>На время установки выключить поддержку USB 3 (xHCI) (если конечно, не тот случай, когда портов USB 2 на плате просто нет)</li>
  <li>Выходим с сохранением настроек</li>
</ul>

### Загружаемся с флешки
Загружаемся с флешки и видим перед собой Clover. Заходим в настройки. Пройдемся по основным пунктам.<br>
<ul>
  <li>
    Начнем с пункта Boot Args. Существует огромное количество аргументов загрузки. Давайте представим, что у вас близкое к нативному железо и все должно завестись из коробки. В таком случае здесь будет достаточно прописать -v. Это нужно, чтобы загрузка до графики шла в текстовом режиме. В случае зависания загрузки, можно будет узнать, почему она зависла (распространенные проблемы - см. Устранение неполадок).
  </li>
  <li>
    Далее рассмотрим пункт SMBIOS. Зайдем в него и посмотрим, как определил Clover наш компьютер. С таблицей SMBIOS можете ознакомиться в пункте Post-Install. Как правило, Clover автоматически выбирает оптимальное значение, однако вы его можете изменить, если считаете, что то, что выбрали вы, подходит больше или с этим SMBIOS установка не стартует. Не забудьте изменить оба пункта: и Product Name, и Board Version.
  </li>
  <li>
    Последний пункт, который нам может понадобиться (а может и не понадобиться) - Graphics Injector. Сначала попробуйте запуститься без него, но если не получится (компьютер будет перезагружаться или будет висеть на загрузке), включите один из Inject'ов. Тут зависит от того, какая видеокарта. Понятно, что на NVIDIA - Inject NVIDIA, на встроенной графике Intel - Inject Intel.
  </li>
</ul>
