<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from "vue";
import debounce from "../../utils/debounce.mjs";

interface IItem {
  id: number;
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
}>();

const list = computed(() =>
  props.list.map((item, index) => ({
    ...item,
    id: index,
  }))
);
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
  list.value.forEach((item, index) => {
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
const canvasRef = ref<HTMLCanvasElement | null>(null);
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
  list.value.forEach((item, index) => {
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

// 初始化
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
  getCardHeight();
  // 6.计算可见卡片
  calculateVisibleCard();
};
const debounceInit = debounce(init, 500);
const resizeObserver = new ResizeObserver(() => {
  debounceInit();
});

onMounted(async () => {
  if (!containerRef.value) return;
  init();
  resizeObserver.observe(containerRef.value);
});
onUnmounted(() => {
  containerRef.value && resizeObserver.unobserve(containerRef.value);
});

// -----------------------------------------------------虚拟列表------------------------------------------------------
// 计算可见卡片
const visibleCard = ref<IItem[]>([]);
const calculateVisibleCard = () => {
  // 添加缓冲区，提前渲染即将进入视口的卡片
  const bufferHeight = containerRef.value
    ? containerRef.value.clientHeight * 0.5
    : 0;
  const arr = list.value.filter((_, index) => {
    if (state.cardPosition[index] && containerRef.value) {
      const h = state.cardPosition[index].height;
      const y = state.cardPosition[index].y;
      const scrollTop = containerRef.value.scrollTop;
      const viewportHeight = containerRef.value.clientHeight;

      // 增加缓冲区，提前渲染即将进入视口的卡片
      return (
        y + h > scrollTop - bufferHeight &&
        y < scrollTop + viewportHeight + bufferHeight
      );
    }
  });
  visibleCard.value = arr;
};
const throttleRAF = (fn) => {
  let running = false;
  return function () {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      fn();
      running = false;
    });
  };
};
const throttledCalculateVisibleCard = throttleRAF(calculateVisibleCard);
</script>

<template>
  <!-- 用来获取文本宽度 -->
  <canvas id="canvas" ref="canvasRef" class="hidden"></canvas>
  <div
    class="waterfall-container w-full h-full overflow-x-hidden overflow-y-auto"
    ref="containerRef"
    @scroll="throttledCalculateVisibleCard"
  >
    <div
      class="waterfall-list relative"
      ref="listRef"
      :style="{ height: columnStats.maxHeight + 'px' }"
    >
      <div
        class="waterfall-item absolute top-0 left-0 transition-transform duration-300 overflow-hidden will-change-transform"
        v-for="item in visibleCard"
        :key="item.id"
        :style="{
          width: `${state.cardWidth}px`,
          height: `${state.cardPosition[item.id]?.height}px`,
          transform: `translate3d(${state.cardPosition[item.id]?.x || 0}px, ${
            state.cardPosition[item.id]?.y || 0
          }px, 0)`,
        }"
      >
        <div class="animate-box">
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.animate-box {
  animation: MoveAnimate 0.5s;
}
@keyframes MoveAnimate {
  from {
    opacity: 0;
    transform: translateY(200px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
