export const optionData = [
  { label: 'Option1', value: 1 },
  { label: 'Option2', value: 2 },
  { label: 'Option3', value: 3, disabled: true },
  { label: 'Option4', value: 4 },
  { label: 'Option5', value: 5 }
];

// 分组选择器数据
export const optionsGroup = [
  {
    label: '热门城市',
    options: [
      {
        value: 'Shanghai',
        label: '上海'
      },
      {
        value: 'Beijing',
        label: '北京'
      }
    ]
  },
  {
    label: '城市名称',
    options: [
      {
        value: 'Chengdu',
        label: '成都'
      },
      {
        value: 'Shenzhen',
        label: '深圳'
      },
      {
        value: 'Guangzhou',
        label: '广州'
      },
      {
        value: 'Dalian',
        label: '大连'
      }
    ]
  }
];

// 虚拟化选择器数据
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
export const optionDataVirtual = Array.from({ length: 100 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
  disabled: idx % 5 === 0
}));

// 虚拟化选择器分组数据
export const optionGroupVirtual = Array.from({ length: 10 }).map((_, idx) => {
  const label = idx + 1;
  return {
    value: `Group ${label}`,
    label: `Group ${label}`,
    options: Array.from({ length: 10 }).map((_, idx) => ({
      value: `Option ${idx + 1 + 10 * label}`,
      label: `${initials[idx % 10]}${idx + 1 + 10 * label}`
    }))
  };
});

// 城市列表
export const cityData = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '天津', value: 'tianjin' },
  { label: '重庆', value: 'chongqing' },
  { label: '成都', value: 'chengdu' },
  { label: '杭州', value: 'hangzhou' },
  { label: '武汉', value: 'wuhan' },
  { label: '南京', value: 'nanjing' },
  { label: '西安', value: 'xian' },
  { label: '苏州', value: 'suzhou' },
  { label: '沈阳', value: 'shenyang' },
  { label: '青岛', value: 'qingdao' },
  { label: '大连', value: 'dalian' },
  { label: '厦门', value: 'xiamen' },
  { label: '济南', value: 'jinan' },
  { label: '长沙', value: 'changsha' },
  { label: '合肥', value: 'hefei' },
  { label: '郑州', value: 'zhengzhou' },
  { label: '哈尔滨', value: 'haerbin' },
  { label: '南昌', value: 'nanchang' },
  { label: '贵阳', value: 'guiyang' },
  { label: '台北', value: 'taipei' },
  { label: '香港', value: 'xianggang' },
  { label: '澳门', value: 'aomen' },
  { label: '长春', value: 'changchun' },
  { label: '乌鲁木齐', value: 'wulumuqi' },
  { label: '石家庄', value: 'shijiazhuang' },
  { label: '兰州', value: 'lanzhou' },
  { label: '呼和浩特', value: 'huhehaote' },
  { label: '银川', value: 'yinchuan' },
  { label: '西宁', value: 'xining' },
  { label: '泉州', value: 'quanzhou' },
  { label: '南宁', value: 'nanning' },
  { label: '佛山', value: 'foshan' },
  { label: '唐山', value: 'tangshan' },
  { label: '临沂', value: 'linyi' },
  { label: '徐州', value: 'xuzhou' },
  { label: '南通', value: 'nantong' },
  { label: '温州', value: 'wenzhou' },
  { label: '东莞', value: 'dongguan' },
  { label: '珠海', value: 'zhuhai' },
  { label: '江门', value: 'jiangmen' },
  { label: '贵港', value: 'guigang' },
  { label: '中山', value: 'zhongshan' },
  { label: '桂林', value: 'guilin' },
  { label: '茂名', value: 'maoming' },
  { label: '肇庆', value: 'zhaoqing' },
  { label: '扬州', value: 'yangzhou' },
  { label: '镇江', value: 'zhenjiang' },
  { label: '马鞍山', value: 'maanshan' },
  { label: '淮安', value: 'huaian' },
  { label: '滁州', value: 'chuzhou' },
  { label: '宿迁', value: 'suqian' },
  { label: '温州', value: 'wenzhou' },
  { label: '聊城', value: 'liaocheng' },
  { label: '德州', value: 'dezhou' },
  { label: '济宁', value: 'jining' },
  { label: '菏泽', value: 'heze' },
  { label: '潍坊', value: 'weifang' },
  { label: '日照', value: 'rizhao' },
  { label: '临沂', value: 'linyi' },
  { label: '莱芜', value: 'laiwu' },
  { label: '章丘', value: 'zhangqiao' },
  { label: '淄博', value: 'zibo' },
  { label: '枣庄', value: 'zaozhuang' }
];
