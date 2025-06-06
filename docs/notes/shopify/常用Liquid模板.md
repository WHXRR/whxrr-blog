---
title: "常用Liquid模板"
outline: deep
desc: "shopify 常用Liquid模板"
tags: "shopify"
updateTime: "2025-06-06 16:36"
---

```
{% style %}
  .section-{{ section.id }} {
    padding-top: {{ section.settings.padding_top_md }}px;
    padding-bottom: {{ section.settings.padding_bottom_md }}px;
    background: {{ section.settings.bg_color_md }}
  }
  @media (min-width: 1024px) {
    .section-{{ section.id }} {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
      background: {{ section.settings.bg_color }};
    }
  }
{% endstyle %}

<div class="section-{{ section.id }}"></div>

{% schema %}
{
  "name": "Download Menu",
  "settings": [
    {
      "type": "color",
      "id": "bg_color",
      "label": "板块背景颜色",
      "default": "transparent"
    },
    {
      "type": "color",
      "id": "bg_color_md",
      "label": "板块背景颜色-移动端",
      "default": "transparent"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 200,
      "step": 4,
      "unit": "px",
      "label": "电脑端上边距",
      "default": 60
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 200,
      "step": 4,
      "unit": "px",
      "label": "电脑端下边距",
      "default": 60
    },
    {
      "type": "range",
      "id": "padding_top_md",
      "min": 0,
      "max": 200,
      "step": 4,
      "unit": "px",
      "label": "移动端上边距",
      "default": 36
    },
    {
      "type": "range",
      "id": "padding_bottom_md",
      "min": 0,
      "max": 200,
      "step": 4,
      "unit": "px",
      "label": "移动端下边距",
      "default": 36
    }
  ],
  "presets": [
    {
      "name": "Download Menu"
    }
  ]
}
{% endschema %}
```