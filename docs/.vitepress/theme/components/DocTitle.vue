<script setup></script>

<template>
  <div class="text-center pb-10">
    <div class="font-bold text-xl md:text-3xl xl:text-4xl !leading-snug">
      {{ $frontmatter.title }}
    </div>
    <div class="text-gray-500 pt-2 text-sm md:text-base">
      {{ $frontmatter.desc }}
    </div>
    <div class="text-gray-400 text-xs pt-4">{{ $frontmatter.updateTime }}</div>
    <img
      :src="$frontmatter.pic"
      alt=""
      class="mt-4 rounded-xl w-full"
      v-if="$frontmatter.pic"
    />
  </div>
</template>

<style scoped lang="scss"></style>
