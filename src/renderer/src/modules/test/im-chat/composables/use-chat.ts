const sleep = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface Message {
  username: string;
  content: string;
  isSelf?: boolean;
  created?: string;
}

const MessageDataInit: Message[] = [
  { username: '小红', isSelf: false, content: '最近怎么样？' },
  { username: '小明', isSelf: true, content: '还行' },
  { username: '小明', isSelf: true, content: '有什么事情吗？' },
  { username: '小红', isSelf: false, content: '没事，就找你闲聊下' },
  { username: '小明', isSelf: true, content: 'OK，OK～～～' },
  { username: '小红', isSelf: false, content: '你最近在忙什么？' },
  { username: '小明', isSelf: true, content: '我在做一个项目，这是一个展示我工作的作品集网站。' },
  { username: '小明', isSelf: true, content: '进展顺利，我快完成了' },
  { username: '小红', isSelf: false, content: '期待中！' }
];

export function useChat() {
  const wrapperRef = ref<HTMLElement | null>(null);
  const placeholderRef = ref<HTMLElement | null>(null);
  const pageNum = ref(1);
  const loading = ref<boolean>(false);

  const curMsg = ref<string>('');
  const messageList = ref<Message[]>([]);

  const sendMsg = () => {
    if (!curMsg.value) {
      return;
    }

    messageList.value?.unshift({
      username: '小明',
      isSelf: true,
      content: curMsg.value
    });
    curMsg.value = '';

    // 滚动到头部
    wrapperRef.value?.scrollTo(0, 0);
  };

  const getMessage = async () => {
    if (loading.value) {
      return;
    }

    loading.value = true;
    await sleep();
    const data: Message[] = [];
    if (pageNum.value === 1) {
      data.push(...MessageDataInit);
    } else {
      const usernameList = ['小红', '小明'];
      for (let i = 10; i > 0; i--) {
        const index = Math.random() < 0.5 ? 0 : 1;
        const curUsername = usernameList[index];
        data.push({
          username: curUsername,
          isSelf: curUsername === usernameList[1],
          content: `这是第 ${messageList.value.length + i} 条历史记录`
        });
      }
    }
    const curList = data.reverse();
    messageList.value?.push(...curList);
    loading.value = false;
    pageNum.value += 1;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      // console.log('entry.isIntersecting', entry.isIntersecting);
      if (entry.isIntersecting) {
        getMessage();
      }
    },
    {
      root: null, // 使用默认的根元素（视窗）
      threshold: 0.5 //元素可见度超过 50% 时触发回调
    }
  );

  // 初始化执行
  onMounted(() => {
    getMessage();

    setTimeout(() => {
      placeholderRef.value && observer.observe(placeholderRef.value);
    }, 60);
  });

  onUnmounted(() => {
    placeholderRef.value && observer.unobserve(placeholderRef.value);
  });

  return {
    wrapperRef,
    placeholderRef,
    loading,
    curMsg,
    messageList,
    sendMsg,
    getMessage
  };
}
