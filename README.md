# 文本分类系统

基于Javalin框架和BERT模型的文本分类系统，前端使用原生HTML/CSS/JavaScript实现。

## 项目结构

```
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── textclassify/
│   │   │           ├── Main.java                  # 应用入口
│   │   │           ├── ClassificationController.java  # API控制器
│   │   │           ├── ClassificationService.java     # 分类服务(BERT模型接口层)
│   │   │           └── TextRequest.java              # 请求模型
│   │   └── resources/
│   │       └── public/                           # 静态资源目录
│   │           ├── css/
│   │           │   └── styles.css                # 样式文件
│   │           ├── js/
│   │           │   └── app.js                    # 前端脚本
│   │           └── index.html                    # 前端页面
└── pom.xml                                      # Maven配置文件
```

## 后端核心实现设计思路

### 1. 整体架构

本系统采用前后端分离的架构，后端使用Javalin框架提供RESTful API，前端使用原生HTML/CSS/JavaScript实现用户界面。

系统分为以下几个核心组件：

- **Main**: 应用程序入口，负责配置和启动Javalin服务器，注册API路由
- **ClassificationController**: API控制器，处理HTTP请求，调用分类服务，管理会话历史记录
- **ClassificationService**: 分类服务，作为BERT模型的接口层，负责文本分类逻辑
- **TextRequest**: 请求模型，用于反序列化前端发送的JSON请求

### 2. 分层设计

系统采用经典的三层架构：

1. **表示层**：ClassificationController，负责处理HTTP请求和响应
2. **业务逻辑层**：ClassificationService，负责文本分类的核心业务逻辑
3. **数据层**：目前使用内存存储会话历史记录，未来可扩展为数据库存储

### 3. BERT模型集成点

系统预留了BERT模型的集成点，位于`ClassificationService`类的`classify`方法中：

```java
public String classify(String text) {
    // TODO: 这里是BERT模型集成点
    // 当BERT模型训练好后，将在这里调用模型API进行实际分类
    // 例如：
    // return bertModel.predict(text);
    
    // 目前返回固定结果"测试"
    return "测试";
}
```

当BERT模型训练完成后，只需要修改此方法，调用模型API进行实际分类即可。

### 4. 会话历史记录管理

系统使用内存存储会话历史记录，当用户关闭网站后，历史记录会被清除。历史记录存储在`ClassificationController`类的`sessionHistory`列表中：

```java
private final List<Map<String, String>> sessionHistory = new ArrayList<>();
```

每次分类请求都会将结果添加到历史记录中，前端可以通过API获取完整的历史记录。

## 前后端接口说明

### 1. 文本分类接口

- **URL**: `/api/classify`
- **方法**: POST
- **请求体**:
  ```json
  {
    "text": "需要分类的文本"
  }
  ```
- **响应**:
  ```json
  {
    "text": "需要分类的文本",
    "category": "分类结果"
  }
  ```
- **错误响应**:
  ```json
  {
    "error": "错误信息"
  }
  ```

### 2. 历史记录接口

- **URL**: `/api/history`
- **方法**: GET
- **响应**: 历史记录数组
  ```json
  [
    {
      "text": "文本1",
      "category": "分类1"
    },
    {
      "text": "文本2",
      "category": "分类2"
    }
  ]
  ```

## 前端实现

前端使用原生HTML/CSS/JavaScript实现，主要功能包括：

1. **文本输入**: 提供文本输入框，用户可以输入需要分类的文本
2. **分类结果显示**: 显示分类结果，包括输入文本和分类类别
3. **历史记录显示**: 显示当前会话的所有分类历史记录
4. **美观动画**: 使用CSS动画实现平滑过渡效果

前端通过Fetch API与后端进行通信，发送分类请求和获取历史记录。

## 如何运行

1. 确保已安装Java 11或更高版本和Maven
2. 克隆项目到本地
3. 在项目根目录执行：`mvn clean package`
4. 运行生成的JAR文件：`java -jar target/text-classify-1.0-SNAPSHOT.jar`
5. 访问 http://localhost:7070 即可使用系统

## BERT模型集成指南

当BERT模型训练完成后，按照以下步骤集成到系统中：

1. 修改`ClassificationService`类的`classify`方法，调用BERT模型API
2. 根据BERT模型的接口要求，可能需要添加额外的依赖和配置
3. 如果BERT模型需要预处理和后处理步骤，可以在`ClassificationService`中添加相应的方法

例如，如果使用Java调用Python训练的BERT模型，可以考虑以下方式：

1. 使用HTTP API：将BERT模型部署为HTTP服务，通过HTTP请求调用
2. 使用进程间通信：通过Java执行Python脚本，传递参数和获取结果
3. 使用JNI：如果BERT模型有C/C++接口，可以通过JNI调用

具体实现方式取决于BERT模型的部署形式和接口设计。