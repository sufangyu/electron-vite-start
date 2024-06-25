import { UPDATER_STATE } from '@modules/frame/setting';

export interface Props {
  visible: boolean;
  title: string;
  content: string;
  state: UPDATER_STATE;
  hasNewVersion: boolean;
  progress: number;
  /** 是否强制更新 */
  isForce?: boolean;
}
