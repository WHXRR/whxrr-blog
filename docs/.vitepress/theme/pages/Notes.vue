<script setup lang="ts">
import { data } from "../../utils/notes.data.js";
import WaterfallCard from "../components/WaterfallCard.vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";

const breakpoints = {
  1200: {
    rowPerView: 4,
  },
  800: {
    rowPerView: 3,
  },
  500: {
    rowPerView: 2,
  },
  400: {
    rowPerView: 1,
  },
};
</script>

<template>
  <div class="container py-10">
    <Waterfall
      :list="data"
      backgroundColor="transparent"
      :breakpoints="breakpoints"
    >
      <template #default="{ item }">
        <WaterfallCard :data="item">
          <LazyImg :url="item.frontmatter?.pic" />
        </WaterfallCard>
      </template>
    </Waterfall>
  </div>
</template>

<style scoped lang="scss"></style>
