import { ElMessage, ElMessageBox } from 'element-plus';

import { OptionType } from '@modules/video/types';
import { useVideoConfigStore } from '@store/index';

export default () => {
  const { config } = useVideoConfigStore();

  /** 新值 */
  const newValue = ref<string>('');

  /**
   * 校验新增配置项值是否符合要求
   * - 分辨率格式：3-5位数字， x分隔，3-5位数字
   * - 帧数格式：1~2位数字
   *
   * @param {OptionType} type 验证类型
   * @return {*}  {boolean} 验证通过时，返回true。否则返回false
   */
  const addOptionValidate = (type: OptionType): boolean => {
    let errMsg = '';
    switch (type) {
      case 'size':
        if (!newValue.value) {
          errMsg = '分辨率不能为空';
        } else if (!/^\d{3,5}x\d{3,5}$/.test(newValue.value)) {
          // 3-5位数字，x分隔，3-5位数字
          errMsg = '分辨率格式错误';
        }
        break;
      case 'fps':
        if (!newValue.value) {
          errMsg = '帧数不能为空';
        } else if (!/^\d{1,2}$/.test(newValue.value)) {
          // 1~2位数字
          errMsg = '帧数格式错误';
        }
        break;
    }

    if (errMsg !== '') {
      ElMessage.warning({ message: errMsg, grouping: true });
    }

    return errMsg === '';
  };

  /**
   * 添加配置项目
   *
   * @param {OptionType} type 类型
   */
  const addOption = (type: OptionType) => {
    const validatePass = addOptionValidate(type);

    if (!validatePass) {
      return;
    }

    switch (type) {
      case 'size':
        config.sizeOptions.push(newValue.value);
        break;
      case 'fps':
        config.fpsOptions.push(newValue.value);
        break;
      default:
    }

    ElMessage({ type: 'success', message: '添加成功', grouping: true });
    newValue.value = '';
  };

  /**
   * 删除配置项目
   *
   * @param {OptionType} type
   * @param {number} index
   */
  const removeOption = async (type: OptionType, index: number) => {
    await ElMessageBox.confirm('确定删除吗？');
    switch (type) {
      case 'size':
        config.sizeOptions.splice(index, 1);
        break;
      case 'fps':
        config.fpsOptions.splice(index, 1);
        break;
      default:
    }

    ElMessage({ type: 'success', message: '删除成功', grouping: true });
  };

  return {
    newValue,
    addOption,
    removeOption
  };
};
