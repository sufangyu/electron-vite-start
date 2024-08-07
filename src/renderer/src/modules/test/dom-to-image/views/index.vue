<template>
  <AppMain title="DOM转图片">
    <div class="p-3">
      <Card title="展示内容">
        <el-button type="primary" @click="handleDomToImage">生成图片</el-button>
        <DomToImage ref="domToImageRef">
          <div class="mb-4">
            <h3>常规文本</h3>
            <div>
              <h1>这是一个标题。</h1>
              <h2>这是一个标题。</h2>
              <h3>这是一个标题。</h3>
              <p>这是一个段落</p>
              <p>这是另一个段落</p>
              <p class="ignore-dom">这是要过滤的段落元素</p>
            </div>
            <div class="ignore-dom">
              这是要过滤的 DIV 元素
              <p>这是要过滤的 DIV 元素中的段落元素</p>
            </div>

            <div class="flex flex-row gap-2">
              <div
                class="basis-1/4 py-4 rounded-lg flex items-center justify-center bg-fuchsia-500 shadow-lg"
              >
                01
              </div>
              <div
                class="basis-1/4 py-4 rounded-lg flex items-center justify-center bg-fuchsia-500 shadow-lg"
              >
                02
              </div>
              <div
                class="basis-1/2 py-4 rounded-lg flex items-center justify-center bg-fuchsia-500 shadow-lg"
              >
                03
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h3 style="background-color: red">字体图标</h3>
            <div class="flex gap-2 p-2">
              <Download />
              <Download size="25" :stroke-width="4" />
            </div>
          </div>

          <div class="mb-4">
            <h3>图片</h3>
            <p>
              <img
                style="width: 80px; border-radius: 16px"
                src="https://avatars.githubusercontent.com/u/1852629"
                alt=""
              />
            </p>
          </div>

          <div class="mb-4">
            <h3>表格、按钮</h3>
            <div class="relative overflow-x-auto sm:rounded-lg">
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Product name</th>
                    <th scope="col" class="px-6 py-3">Color</th>
                    <th scope="col" class="px-6 py-3">Category</th>
                    <th scope="col" class="px-6 py-3">Price</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">Silver</td>
                    <td class="px-6 py-4">Laptop</td>
                    <td class="px-6 py-4">$2999</td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a
                      >
                    </td>
                  </tr>
                  <tr
                    class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Microsoft Surface Pro
                    </th>
                    <td class="px-6 py-4">White</td>
                    <td class="px-6 py-4">Laptop PC</td>
                    <td class="px-6 py-4">$1999</td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a
                      >
                    </td>
                  </tr>
                  <tr
                    class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Magic Mouse 2
                    </th>
                    <td class="px-6 py-4">Black</td>
                    <td class="px-6 py-4">Accessories</td>
                    <td class="px-6 py-4">$99</td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a
                      >
                    </td>
                  </tr>
                  <tr
                    class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Google Pixel Phone
                    </th>
                    <td class="px-6 py-4">Gray</td>
                    <td class="px-6 py-4">Phone</td>
                    <td class="px-6 py-4">$799</td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple Watch 5
                    </th>
                    <td class="px-6 py-4">Red</td>
                    <td class="px-6 py-4">Wearables</td>
                    <td class="px-6 py-4">$999</td>
                    <td class="px-6 py-4">
                      <a
                        href="#"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >Edit</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Blue
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Green
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Cyan
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Teal
              </button>
              <button
                type="button"
                class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Lime
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Red
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Pink
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Purple
              </button>
            </div>
          </div>

          <div class="mb-4">
            <h3>Canvas</h3>
            <canvas id="myCanvas" width="200" height="100" style="border: 1px solid #c3c3c3" />
          </div>

          <div class="mb-4">
            <h3>UI框架</h3>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="Date" width="180" />
              <el-table-column prop="name" label="Name" width="180" />
              <el-table-column prop="address" label="Address" />
            </el-table>
            <el-button class="mt-2" type="primary">按钮</el-button>
          </div>
        </DomToImage>
      </Card>

      <Card title="生成的图片">
        <img style="width: 100%" :src="imgData" alt="" />
      </Card>
    </div>
  </AppMain>
</template>

<script lang="ts" setup>
import { Download } from '@icon-park/vue-next';

import { DomToImage } from '@components/dom-to-image';

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
];

const domToImageRef = ref<InstanceType<typeof DomToImage> | null>(null);
const imgData = ref('');
const handleDomToImage = async () => {
  imgData.value = (await domToImageRef.value?.generateToImage({
    // type: 'svg',
    config: {
      bgcolor: 'transparent',
      filter(node) {
        const hasIgnore = !!node?.classList?.contains('ignore-dom');
        return !hasIgnore;
      }
    }
  })) as string;
};

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // 绘制色块
    ctx!.fillStyle = '#eee';
    ctx!.fillRect(0, 0, 150, 75);
    // 绘制线
    ctx!.moveTo(0, 0);
    ctx!.lineTo(200, 100);
    ctx!.stroke();
    // 画圆
    ctx!.beginPath();
    ctx!.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx!.stroke();
    // 文本
    ctx!.fillStyle = '#000';
    ctx!.font = '30px Arial';
    ctx!.fillText('Hello World', 10, 50);
  }, 250);
});
</script>

<style lang="scss" scoped></style>
