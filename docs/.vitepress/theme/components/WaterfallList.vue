<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted, nextTick } from "vue";
import debounce from "../../utils/debounce.mjs";

interface IItem {
  url: string;
  date: Record<string, any>;
  frontmatter: Record<string, any>;
}
interface ICardPosition {
  imageHeight: number;
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
  predictedHeight: number; //预测高度
}>();

const loading = ref(true);

const canvasRef = ref<HTMLCanvasElement | null>(null);

const containerRef = ref<HTMLDivElement | null>(null);
const state = reactive({
  cardWidth: 0,
  cardPosition: [] as ICardPosition[],
  columnHeight: [] as number[],
});

// 计算列数和间距
const realColumnsAndGap = reactive({
  columns: props.columns,
  gap: props.gap,
});
const calculateColumnsAndGap = () => {
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

// 计算卡片宽度
const calculateCardWidth = () => {
  if (!containerRef.value) return;
  const containerWidth = containerRef.value.clientWidth;
  state.cardWidth =
    (containerWidth - realColumnsAndGap.gap * (realColumnsAndGap.columns - 1)) /
    realColumnsAndGap.columns;
};

// 计算图片高度
const calculateCardImageHeight = () => {
  props.list.forEach((item, index) => {
    if (!item.frontmatter.pic) return;
    const [width, height] = item.frontmatter.picSize.split("x");
    const imageHeight = Math.floor((state.cardWidth * height) / width);
    state.cardPosition[index] = {
      ...state.cardPosition[index],
      imageHeight,
    };
  });
};

// 计算卡片高度
const listRef = ref<HTMLDivElement | null>(null);
// 计算文本宽度
const getTextWidth = (text: string) => {
  if (!canvasRef.value || !containerRef.value) return 0;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return 0;
  const style = getComputedStyle(containerRef.value);
  ctx.font = `12px ${style.fontFamily}`;
  const canvasText = ctx.measureText(text);
  return canvasText.width;
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
const getCardHeight = () => {
  if (!listRef.value) return;
  const children = listRef.value.children;

  if (!children.length) return;
  props.list.forEach((item, index) => {
    const padding = 24;
    const titleHeight = 20;
    const oneRowContent = 22;
    const twoRowContent = 38;
    const timeHeight = 28;
    const contentWidth = getTextWidth(item.frontmatter.desc);
    const contentHeight =
      contentWidth > state.cardWidth - 16 ? twoRowContent : oneRowContent;
    const cardHeight =
      padding +
      titleHeight +
      contentHeight +
      timeHeight +
      state.cardPosition[index].imageHeight;

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

const init = () => {
  // 1.初始化
  state.cardWidth = 0;
  state.cardPosition = [];
  state.columnHeight = [];
  // 2.计算列数和间距
  calculateColumnsAndGap();
  // 3.根据容器宽度、列数和间距，计算卡片宽度
  calculateCardWidth();
  // 4.计算图片高度
  calculateCardImageHeight();
  // 5.计算卡片高度
  nextTick(() => {
    getCardHeight();
  });
};
const debounceInit = debounce(init, 500);
const resizeObserver = new ResizeObserver(() => {
  debounceInit();
});

onMounted(async () => {
  if (!containerRef.value) return;
  init();
  resizeObserver.observe(containerRef.value);
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
onUnmounted(() => {
  containerRef.value && resizeObserver.unobserve(containerRef.value);
});

// -----------------------------------------------------虚拟列表------------------------------------------------------
// 计算开始索引
const scrollTop = ref(0);
const handleScroll = () => {};
// 计算可见卡片
const visibleCard = computed(() => {
  return props.list.filter((_, index) => {
    const h = state.cardPosition[index].height;
    const y = state.cardPosition[index].y;
    return (
      h + y > containerRef.value.scrollTop &&
      y < containerRef.value.clientHeight
    );
  });
});

// 计算滚动容器高度和位置
// const scrollStyle = computed(() => ({
//   height: `${
//     Math.ceil(props.list.length / realColumnsAndGap.columns) *
//       (props.predictedHeight + realColumnsAndGap.gap) -
//     Math.floor(startIndex.value / realColumnsAndGap.columns) *
//       (props.predictedHeight + realColumnsAndGap.gap)
//   }px`,
//   transform: `translate3d(0, ${
//     Math.floor(startIndex.value / realColumnsAndGap.columns) *
//     props.predictedHeight
//   }px, 0)`,
// }));
</script>

<template>
  <!-- 用来获取文本宽度 -->
  <canvas id="canvas" ref="canvasRef" class="hidden"></canvas>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-black z-10 opacity-0 transition-all duration-300 pointer-events-none"
    :class="{ 'opacity-100 pointer-events-auto': loading }"
  ></div>
  <div
    class="waterfall-container w-full h-full overflow-x-hidden overflow-y-auto"
    ref="containerRef"
    @scroll="handleScroll"
  >
    <div
      class="waterfall-list relative"
      ref="listRef"
      :style="{ height: columnStats.maxHeight + 'px' }"
    >
      <div
        class="waterfall-item absolute top-0 left-0 transition-transform duration-300 overflow-hidden"
        v-for="(item, index) in visibleCard"
        :key="index"
        :style="{
          width: `${state.cardWidth}px`,
          height: `${state.cardPosition[index]?.height}px`,
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
