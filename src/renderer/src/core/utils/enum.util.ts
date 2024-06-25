/**
 * 根据枚举值获取枚举key
 *
 * @export
 * @template T
 * @param {T} myEnum 枚举对象
 * @param {string} enumValue 枚举值
 * @return {*}  {(keyof T | null)}
 */
export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string
): keyof T | null {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : enumValue === 'undefined' ? null : enumValue;
}
