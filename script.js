document.getElementById('run-code').addEventListener('click', runCode);

document.getElementById('paste-code').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (text.includes('<html>')) {
            document.getElementById('html-code').value = text;
        } else if (text.includes('<style>')) {
            document.getElementById('css-code').value = text;
        } else if (text.includes('<script>')) {
            document.getElementById('js-code').value = text;
        } else {
            alert('Unrecognized code format.');
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
});

document.getElementById('theme-switcher').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.querySelectorAll('textarea').forEach(textarea => textarea.classList.toggle('dark'));
    const themeIcon = document.querySelector('#theme-switcher .material-icons');
    themeIcon.textContent = document.body.classList.contains('dark') ? 'light_mode' : 'dark_mode';
});

document.getElementById('download-code').addEventListener('click', () => {
    const htmlCode = document.getElementById('html-code').value;
    const cssCode = document.getElementById('css-code').value;
    const jsCode = document.getElementById('js-code').value;

    const zip = new JSZip();
    zip.file("index.html", htmlCode);
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);

    zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, "code.zip");
    });
});

document.getElementById('save-progress').addEventListener('change', (event) => {
    if (event.target.checked) {
        localStorage.setItem('htmlCode', document.getElementById('html-code').value);
        localStorage.setItem('cssCode', document.getElementById('css-code').value);
        localStorage.setItem('jsCode', document.getElementById('js-code').value);
    } else {
        localStorage.removeItem('htmlCode');
        localStorage.removeItem('cssCode');
        localStorage.removeItem('jsCode');
    }
});

document.getElementById('reset-code').addEventListener('click', () => {
    document.getElementById('html-code').value = '';
    document.getElementById('css-code').value = '';
    document.getElementById('js-code').value = '';
    document.getElementById('output').innerHTML = '';
});

document.getElementById('live-update').addEventListener('change', (event) => {
    if (event.target.checked) {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', runCode);
        });
    } else {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.removeEventListener('input', runCode);
        });
    }
});

document.getElementById('toggle-inputs').addEventListener('change', (event) => {
    const cssInput = document.getElementById('css-code');
    const jsInput = document.getElementById('js-code');
    if (event.target.checked) {
        cssInput.style.display = 'none';
        jsInput.style.display = 'none';
    } else {
        cssInput.style.display = 'block';
        jsInput.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('htmlCode') && localStorage.getItem('cssCode') && localStorage.getItem('jsCode')) {
        document.getElementById('html-code').value = localStorage.getItem('htmlCode');
        document.getElementById('css-code').value = localStorage.getItem('cssCode');
        document.getElementById('js-code').value = localStorage.getItem('jsCode');
    }

    const examples = [
        {
            name: 'Hello World',
            icon: 'public',
            html: '<h1>Hello World</h1>',
            css: 'h1 { color: red; }',
            js: 'console.log("Hello World");'
        },
        {
            name: 'Button Click',
            icon: 'touch_app',
            html: '<button id="myButton">Click me</button>',
            css: '#myButton { color: blue; }',
            js: 'document.getElementById("myButton").onclick = function() { alert("Button clicked!"); };'
        },
        {
            name: 'Change Background',
            icon: 'palette',
            html: '<button id="bgButton">Change Background</button>',
            css: 'body { transition: background-color 0.3s; }',
            js: 'document.getElementById("bgButton").onclick = function() { document.body.style.backgroundColor = "lightblue"; };'
        },
        {
            name: 'Clock',
            icon: 'schedule',
            html: '<div id="clock"></div>',
            css: '#clock { font-size: 24px; color: green; }',
            js: 'setInterval(() => { document.getElementById("clock").innerText = new Date().toLocaleTimeString(); }, 1000);'
        },
        {
            name: 'Counter',
            icon: 'exposure_plus_1',
            html: '<button id="increment">Increment</button><p id="counter">0</p>',
            css: '#increment { margin-right: 10px; } #counter { display: inline; }',
            js: 'document.getElementById("increment").onclick = () => { const counter = document.getElementById("counter"); counter.innerText = parseInt(counter.innerText) + 1; };'
        }
    ];

    const exampleMenu = document.getElementById('examples-menu');

    examples.forEach((example, index) => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="material-icons">${example.icon}</span> ${example.name}`;
        button.addEventListener('click', () => {
            document.getElementById('html-code').value = example.html;
            document.getElementById('css-code').value = example.css;
            document.getElementById('js-code').value = example.js;
            runCode();
            document.title = example.name;
            document.querySelector("link[rel='icon']").href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22black%22><text y=%2220%22 font-size=%2224%22>${example.icon}</text></svg>`;
        });
        exampleMenu.appendChild(button);
    });
});

document.getElementById('report-bug').addEventListener('click', () => {
    window.open('https://github.com/DevMikey123/testyour.html/issues', '_blank');
});

function runCode() {
    const htmlCode = document.getElementById('html-code').value;
    const cssCode = document.getElementById('css-code').value;
    const jsCode = document.getElementById('js-code').value;

    const output = document.getElementById('output');
    const blob = new Blob([`
        <html>
        <head>
            <style>${cssCode}</style>
        </head>
        <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
        </body>
        </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    output.innerHTML = '';
    output.appendChild(iframe);
}
