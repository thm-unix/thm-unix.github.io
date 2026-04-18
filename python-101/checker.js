let pyodide;
let tests;

async function loadPyodideOnce() {
	if (!pyodide) {
		document.getElementById('output').innerHTML = 'Загрузка Pyodide...\n\n';
		pyodide = await loadPyodide();
	}
	return pyodide;
}

async function loadTask() {
	const params = new URLSearchParams(location.search);
	const lessonId = params.get("lessonId");
	const taskId = params.get("taskId");
	let jsonTaskData;
	// https://thm-unix.github.io/python-101/
	const url = 'lesson' + lessonId + '/' + taskId + '/task.json'
	const response = await fetch(url);
	const taskInfo = await response.json();
	
	document.getElementById('task-title').textContent = taskInfo['title'];
	document.getElementById('task-text').textContent = taskInfo['text'];
	tests = taskInfo['test_suite']
	console.log(tests)
}

async function runTests() {
	const outputDiv = document.getElementById('output');
	const userCode = document.getElementById('code-box').value.trim();
	outputDiv.innerHTML = 'Выполняю тесты...\n\n';

	const py = await loadPyodideOnce();
	let passed = true;
	for (let i = 0; i < tests.length; ++i) {
		const test = tests[i];
		outputDiv.innerHTML += `Тест ${i+1}: `;
		try {
			const indentedCode = userCode.replace(/^/gm, '    ');
			const result = await py.runPythonAsync(`
import sys
from io import StringIO
sys.stdin = StringIO("""${test[0]}""")
sys.stdout = StringIO()
try:
${indentedCode}
    output = sys.stdout.getvalue().strip()
except Exception as e:
    output = f'ОШИБКА: {str(e)}'
output
			`);
			if (result.trim() === test[1]) {
				outputDiv.innerHTML += '✅ OK\n';
			}
			else {
				outputDiv.innerHTML += `❌ Неверный ответ (получено: <code>${result.trim()}</code>, ожидалось: <code>${test[1]}</code>)\n\n`;
				passed = false;
			}
		}
		catch (err) {
			outputDiv.innerHTML += `ОШИБКА: ${err.message}\n`;
			passed = false;
		}
	}
	if (passed) {
		outputDiv.innerHTML += '✅ Все тесты пройдены!';
	}
}

loadTask();