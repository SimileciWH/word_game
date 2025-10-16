// CET-6 单词游戏主逻辑
class WordGame {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 10;
        this.score = 0;
        this.currentWordData = null;
        this.isAnswering = false;

        // 本地存储
        this.storage = {
            highScore: parseInt(localStorage.getItem('cet6HighScore') || '0'),
            recentScores: JSON.parse(localStorage.getItem('cet6RecentScores') || '[]')
        };

        // CET-6 单词库
        this.wordDatabase = [
            {
                word: "abundant",
                sentence: "The region has abundant natural resources, including oil and minerals.",
                options: ["丰富的", "稀缺的", "昂贵的", "危险的"],
                answerIndex: 0
            },
            {
                word: "accommodate",
                sentence: "The hotel can accommodate up to 500 guests for the conference.",
                options: ["拒绝", "容纳", "收费", "装饰"],
                answerIndex: 1
            },
            {
                word: "ambiguous",
                sentence: "The contract terms were ambiguous and needed clarification.",
                options: ["明确的", "模糊的", "合法的", "非法的"],
                answerIndex: 1
            },
            {
                word: "benevolent",
                sentence: "The benevolent old man donated money to help poor children.",
                options: ["恶意的", "仁慈的", "贫穷的", "富有的"],
                answerIndex: 1
            },
            {
                word: "coherent",
                sentence: "Her presentation was well-organized and coherent.",
                options: ["混乱的", "连贯的", "简短的", "冗长的"],
                answerIndex: 1
            },
            {
                word: "dilemma",
                sentence: "She faced the dilemma of choosing between career and family.",
                options: ["机会", "困境", "解决方案", "奖励"],
                answerIndex: 1
            },
            {
                word: "eloquent",
                sentence: "The senator gave an eloquent speech about education reform.",
                options: ["沉默的", "雄辩的", "愤怒的", "悲伤的"],
                answerIndex: 1
            },
            {
                word: "facilitate",
                sentence: "The new software will facilitate communication between departments.",
                options: ["阻碍", "促进", "简化", "复杂化"],
                answerIndex: 1
            },
            {
                word: "genuine",
                sentence: "Her concern for others is genuine and comes from the heart.",
                options: ["虚假的", "真诚的", "强迫的", "表面的"],
                answerIndex: 1
            },
            {
                word: "harsh",
                sentence: "The prisoners had to endure harsh living conditions.",
                options: ["舒适的", "恶劣的", "温暖的", "安全的"],
                answerIndex: 1
            },
            {
                word: "inevitable",
                sentence: "Change is inevitable in today's fast-paced world.",
                options: ["可能的", "不可能的", "可避免的", "不可避免的"],
                answerIndex: 3
            },
            {
                word: "juvenile",
                sentence: "The juvenile court system handles cases involving minors.",
                options: ["成年的", "青少年的", "老年的", "中年的"],
                answerIndex: 1
            },
            {
                word: "knack",
                sentence: "She has a knack for solving complex mathematical problems.",
                options: ["困难", "天赋", "厌恶", "恐惧"],
                answerIndex: 1
            },
            {
                word: "lenient",
                sentence: "The teacher was lenient and gave the students extra time.",
                options: ["严格的", "仁慈的", "愤怒的", "不耐烦的"],
                answerIndex: 1
            },
            {
                word: "meticulous",
                sentence: "The researcher was meticulous in documenting every detail.",
                options: ["粗心的", "细致的", "快速的", "缓慢的"],
                answerIndex: 1
            },
            {
                word: "notorious",
                sentence: "The area was notorious for high crime rates.",
                options: ["著名的", "臭名昭著的", "安全的", "繁荣的"],
                answerIndex: 1
            },
            {
                word: "obstacle",
                sentence: "Lack of funding was the main obstacle to the project.",
                options: ["机会", "帮助", "障碍", "解决方案"],
                answerIndex: 2
            },
            {
                word: "persistent",
                sentence: "His persistent efforts finally paid off when he got the promotion.",
                options: ["放弃的", "坚持的", "懒惰的", "聪明的"],
                answerIndex: 1
            },
            {
                word: "quarrel",
                sentence: "The neighbors had a quarrel over the property boundary.",
                options: ["友谊", "争吵", "合作", "协议"],
                answerIndex: 1
            },
            {
                word: "resilient",
                sentence: "Children are often more resilient than adults think.",
                options: ["脆弱的", "有韧性的", "强壮的", "虚弱的"],
                answerIndex: 1
            },
            {
                word: "skeptical",
                sentence: "Scientists are skeptical about claims that lack evidence.",
                options: ["相信的", "怀疑的", "确定的", "犹豫的"],
                answerIndex: 1
            },
            {
                word: "tremendous",
                sentence: "The project required tremendous effort and resources.",
                options: ["微小的", "巨大的", "普通的", "简单的"],
                answerIndex: 1
            },
            {
                word: "vulnerable",
                sentence: "Elderly people are often more vulnerable to diseases.",
                options: ["强壮的", "健康的", "脆弱的", "免疫的"],
                answerIndex: 2
            },
            {
                word: "withdraw",
                sentence: "He decided to withdraw from the competition due to injury.",
                options: ["参加", "获胜", "退出", "继续"],
                answerIndex: 2
            },
            {
                word: "zealous",
                sentence: "The zealous volunteers worked tirelessly to help others.",
                options: ["懒惰的", "热情的", "冷漠的", "愤怒的"],
                answerIndex: 1
            }
        ];

