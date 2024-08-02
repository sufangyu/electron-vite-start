<template>
  <AppMain title="倒计时">
    <section class="p-3">
      <Card title="基本用法">
        <div class="text-center mb-4">
          <p>{{ timeTextForBase }}</p>
        </div>
      </Card>

      <Card title="自定义倒计时格式">
        <div class="text-center mb-4">
          <p>{{ timeTextForFormat }}</p>
        </div>
      </Card>

      <Card title="毫秒级渲染">
        <div class="text-left mb-4">
          <p>{{ timeTextFormilliSecond }}</p>
        </div>
      </Card>

      <Card title="自定义样式">
        <div class="custom-style">
          <span class="count-down-item">{{ current.hours }}</span>
          <span>:</span>
          <span class="count-down-item">{{ current.minutes }}</span>
          <span>:</span>
          <span class="count-down-item">{{ current.seconds }}</span>
        </div>
      </Card>

      <Card title="手动控制">
        <div class="text-center mb-4">
          <p>{{ timeText }}</p>
          <el-button size="small" @click="startCountDown">开始 </el-button>
          <el-button size="small" @click="pauseCountDown">暂停</el-button>
          <el-button size="small" @click="continuCountDown">继续</el-button>
          <el-button size="small" @click="() => resetCountDown()">重置</el-button>
        </div>
      </Card>

      <Card title="其他场景">
        <div class="text-center mb-4">
          <el-button size="small" type="primary" :disabled="counting" @click="handleGetSMS">
            {{ counting ? sms : '获取验证码' }}
          </el-button>
        </div>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { useCountDown } from '@core/hooks';

// 基本用法
const { timeText: timeTextForBase } = useCountDown({
  time: 30 * 60 * 60 * 1000,
  autoStart: true
});

// 自定义时间格式
const { timeText: timeTextForFormat } = useCountDown({
  time: 32 * 60 * 60 * 1000,
  autoStart: true,
  format: 'DD 天 HH 时 mm 分 ss 秒'
});

// 毫秒级渲染
const { timeText: timeTextFormilliSecond } = useCountDown({
  time: 24 * 60 * 60 * 1000,
  format: 'HH:mm:ss:SSS',
  millisecond: true,
  autoStart: true
});

// 自定义样式
const { current } = useCountDown({
  time: 32 * 60 * 60 * 1000,
  autoStart: true
});

// 手动控制
const { timeText, startCountDown, pauseCountDown, continuCountDown, resetCountDown } = useCountDown(
  { time: 30 * 1000 }
);

// 获取验证码
const {
  counting,
  timeText: sms,
  startCountDown: handleGetSMS,
  resetCountDown: resetCountDownForSMS
} = useCountDown({
  time: 15 * 1000,
  format: 's秒',
  cachedKey: 'sms-code-test',
  onFinished: () => {
    resetCountDownForSMS();
  }
});
</script>

<style lang="scss" scoped>
.custom-style {
  @apply flex items-center justify-center mb-4 gap-0.5;

  > span {
    @apply flex items-center justify-center;
  }
}
.count-down-item {
  @apply block  w-[24px] h-[24px] rounded-sm text-[13px]
    bg-blue-500 text-slate-50;
}
</style>
