---
title: "使用langchain给文章添加ai总结"
outline: deep
desc: "使用langchain给文章添加ai总结"
tags: "langchain|ai"
updateTime: "2025-08-26 17:24"
pic: https://cdn.pixabay.com/photo/2025/08/20/05/48/gnu-9784856_1280.jpg
picSize: 1280x853
---

## 安装和配置 LangChain 与 DeepSeek 🚀

1. 安装依赖包

```bash
npm install langchain dotenv @langchain/deepseek
```

2. 获取 DeepSeek API Key

- 访问[Deepseek 开放平台](https://platform.deepseek.com/)
- 注册账号并登录
- 充值 10 元（最低充值金额）
- 在控制台创建 API Keys

3. 配置环境变量

在项目根目录创建 .env 文件，添加以下内容：

```bash
DEEPSEEK_API_KEY=你的api keys
```

## 创建 llm

```ts
import { Deepseek } from "@langchain/deepseek";
this.llm = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: "deepseek-chat",
  temperature: 0.8,
  maxTokens: 200,
});
```

## 调用 llm

根据文章内容判断是否进行分块处理

```ts
async summaryArticleStream(article: string) {
  const maxSingleChunkSize = 2000;
  this.logger.log(`文章长度：${article.length}`);

  if (article.length <= maxSingleChunkSize) {
    // 短文章直接流式处理
    return await this.processSingleChunkStream(article);
  } else {
    // 长文章分块流式处理
    return await this.processLongArticleStream(article);
  }
}
```

短文章通过 llm 的 stream 方法进行流式处理，长文章分块处理后，每个块通过 llm 的 stream 方法进行流式处理，最后将所有块的结果合并起来。

短文章处理：

```ts
private async processSingleChunkStream(article: string) {
  return this.llm.stream([
    {
      role: 'user',
      content: `请对以下文章进行总结，控制在200字以内：\n\n${article}`
    }
  ]);
}
```

长文章处理：

1. 通过 RecursiveCharacterTextSplitter 将文章分块

```ts
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // 每个块最大1000字符，确保不超过模型Token限制
  chunkOverlap: 100, // 块间重叠100字符，保持上下文连贯性
});
```

2. Map 拆分

```ts
const mapPromises = chunks.map(async (chunk) => {
  const result = await this.llm.invoke([
    {
      role: "user",
      content: `提取以下文档片段的核心要点，用1-2个关键句概括，不要重复背景信息：\n\n${chunk}`,
    },
  ]);
  return typeof result.content === "string"
    ? result.content
    : result.content.toString();
});
```

3. Reduce 阶段 - 分层整合

```ts
let currentSummaries: string[] = summaries;
while (currentSummaries.length > 5) {
  const batchPromises: Promise<string>[] = [];
  for (let i = 0; i < currentSummaries.length; i += 3) {
    const batch = currentSummaries.slice(i, i + 3);
    const batchPromise = this.llm
      .invoke([
        {
          role: "user",
          content: `整合以下要点，去除重复信息，保留核心内容：\n\n${batch.join(
            "\n\n"
          )}`,
        },
      ])
      .then((result) => {
        return typeof result.content === "string"
          ? result.content
          : result.content.toString();
      });
    batchPromises.push(batchPromise);
  }
  currentSummaries = await Promise.all(batchPromises);
}
```

完整代码如下：

```ts
private async processLongArticleStream(article: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const chunks = await splitter.splitText(article);

  const mapPromises = chunks.map(async (chunk) => {
    const result = await this.llm.invoke([
      {
        role: 'user',
        content: `提取以下文档片段的核心要点，用1-2个关键句概括，不要重复背景信息：\n\n${chunk}`
      }
    ]);
    return typeof result.content === 'string' ? result.content : result.content.toString();
  });

  const summaries = await Promise.all(mapPromises);

  let currentSummaries: string[] = summaries;

  while (currentSummaries.length > 5) {
    const batchPromises: Promise<string>[] = [];

    for (let i = 0; i < currentSummaries.length; i += 3) {
      const batch = currentSummaries.slice(i, i + 3);
      const batchPromise = this.llm.invoke([
        {
          role: 'user',
          content: `整合以下要点，去除重复信息，保留核心内容：\n\n${batch.join('\n\n')}`
        }
      ]).then(result => {
        return typeof result.content === 'string' ? result.content : result.content.toString();
      });

      batchPromises.push(batchPromise);
    }

    currentSummaries = await Promise.all(batchPromises);
  }

  const finalSummary = currentSummaries.join('\n\n');

  return this.llm.stream([
    {
      role: 'user',
      content: `请基于以下要点生成一段简洁的文章总结，严格遵守以下要求：\n1. 只输出总结内容，不要任何说明、分析或元信息\n2. 控制在120字以内\n3. 突出核心主题和关键步骤\n4. 使用简洁明了的语言\n5. 不要包含"改写说明"、"总结"、"本文"等提示性词语\n6. 直接描述技术流程和要点\n\n要点：\n${finalSummary}`
    }
  ]);
}
```

## 编写 sse 接口

```ts
@Post('xx')
async summaryArticleStream(
  @Body() body: { article: string },
  @Res() res: Response,
) {
  const { article } = body;
  // 设置SSE响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // 发送开始信号
    res.write(`data: ${JSON.stringify({ type: 'start', message: '开始分析文章...' })}\n\n`);

    const stream = await this.aiService.summaryArticleStream(article);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk.content })}\n\n`);
    }

    // 发送完成信号
    res.write(`data: ${JSON.stringify({ type: 'done', message: '总结完成' })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
}
```

## 前端实现

```vue
<script setup>
const summary = ref("");
const isLoading = ref(false);
const error = ref(null);
const startSummary = async () => {
  isLoading.value = true;
  error.value = null;
  summary.value = "";
  try {
    const articleContent = getCurrentPageContent();
    const response = await fetch("xx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article: articleContent }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "请求失败");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("无法获取响应流");

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            switch (data.type) {
              case "chunk":
                isLoading.value = false;
                summary.value += data.content;
                break;
              case "error":
                throw new Error(data.message);
            }
          } catch (e) {
            console.warn(e);
          }
        }
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "未知错误";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-100 p-4 text-left rounded-md mt-4 text-sm leading-loose">
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <div>
        AI总结：
        <span v-if="isLoading">加载中...</span>
        <span v-else>{{ summary }}</span>
      </div>
    </div>
  </div>
</template>
```
