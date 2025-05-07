package com.textclassify;

import io.javalin.http.Context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ClassificationController {
    // 存储会话历史记录
    private final List<Map<String, String>> sessionHistory = new ArrayList<>();
    
    // 文本分类服务
    private final ClassificationService classificationService = new ClassificationService();
    
    /**
     * 处理文本分类请求
     * @param ctx Javalin上下文
     */
    public void classifyText(Context ctx) {
        // 从请求中获取文本
        TextRequest request = ctx.bodyAsClass(TextRequest.class);
        String text = request.getText();
        
        if (text == null || text.trim().isEmpty()) {
            ctx.status(400).json(Map.of("error", "文本不能为空"));
            return;
        }
        
        // 调用分类服务进行分类
        String category = classificationService.classify(text);
        
        // 创建响应
        Map<String, String> response = new HashMap<>();
        response.put("text", text);
        response.put("category", category);
        
        // 添加到历史记录
        sessionHistory.add(response);
        
        // 返回分类结果
        ctx.json(response);
    }
    
    /**
     * 获取会话历史记录
     * @param ctx Javalin上下文
     */
    public void getHistory(Context ctx) {
        ctx.json(sessionHistory);
    }
}