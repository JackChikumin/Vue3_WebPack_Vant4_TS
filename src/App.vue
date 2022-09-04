<template>
  <ConfigProvider class="Provider" :theme="DarkMode" :theme-vars="themeVars">
    <RouterView v-slot="{ Component }">
      <!-- 走缓存 -->
      <KeepAlive>
        <Component :is="Component" v-if="$route.meta.keepAlive" />
      </KeepAlive>
      <!-- 不走缓存 -->
      <Component :is="Component" v-if="!$route.meta.keepAlive" />
    </RouterView>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import VConsole from 'vconsole';
  import { useStore } from '@/store';
  import { ConfigProvider } from 'vant';
  import { useRoute, RouterView } from 'vue-router';
  import { computed, onBeforeMount, watch } from 'vue';
  import { MonitoringTheme, WatchSystemTheme } from '@/utils/DarkThemeUtils';

  const store = useStore();

  const router = useRoute();

  // 主题模式
  const DarkMode = computed(() => {
    return store.getters['SystemConfig/getDarkMode'];
  });

  // 主题变量
  const themeVars = computed(() => {
    return store.getters['SystemConfig/getThemeVars'];
  });

  // 是否显示Vconsole
  const isShowConsole = (): void => {
    if (Object.is(process.env.NODE_ENV, 'development')) {
      new VConsole({ theme: DarkMode.value });
    }
  };

  // 深度监听路由改变
  watch(
    () => router.path,
    (): void => {
      MonitoringTheme(true);
    },
    {
      deep: true,
    },
  );

  onBeforeMount((): void => {
    // 自动监测时间并切换到相应的主题模式
    MonitoringTheme(true);
    // 监听系统主题改变
    WatchSystemTheme();
    isShowConsole();
  });
</script>

<style lang="less"></style>
