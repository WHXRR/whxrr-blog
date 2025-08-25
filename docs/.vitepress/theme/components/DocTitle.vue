<script setup>
import { ref, watch } from "vue";
import { useData } from "vitepress";
import { data as allPosts } from "../../utils/notes.data.ts";

const { page, frontmatter } = useData();
const getCurrentPageContent = () => {
  const currentUrl = page.value.relativePath
    .replace(".md", ".html")
    .replace(/\\/g, "/");
  const currentPost = allPosts.find((post) => post.url.includes(currentUrl));
  return currentPost?.src || "";
};
const summary = ref("");
const isLoading = ref(false);
const error = (ref < string) | (null > null);
const startSummary = async () => {
  isLoading.value = true;
  error.value = null;
  summary.value = "";
  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://chat.whxrr.top:3000/"
      : "/api/";
  try {
    const articleContent = getCurrentPageContent();
    const response = await fetch(apiUrl + "ai/summary-stream", {
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
            // 忽略JSON解析错误
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

watch(
  () => page.value.relativePath,
  async () => {
    startSummary();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="text-center pb-10">
    <div class="font-bold text-xl md:text-3xl xl:text-4xl !leading-snug">
      {{ frontmatter.title }}
    </div>
    <div class="text-gray-500 pt-2 text-sm md:text-base">
      {{ frontmatter.desc }}
    </div>
    <div class="text-gray-400 text-xs pt-4">{{ frontmatter.updateTime }}</div>
    <img
      :src="frontmatter.pic"
      alt=""
      class="mt-4 rounded-xl w-full"
      v-if="frontmatter.pic"
    />
    <div
      class="bg-gray-100 p-4 text-left rounded-md mt-4 text-sm leading-loose"
    >
      <div v-if="error">
        {{ error }}
      </div>
      <div v-else>
        <div>
          AI总结：
          <span v-if="isLoading">加载中...</span>
          <span v-else>{{ summary }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
