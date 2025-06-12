<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from "vue";
import debounce from "../../utils/debounce.mjs";
import preLoadImage from "../../utils/preLoadImage.mjs";

interface IItem {
  url: string;
  date: Record<string, any>;
  frontmatter: Record<string, any>;
}
interface ICardPosition {
  imageHeight: number;
  textHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
}
interface IBreakpoint {
  [key: string]: {
    columns: number;
    gap: number;
  };
}

const props = defineProps<{
  list: IItem[];
  gap: number;
  columns: number;
  breakPoint?: IBreakpoint;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const realColumnsAndGap = reactive({
  columns: props.columns,
  gap: props.gap,
});
const state = reactive({
  loading: false,
  cardWidth: 0,
  cardPosition: [] as ICardPosition[],
  columnHeight: new Array(realColumnsAndGap.columns).fill(0) as number[],
});

const getCardImageHeight = async () => {
  const tasks = props.list.map(async (item, index) => {
    if (!item.frontmatter.pic) return;
    const res = await preLoadImage(item.frontmatter.pic);
    const { width, height } = res as { width: number; height: number };
    const imageHeight = Math.floor((state.cardWidth * height) / width);
    state.cardPosition[index] = {
      ...state.cardPosition[index],
      imageHeight,
    };
  });

  await Promise.all(tasks);
};

const columnStats = computed(() => {
  let minIndex = -1;
  let minHeight = 0;
  let maxIndex = -1;
  let maxHeight = 0;

  state.columnHeight.forEach((height, index) => {
    // 处理最小值
    if (minIndex === -1 || height < minHeight) {
      minIndex = index;
      minHeight = height;
    }

    // 处理最大值
    if (maxIndex === -1 || height > maxHeight) {
      maxIndex = index;
      maxHeight = height;
    }
  });

  return {
    minIndex,
    minHeight,
    maxIndex,
    maxHeight,
  };
});

const listRef = ref<HTMLDivElement | null>(null);
const getCardHeight = () => {
  if (!listRef.value) return;
  const children = listRef.value.children;

  if (!children.length) return;
  props.list.forEach((_, index) => {
    const cardHeight = children[index].getBoundingClientRect().height;
    if (index < realColumnsAndGap.columns) {
      state.cardPosition[index] = {
        ...state.cardPosition[index],
        width: state.cardWidth,
        height: cardHeight,
        x:
          index % realColumnsAndGap.columns === 0
            ? 0
            : index * (state.cardWidth + realColumnsAndGap.gap),
        y: 0,
      };
      state.columnHeight[index] = cardHeight + realColumnsAndGap.gap;
    } else {
      const { minIndex, minHeight } = columnStats.value;
      state.cardPosition[index] = {
        ...state.cardPosition[index],
        width: state.cardWidth,
        height: cardHeight,
        x: minIndex * (state.cardWidth + realColumnsAndGap.gap),
        y: minHeight,
      };
      state.columnHeight[minIndex] += cardHeight + realColumnsAndGap.gap;
    }
  });
};

const changeColumnsAndGap = () => {
  const breakpoints = props.breakPoint;
  const windowWidth = window.innerWidth;
  let matched = {
    columns: props.columns,
    gap: props.gap,
  };
  let maxMatchedWidth = -1;
  if (breakpoints) {
    Object.keys(breakpoints).forEach((bp) => {
      const bpNum = Number(bp);
      if (windowWidth >= bpNum && bpNum > maxMatchedWidth) {
        maxMatchedWidth = bpNum;
        matched = breakpoints[bpNum];
      }
    });
  }
  if (matched) {
    realColumnsAndGap.columns = matched.columns;
    realColumnsAndGap.gap = matched.gap;
  } else {
    realColumnsAndGap.columns = props.columns;
    realColumnsAndGap.gap = props.gap;
  }
};
changeColumnsAndGap();
const debounceChangeColumnsAndGap = debounce(changeColumnsAndGap, 500);

const init = async () => {
  if (!containerRef.value) return;
  state.loading = true;
  const containerWidth = containerRef.value.clientWidth;
  state.cardWidth =
    (containerWidth - realColumnsAndGap.gap * (realColumnsAndGap.columns - 1)) /
    realColumnsAndGap.columns;
  await getCardImageHeight();
  getCardHeight();
  setTimeout(() => {
    state.loading = false;
  }, 500);
};
const debounceHandleWindowResize = debounce(init, 500);
const resizeObserver = new ResizeObserver(() => {
  debounceChangeColumnsAndGap();
  debounceHandleWindowResize();
});
onMounted(() => {
  if (!containerRef.value) return;
  init();
  resizeObserver.observe(containerRef.value);
});
onUnmounted(() => {
  containerRef.value && resizeObserver.unobserve(containerRef.value);
});
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-white/80 z-10 opacity-0 transition-all duration-300 pointer-events-none"
    :class="{ 'opacity-100 pointer-events-auto': state.loading }"
  ></div>
  <div
    class="waterfall-container w-full h-full overflow-x-hidden overflow-y-auto"
    ref="containerRef"
  >
    <div
      class="waterfall-list relative"
      ref="listRef"
      :style="{ height: columnStats.maxHeight + 'px' }"
    >
      <div
        class="waterfall-item absolute top-0 left-0 transition-transform duration-300"
        v-for="(item, index) in props.list"
        :key="index"
        :style="{
          width: `${state.cardWidth}px`,
          transform: `translate3d(${state.cardPosition[index]?.x || 0}px, ${
            state.cardPosition[index]?.y || 0
          }px, 0)`,
        }"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
