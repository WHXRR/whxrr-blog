<script setup lang="ts">
import Card from "../components/Card.vue";
import { data } from "../../utils/notes.data.js";
const theFirstThreeItems = JSON.parse(JSON.stringify(data)).splice(0, 3);
</script>
<template>
  <img
    src="/banner.jpg"
    alt=""
    class="w-full h-[calc(100vh-361px)] object-cover"
  />
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 container py-7"
  >
    <Card
      v-for="item in theFirstThreeItems"
      :key="item.date.time"
      :data="item"
    />
  </div>
</template>

<style scoped lang="scss"></style>
