package com.textclassify;

/**
 * 文本分类服务
 * 这个类是BERT模型的接口层，负责将文本发送给模型并获取分类结果
 * 目前是一个模拟实现，返回固定的"测试"结果
 */
public class ClassificationService {
    
    /**
     * 分类文本
     * @param text 需要分类的文本
     * @return 分类结果
     */
    public String classify(String text) {
        // TODO: 这里是BERT模型集成点
        // 当BERT模型训练好后，将在这里调用模型API进行实际分类
        // 例如：
        // return bertModel.predict(text);
        
        // 目前返回固定结果"测试"
        return "测试";
    }
}