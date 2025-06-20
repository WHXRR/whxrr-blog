<script setup lang="ts">
import { useRouter } from "vitepress";
import { computed, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    default: {},
  },
});

const imgLoaded = ref(false);
const onImageLoad = () => {
  imgLoaded.value = true;
};

const aspectRatioStyle = computed(() => {
  const [width, height] = props.item.frontmatter.picSize.split("x");
  const ratio = (height / width) * 100;
  return {
    paddingBottom: `${ratio}%`,
  };
});

const router = useRouter();
const goNote = (url) => {
  router.go(url);
};
</script>

<template>
  <div
    class="cursor-pointer"
    @click="goNote(props.item.url)"
    :title="props.item?.frontmatter?.desc"
  >
    <div
      v-if="props.item.frontmatter.pic"
      :style="aspectRatioStyle"
      class="w-full relative overflow-hidden rounded-xl bg-gray-100"
    >
      <img
        v-show="imgLoaded"
        :src="props.item.frontmatter.pic"
        class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
        @load="onImageLoad"
      />
      <div
        v-show="!imgLoaded"
        class="absolute inset-0 flex items-center justify-center text-gray-400"
      >
        <span class="text-sm">Loading...</span>
      </div>
    </div>
    <div class="px-2 py-3 text-gray-800 dark:text-gray-300">
      <div class="flex items-center gap-2 md:gap-3">
        <svg
          t="1749203804378"
          class="dark:text-white flex-shrink-0 w-4"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2916"
          fill="currentColor"
        >
          <path
            d="M180.48 953.045333C78.378667 845.525333 20.864 687.36 14.506667 548.181333-11.093333 181.248 391.253333-122.368 787.2 130.688c153.301333 94.890667 206.165333 278.314667 218.922667 455.466667 6.4 107.52-46.506667 278.357333-142.250667 341.589333-6.4 6.314667 0 12.672 6.4 12.672 102.144-63.274667 159.658667-240.384 153.258667-354.261333-12.8-183.466667-70.272-373.248-223.573334-474.453334C397.653333-147.669333-30.208 155.989333 1.706667 548.181333c0 135.381333 41.173333 299.306667 172.458666 411.178667 6.4 6.357333 12.8 0 6.4-6.314667z"
            p-id="2917"
          ></path>
          <path
            d="M206.08 333.098667c-63.914667 25.301333-114.986667 75.946667-121.386667 145.493333-12.8 120.192 121.344 215.082667 229.930667 177.152 223.530667-75.946667 140.501333-392.234667-63.872-335.274667-6.4 0-6.4 12.629333 0 12.629334C435.925333 288.853333 506.453333 566.186667 308.48 635.733333c-82.901333 27.562667-216.149333-44.373333-209.792-151.893333A158.634667 158.634667 0 0 1 199.68 352.085333c19.2-12.672 12.8-25.301333 6.4-18.986666zM678.656 181.290667c-63.872 18.944-114.986667 63.232-134.144 120.192-38.314667 113.834667 70.272 227.712 185.216 221.397333 191.573333-18.986667 223.573333-316.288-6.4-335.274667-6.4 0-6.4 12.629333 0 12.629334 210.773333 18.986667 172.458667 290.986667 6.4 303.658666-102.186667 6.357333-197.973333-94.890667-172.416-189.781333 12.8-56.917333 63.872-101.205333 121.344-113.834667 12.8-12.672 12.8-18.986667 0-18.986666zM340.181333 731.648c6.4 94.890667 102.186667 158.122667 191.573334 120.192 6.4-6.357333 0-12.672-6.4-12.672-76.629333 31.616-152.661333-28.288-171.818667-104.192 0-13.397333-13.354667-9.685333-13.354667-3.328z"
            p-id="2918"
          ></path>
          <path
            d="M157.653333 431.061333c-7.552 3.754667-25.088 33.152 8.362667 49.706667 16.725333 8.277333 33.450667 8.277333 50.176-8.277333 41.813333-41.386667-26.453333-73.472-58.538667-41.386667zM748.885333 231.893333c-19.114667 6.314667-25.514667 31.616-19.114666 50.602667 12.757333 37.973333 57.472 31.616 63.829333-6.314667V276.053333c0-5.674667 0.725333-15.232-6.656-29.354666-9.728-18.602667-29.312-17.536-38.058667-14.848z"
            p-id="2919"
          ></path>
        </svg>
        <div class="font-bold text-sm line-clamp-1">
          {{ props.item?.frontmatter?.title }}
        </div>
      </div>
      <div
        class="pt-1.5 text-xs line-clamp-2 overflow-ellipsis text-black/60 dark:text-gray-300"
      >
        {{ props.item?.frontmatter?.desc }}
      </div>
      <div class="text-xs pt-3 text-gray-400 dark:text-gray-300 text-right">
        {{ props.item?.date?.string }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
