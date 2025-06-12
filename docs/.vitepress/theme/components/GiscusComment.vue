<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useRoute, useData } from "vitepress";

const route = useRoute();
const { isDark } = useData();
</script>
<template>
  <div class="pt-14">
    <Giscus
      id="comments"
      repo="WHXRR/whxrr-blog"
      repoId="R_kgDOO3G9FQ"
      category="Announcements"
      categoryId="DIC_kwDOO3G9Fc4CrZ9b"
      mapping="pathname"
      term="Welcome to giscus!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
      :key="route.path"
    />
  </div>
</template>

<style scoped lang="scss"></style>
