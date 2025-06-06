<script setup></script>

<template>
  <div class="text-center">
    <div class="font-bold text-4xl">{{ $frontmatter.title }}</div>
    <div class="text-gray-500 pt-2">{{ $frontmatter.desc }}</div>
    <div class="text-gray-400 text-xs pt-4">{{ $frontmatter.updateTime }}</div>
    <img :src="$frontmatter.pic" alt="" class="mt-4" v-if="$frontmatter.pic" />
  </div>
</template>

<style scoped lang="scss"></style>
