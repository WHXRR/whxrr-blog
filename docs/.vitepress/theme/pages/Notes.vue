<script setup lang="ts">
import { data } from "../../utils/notes.data.js";
import WaterfallList from "../components/WaterfallList.vue";
import WaterfallCard from "../components/WaterfallCard.vue";

const breakPoint = {
  560: {
    columns: 3,
    gap: 10,
  },
  1024: {
    columns: 4,
    gap: 20,
  },
  1280: {
    columns: 5,
    gap: 20,
  },
};

const newData = data.map((item, index) => ({
  ...item,
  id: index,
}));
</script>

<template>
  <div class="container py-10">
    <div class="h-[calc(100vh-257px)] overflow-hidden">
      <ClientOnly>
        <WaterfallList
          :list="newData"
          :breakPoint="breakPoint"
          :columns="2"
          :gap="20"
        >
          <template #default="{ item }">
            <WaterfallCard :item="item" />
          </template>
        </WaterfallList>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
