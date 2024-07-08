<template>
  <AppMain title="IM 聊天框">
    <section class="chat-wrapper">
      <div ref="wrapperRef" class="chat-message">
        <div class="chat-message__holder" data-desc="处理数据小于一屏的情况"></div>
        <div
          v-for="(item, idx) in messageList"
          :key="idx"
          :class="{
            'message-item': true,
            'message-item--self': item.isSelf
          }"
        >
          <div class="message-avatar"></div>
          <div class="message-content">
            <p v-if="!item.isSelf" class="username">{{ item.username }}</p>
            <div class="msg">{{ item.content }}</div>
          </div>
        </div>

        <p v-if="loading" class="text-xs text-center py-1.5 opacity-50">加载中...</p>

        <div ref="placeholderRef" class="h-0 pointer-events-none" />
      </div>
      <div class="chat-input">
        <div class="chat-input__toolbar">
          <SlightlySmilingFace :stroke-width="3" />
          <AddPic :stroke-width="3" />
          <FolderUpload :stroke-width="3" />
        </div>
        <div class="chat-input__editor">
          <textarea v-model.trim="curMsg" placeholder="请输入消息，点击发送按钮发送" />
        </div>
        <div class="chat-input__send">
          <el-button size="small" type="primary" @click="sendMsg">发送</el-button>
        </div>
      </div>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { SlightlySmilingFace, AddPic, FolderUpload } from '@icon-park/vue-next';

import { useChat } from '../composables';

const { loading, wrapperRef, placeholderRef, curMsg, messageList, sendMsg } = useChat();
</script>

<style lang="scss" scoped>
.chat-wrapper {
  @apply h-[calc(100vh_-_50px)] flex flex-col;
}

.chat-message {
  @apply flex-1 overflow-auto;
  // transform: rotate(180deg);
  // direction: rtl;
  display: flex;
  flex-direction: column-reverse;

  &__holder {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .message-item {
    @apply flex m-3;

    &--self {
      flex-direction: row-reverse;

      .message-avatar {
        @apply mr-0 ml-4;
      }

      .msg {
        &::after {
          @apply -right-1.5;
          left: auto !important;
        }
      }
    }
  }

  .message-avatar {
    @apply w-8 h-8 bg-gray-500/60 rounded mr-4;
  }

  .message-content {
    .username {
      @apply text-xs pb-1 opacity-50;
    }

    .msg {
      @apply relative max-w-64 p-3 bg-[#1E2022] rounded-md text-sm;

      &::after {
        @apply absolute -left-1.5 top-3.5 w-3 h-3 rotate-45 bg-[#1E2022];
        content: '';
      }
    }
  }
}

.chat-input {
  @apply h-[160px] flex flex-col border-t border-gray-500/50;

  &__toolbar {
    @apply flex gap-2 p-2;

    > span {
      @apply cursor-pointer;
    }
  }

  &__editor {
    @apply flex-1 text-sm;

    textarea {
      @apply p-2 w-[100%] h-[100%];

      &:focus {
        @apply outline-none;
      }
    }
  }

  &__send {
    @apply flex justify-end p-2;
  }
}
</style>
