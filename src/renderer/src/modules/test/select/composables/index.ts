import { sleep } from '@core/utils';

import { optionData, optionDataVirtual, optionGroupVirtual, optionsGroup, cityData } from './data';

export function useSelect() {
  // 常规选择器
  const singleVal = ref(optionData[0].value);
  const multipleVal = ref([optionData[0], optionData[1]]);
  const labelTemplVal = ref([optionData[0].value]);
  const checkAllVal = ref([optionData[0], optionData[1]]);
  const groupVal = ref(['Guangzhou']);

  // 带分页选择器
  const paginationOption = ref({
    pageNum: 1,
    pageSize: 8,
    total: 0
  });
  const loading = ref(false);
  const cities = ref<{ label?: string; value?: string }[]>([]);
  const cityList = ref<{ label: string; value: string }[]>([]);
  const getCityList = async (pageNum: number, pageSize: number = 10) => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    loading.value = true;
    await sleep(1500);
    const curCityList = cityData.slice(startIndex, endIndex);
    cityList.value = curCityList;
    paginationOption.value.total = cityData.length;
    loading.value = false;
  };

  onMounted(() => {
    getCityList(paginationOption.value.pageNum, paginationOption.value.pageSize);
  });

  // 虚拟化选择器
  const singleVirtualVal = ref('');
  const multipleVirtualVal = ref([optionDataVirtual[1].value]);
  const groupValVal = ref([optionGroupVirtual[0].options[1].value]);

  return {
    optionData,
    optionsGroup,
    optionDataVirtual,
    optionGroupVirtual,
    //
    paginationOption,
    cities,
    cityList,
    loading,
    getCityList,
    // 常规选择器
    singleVal,
    multipleVal,
    labelTemplVal,
    checkAllVal,
    groupVal,
    // 虚拟化选择器
    singleVirtualVal,
    multipleVirtualVal,
    groupValVal
  };
}
