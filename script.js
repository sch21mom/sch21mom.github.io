// База данных на 10 открыток со случайными кодами для защиты от подбора
const CARDS_DATA = {
    1: {
        code: "f8k2m9",
        title: "Мамочка, ты — моё сердце!",
        text: "Спасибо за каждую твою улыбку, за поддержку в трудную минуту и за то, что всегда веришь в меня. С Днём матери!",
        image: "images/1.webp"
    },
    2: {
        code: "x3p7w1",
        title: "Самой нежной и заботливой",
        text: "Пусть твои глаза всегда сияют от счастья, а поводов для радости будет больше, чем звёзд на небе. Люблю тебя!",
        image: "images/2.webp"
    },
    3: {
        code: "q9z4n6",
        title: "Спасибо за всё, мама!",
        text: "За тёплые объятия, мудрые советы и самую вкусную еду на свете. Будь здорова и бесконечно счастлива!",
        image: "images/3.webp"
    },
    4: {
        code: "v2b8r5",
        title: "Мой главный человек",
        text: "Где бы я ни был, я всегда чувствую твою любовь и тепло. Пусть каждый твой день будет похож на праздник!",
        image: "images/4.webp"
    },
    5: {
        code: "m7t1j4",
        title: "С праздником, любимая мама!",
        text: "Желаю тебе побольше отдыха, вдохновения и исполнения самых заветных желаний. Ты заслуживаешь всего самого лучшего!",
        image: "images/5.webp"
    },
    6: {
        code: "d5h9c2",
        title: "Ты — мой супергерой!",
        text: "Никто не умеет решать любые проблемы так, как ты. Спасибо за твоё терпение и доброе сердце!",
        image: "images/6.webp"
    },
    7: {
        code: "y6g3s8",
        title: "Самой красивой маме",
        text: "Пусть в душе всегда цветёт весна, а рядом будут только любящие и близкие люди. Обнимаю крепко-крепко!",
        image: "images/7.webp"
    },
    8: {
        code: "w4l8p2",
        title: "Источник света и добра",
        text: "Мама, ты делаешь этот мир лучше просто тем, что ты есть. Спасибо за жизнь и за твоё бесконечное тепло!",
        image: "images/8.webp"
    },
    9: {
        code: "r1n5x7",
        title: "Бесконечно люблю тебя!",
        text: "Пусть тревоги обходят наш дом стороной, а в твоей жизни будет как можно больше ярких и счастливых моментов!",
        image: "images/9.webp"
    },
    10: {
        code: "z8k4v3",
        title: "С Днём Матери, родная!",
        text: "Ты — мой лучший друг и главный пример во всём. Здоровья тебе, радости и побольше поводов для гордости!",
        image: "images/10.webp"
    }
};

const TOTAL_CARDS = 10;
const STORAGE_KEY = 'mothers_day_found_cards';

// 1. Ищем открытку по секретному коду из URL (?c=...)
const urlParams = new URLSearchParams(window.location.search);
const codeParam = urlParams.get('c');

let currentId = null;
for (const [id, data] of Object.entries(CARDS_DATA)) {
    if (data.code === codeParam) {
        currentId = parseInt(id);
        break;
    }
}

// Если зашли по неверной ссылке или без кода — показываем 1-ю открытку, но НЕ засчитываем её в квест
const isValidScan = currentId !== null;
if (!isValidScan) {
    currentId = 1;
}

// 2. Отрисовываем текущую открытку
const card = CARDS_DATA[currentId];
document.getElementById('cardNumberBadge').textContent = `Открытка #${currentId}`;
document.getElementById('cardTitle').textContent = card.title;
document.getElementById('cardText').textContent = card.text;
document.getElementById('cardImage').src = card.image;

// 3. Работа с LocalStorage (сохраняем только если код из QR верный)
let foundCards = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const isNewFind = isValidScan && !foundCards.includes(currentId);

if (isNewFind) {
    foundCards.push(currentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundCards));
}

// 4. Обновляем интерфейс квеста
const questTitle = document.getElementById('questStatusTitle');
if (!isValidScan) {
    questTitle.textContent = "Найди QR-коды в школе!";
} else if (foundCards.length === 1 && isNewFind) {
    questTitle.textContent = "Ты нашёл первую открытку!";
} else if (isNewFind) {
    questTitle.textContent = `Отлично! Открытка #${currentId} добавлена в коллекцию!`;
} else {
    questTitle.textContent = `Эта открытка (#${currentId}) уже есть в твоей коллекции`;
}

document.getElementById('foundCount').textContent = foundCards.length;

// Рисуем сетку 1..10
const progressGrid = document.getElementById('progressGrid');
for (let i = 1; i <= TOTAL_CARDS; i++) {
    const item = document.createElement('div');
    item.className = 'progress-item';
    if (foundCards.includes(i)) item.classList.add('found');
    if (isValidScan && i === currentId) item.classList.add('current');
    item.textContent = foundCards.includes(i) ? '✓' : i;
    progressGrid.appendChild(item);
}

// 5. Проверка победы (собраны все 10)
if (isValidScan && foundCards.length >= TOTAL_CARDS) {
    setTimeout(() => {
        document.getElementById('winModal').classList.add('active');
    }, 600);
}

function closeModal() {
    document.getElementById('winModal').classList.remove('active');
}

// 6. Кнопка "Отправить маме"
document.getElementById('shareBtn').addEventListener('click', async () => {
    const shareText = `${card.title}\n\n${card.text}\n\nОткрытка для тебя: ${window.location.href}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: card.title,
                text: `${card.title}\n\n${card.text}`,
                url: window.location.href
            });
        } catch (err) {}
    } else {
        copyToClipboard(shareText);
    }
});

// Кнопка "Скопировать текст"
document.getElementById('copyBtn').addEventListener('click', () => {
    const textToCopy = `${card.title}\n\n${card.text}`;
    copyToClipboard(textToCopy);
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = "✅ Скопировано! Вставь в чат маме";
        setTimeout(() => btn.textContent = originalText, 2500);
    });
}

// 7. Прячем плашку "Пролистай вниз" при скролле
const scrollBadge = document.getElementById('scrollBadge');
window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
        scrollBadge.classList.add('hidden');
    } else {
        scrollBadge.classList.remove('hidden');
    }
});
