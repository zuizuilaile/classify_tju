package com.textclassify;

public class TextRequest {
    private String text;

    // 无参构造函数，用于Jackson反序列化
    public TextRequest() {
    }

    public TextRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}