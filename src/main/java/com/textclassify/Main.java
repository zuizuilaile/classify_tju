package com.textclassify;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

public class Main {
    public static void main(String[] args) {
        // 创建Javalin应用实例
        Javalin app = Javalin.create(config -> {
            // 配置静态文件目录
            config.staticFiles.add("/public", Location.CLASSPATH);
            // 启用CORS
            config.plugins.enableCors(cors -> cors.add(it -> {
                it.anyHost();
            }));
        }).start(7070);

        // 注册API路由
        registerRoutes(app);

        System.out.println("服务器已启动，访问 http://localhost:7070");
    }

    private static void registerRoutes(Javalin app) {
        // 创建API控制器实例
        ClassificationController classificationController = new ClassificationController();
        
        // 注册API路由
        app.post("/api/classify", classificationController::classifyText);
        app.get("/api/history", classificationController::getHistory);
    }
}