        this.usedWords = new Set();
        this.init();
    }

    init() {
        this.setupAudio();
        this.bindEvents();
        this.updateDisplay();
        this.loadNewWord();
    }

    setupAudio() {
        // 创建音频元素和音效
        const correctAudio = document.getElementById('correctSound');
        const wrongAudio = document.getElementById('wrongSound');

        // 创建简单的音效数据
        this.createSimpleSounds();
    }

    createSimpleSounds() {
        // 创建正确答案音效 (上升音调)
        const correctAudio = document.getElementById('correctSound');
        const correctContext = new (window.AudioContext || window.webkitAudioContext)();

        // 创建错误答案音效 (下降音调)
        const wrongAudio = document.getElementById('wrongSound');
        const wrongContext = new (window.AudioContext || window.webkitAudioContext)();

        // 播放正确音效的方法
        this.playCorrectSound = () => {
            const oscillator = correctContext.createOscillator();
            const gainNode = correctContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(correctContext.destination);

            oscillator.frequency.setValueAtTime(523.25, correctContext.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(659.25, correctContext.currentTime + 0.1); // E5
            oscillator.frequency.exponentialRampToValueAtTime(783.99, correctContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(0.3, correctContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, correctContext.currentTime + 0.5);

            oscillator.start(correctContext.currentTime);
            oscillator.stop(correctContext.currentTime + 0.5);
        };

        // 播放错误音效的方法
        this.playWrongSound = () => {
            const oscillator = wrongContext.createOscillator();
            const gainNode = wrongContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(wrongContext.destination);

            oscillator.frequency.setValueAtTime(349.23, wrongContext.currentTime); // F4
            oscillator.frequency.exponentialRampToValueAtTime(293.66, wrongContext.currentTime + 0.1); // D4
            oscillator.frequency.exponentialRampToValueAtTime(261.63, wrongContext.currentTime + 0.2); // C4

            gainNode.gain.setValueAtTime(0.3, wrongContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, wrongContext.currentTime + 0.5);

            oscillator.start(wrongContext.currentTime);
            oscillator.stop(wrongContext.currentTime + 0.5);
        };
    }

    bindEvents() {
        // 选项按钮点击事件
        document.querySelectorAll('[data-index]').forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isAnswering) return;

                const index = parseInt(e.target.dataset.index);
                this.checkAnswer(index, e.target);
            });
        });

        // 重新开始按钮
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });

        // 键盘支持 (1-4 键选择答案)
        document.addEventListener('keydown', (e) => {
            if (this.isAnswering) return;

            const key = e.key;
            if (key >= '1' && key <= '4') {
                const index = parseInt(key) - 1;
                const button = document.getElementById(`option${index}`);
                if (button) {
                    this.checkAnswer(index, button);
                }
            }
        });
    }

    loadNewWord() {
        // 获取未使用的单词
        const availableWords = this.wordDatabase.filter(word => !this.usedWords.has(word.word));

        if (availableWords.length === 0) {
            // 如果所有单词都用完了，重置使用记录
            this.usedWords.clear();
            return this.loadNewWord();
        }

        // 随机选择一个单词
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        this.currentWordData = availableWords[randomIndex];
        this.usedWords.add(this.currentWordData.word);

        // 打乱选项顺序
        this.shuffleOptions();

        // 更新显示
        this.updateWordDisplay();
    }

    shuffleOptions() {
        const { options, answerIndex } = this.currentWordData;
        const correctAnswer = options[answerIndex];

        // 创建选项数组和索引映射
        const shuffledOptions = [...options];
        const newAnswerIndex = Math.floor(Math.random() * 4);

        // 将正确答案交换到随机位置
        [shuffledOptions[answerIndex], shuffledOptions[newAnswerIndex]] =
        [shuffledOptions[newAnswerIndex], shuffledOptions[answerIndex]];

        this.currentWordData.options = shuffledOptions;
        this.currentWordData.answerIndex = newAnswerIndex;
    }

    updateWordDisplay() {
        document.getElementById('word').textContent = this.currentWordData.word;
        document.getElementById('sentence').textContent = this.currentWordData.sentence;

        // 更新选项按钮
        this.currentWordData.options.forEach((option, index) => {
            const button = document.getElementById(`option${index}`);
            button.textContent = option;
            button.className = 'nes-btn is-primary';
            button.disabled = false;
        });
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.storage.highScore;
        document.getElementById('currentQuestion').textContent = this.currentQuestion;
    }

    checkAnswer(selectedIndex, buttonElement) {
        if (this.isAnswering) return;

        this.isAnswering = true;
        const isCorrect = selectedIndex === this.currentWordData.answerIndex;

        // 禁用所有按钮
        document.querySelectorAll('[data-index]').forEach(btn => {
            btn.disabled = true;
        });

        if (isCorrect) {
            this.handleCorrectAnswer(buttonElement);
        } else {
            this.handleWrongAnswer(buttonElement, selectedIndex);
        }
    }

    handleCorrectAnswer(buttonElement) {
        // 播放庆祝音效
        this.playCorrectSound();

        // 添加成功样式
        buttonElement.className = 'nes-btn is-success';

        // 更新分数
        this.score += 10;
        this.updateDisplay();

        // 显示正确答案效果
        this.showAnswerEffect(true);

        // 1秒后继续下一题
        setTimeout(() => {
            this.nextQuestion();
        }, 1000);
    }

    handleWrongAnswer(buttonElement, selectedIndex) {
        // 播放错误音效
        this.playWrongSound();

        // 添加错误样式
        buttonElement.className = 'nes-btn is-error';

        // 显示正确答案
        const correctButton = document.getElementById(`option${this.currentWordData.answerIndex}`);
        correctButton.className = 'nes-btn is-success';

        // 显示错误答案效果
        this.showAnswerEffect(false);

        // 1.5秒后继续下一题
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    showAnswerEffect(isCorrect) {
        // 创建视觉反馈效果
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            z-index: 1000;
            animation: ${isCorrect ? 'success-pop' : 'error-pop'} 1s ease;
            pointer-events: none;
        `;

        effect.textContent = isCorrect ? '✓' : '✗';
        effect.style.color = isCorrect ? '#27ae60' : '#e74c3c';
        effect.style.textShadow = '0 0 20px currentColor';

        document.body.appendChild(effect);

        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion > this.totalQuestions) {
            this.endGame();
        } else {
            this.updateDisplay();
            this.isAnswering = false;
            this.loadNewWord();
        }
    }

    endGame() {
        // 更新最高分
        if (this.score > this.storage.highScore) {
            this.storage.highScore = this.score;
            localStorage.setItem('cet6HighScore', this.storage.highScore.toString());
        }

        // 添加到最近成绩
        this.storage.recentScores.unshift({
            score: this.score,
            date: new Date().toLocaleDateString(),
            percentage: Math.round((this.score / (this.totalQuestions * 10)) * 100)
        });

        // 只保留最近10次
        if (this.storage.recentScores.length > 10) {
            this.storage.recentScores = this.storage.recentScores.slice(0, 10);
        }

        localStorage.setItem('cet6RecentScores', JSON.stringify(this.storage.recentScores));

        // 显示结果界面
        this.showResults();
    }

    showResults() {
        // 隐藏游戏界面，显示结果界面
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'block';

        // 更新结果显示
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalHighScore').textContent = this.storage.highScore;

        // 显示最近成绩
        const recentScoresList = document.getElementById('recentScores');
        recentScoresList.innerHTML = '';

        this.storage.recentScores.forEach((record, index) => {
            const li = document.createElement('li');
            li.textContent = `第${index + 1}名: ${record.score}分 (${record.percentage}%) - ${record.date}`;
            recentScoresList.appendChild(li);
        });

        if (this.storage.recentScores.length === 0) {
            const li = document.createElement('li');
            li.textContent = '暂无游戏记录';
            recentScoresList.appendChild(li);
        }
    }

    restart() {
        // 重置游戏状态
        this.currentQuestion = 1;
        this.score = 0;
        this.usedWords.clear();
        this.isAnswering = false;

        // 显示游戏界面，隐藏结果界面
        document.getElementById('gameScreen').style.display = 'block';
        document.getElementById('resultScreen').style.display = 'none';

        // 重新开始
        this.updateDisplay();
        this.loadNewWord();
    }
}

// 添加 CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes success-pop {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes error-pop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        25% {
            transform: translate(-50%, -50%) scale(1.2) rotate(-5deg);
            opacity: 1;
        }
        75% {
            transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
});