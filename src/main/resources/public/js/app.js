// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const textInput = document.getElementById('textInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('resultContainer');
    const historyContainer = document.getElementById('historyContainer');
    
    // 初始化加载历史记录
    loadHistory();
    
    // 绑定提交按钮点击事件
    submitBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text) {
            showError('请输入需要分类的文本');
            return;
        }
        
        // 显示加载动画
        showLoading();
        
        // 发送分类请求
        classifyText(text);
    });
    
    /**
     * 发送文本分类请求
     * @param {string} text 需要分类的文本
     */
    async function classifyText(text) {
        try {
            const response = await fetch('/api/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            
            if (!response.ok) {
                throw new Error('请求失败');
            }
            
            const data = await response.json();
            
            // 显示分类结果
            showResult(data);
            
            // 更新历史记录
            loadHistory();
            
            // 清空输入框
            textInput.value = '';
            
        } catch (error) {
            console.error('分类请求出错:', error);
            showError('分类请求失败，请稍后重试');
        }
    }
    
    /**
     * 加载历史记录
     */
    async function loadHistory() {
        try {
            const response = await fetch('/api/history');
            
            if (!response.ok) {
                throw new Error('获取历史记录失败');
            }
            
            const history = await response.json();
            
            // 显示历史记录
            displayHistory(history);
            
        } catch (error) {
            console.error('获取历史记录出错:', error);
            historyContainer.innerHTML = '<div class="history-placeholder">获取历史记录失败</div>';
        }
    }
    
    /**
     * 显示分类结果
     * @param {Object} result 分类结果对象
     */
    function showResult(result) {
        // 创建结果元素
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <h3>分类结果</h3>
            <p><strong>文本:</strong> ${escapeHtml(result.text)}</p>
            <p><strong>分类:</strong> <span class="category">${escapeHtml(result.category)}</span></p>
        `;
        
        // 添加动画效果
        resultElement.style.opacity = '0';
        resultElement.style.transform = 'translateY(20px)';
        
        // 清空结果容器并添加新结果
        resultContainer.innerHTML = '';
        resultContainer.appendChild(resultElement);
        
        // 触发动画
        setTimeout(() => {
            resultElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            resultElement.style.opacity = '1';
            resultElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    /**
     * 显示历史记录
     * @param {Array} history 历史记录数组
     */
    function displayHistory(history) {
        if (!history || history.length === 0) {
            historyContainer.innerHTML = '<div class="history-placeholder">暂无历史记录</div>';
            return;
        }
        
        // 清空历史容器
        historyContainer.innerHTML = '';
        
        // 创建历史记录元素
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="text">${escapeHtml(item.text)}</div>
                <div class="category">${escapeHtml(item.category)}</div>
            `;
            
            // 添加延迟动画
            historyItem.style.opacity = '0';
            historyItem.style.animation = `fadeIn 0.3s ease-out ${index * 0.05}s forwards`;
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    /**
     * 显示加载动画
     */
    function showLoading() {
        resultContainer.innerHTML = `
            <div class="result-placeholder" style="display: flex; justify-content: center; align-items: center;">
                <div class="loading-spinner"></div>
                <span style="margin-left: 10px;">正在分类...</span>
            </div>
        `;
        
        // 添加加载动画样式
        if (!document.querySelector('#loading-style')) {
            const style = document.createElement('style');
            style.id = 'loading-style';
            style.textContent = `
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: #3498db;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * 显示错误信息
     * @param {string} message 错误信息
     */
    function showError(message) {
        resultContainer.innerHTML = `
            <div class="result-placeholder" style="color: #e74c3c;">
                <i class="error-icon">⚠</i> ${escapeHtml(message)}
            </div>
        `;
    }
    
    /**
     * 转义HTML特殊字符，防止XSS攻击
     * @param {string} text 需要转义的文本
     * @returns {string} 转义后的文本
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});