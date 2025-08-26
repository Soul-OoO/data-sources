<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <h2 class="app-title">Data Sources Portal</h2>
          <div class="header-info">
            <span>FastAPI + Vue3</span>
          </div>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  color: white;
  font-weight: 600;
  margin: 0;
}

.header-info {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.app-main {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  min-height: calc(100vh - 60px);
  border-radius: 20px 20px 0 0;
  margin-top: 20px;
}

.el-container {
  height: 100vh;
}
</style>
