import { App } from 'vue';

const directives = import.meta.glob('./*.directive.ts', { eager: true });

export default function registerDirectives(app: App<Element>) {
  for (const key of Object.keys(directives)) {
    const directive = directives[key] as { default: () => void };
    const { name } = directive.default;

    if (name) {
      app.directive(name, directive.default);
    } else {
      console.error(`文件 ${key} 缺少 name 配置项`);
    }
  }
}
