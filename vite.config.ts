import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * 把构建产物内联成一个自包含的 index.html。
 *
 * 目的：site/index.html 可以直接双击用浏览器打开（file:// 协议）。
 * 普通构建会拆出外链的 .js / .css，而 file:// 下 ES module 会被 CORS 拦掉，
 * 页面就会白屏——内联之后就没有外部请求了。
 */
function singleFileHtml(): Plugin {
  return {
    name: "single-file-html",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const htmlKey = Object.keys(bundle).find(
        (key) => bundle[key].type === "asset" && key.endsWith(".html")
      )
      if (!htmlKey) return

      const html = bundle[htmlKey]
      if (html.type !== "asset") return

      let source = String(html.source)

      for (const [key, output] of Object.entries(bundle)) {
        if (key === htmlKey) continue

        if (output.type === "chunk") {
          source = source.replace(
            new RegExp(`<script[^>]+src="[^"]*${escapeRegExp(key)}"[^>]*></script>`),
            () => `<script type="module">\n${output.code}\n</script>`
          )
          delete bundle[key]
          continue
        }

        if (output.type === "asset" && key.endsWith(".css")) {
          source = source.replace(
            new RegExp(`<link[^>]+href="[^"]*${escapeRegExp(key)}"[^>]*>`),
            () => `<style>\n${String(output.source)}\n</style>`
          )
          delete bundle[key]
        }
      }

      // 资源已内联，顺手清掉残留的预加载链接
      source = source.replace(/\s*<link[^>]+rel="modulepreload"[^>]*>/g, "")

      html.source = source
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), singleFileHtml()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "site",
    // 不清理输出目录：产物是单文件，重复构建只需覆盖，
    // 也避免某些环境对目录删除的限制导致构建失败
    emptyOutDir: false,
    cssCodeSplit: false,
    // 图片等小资源也一起内联，保证产物只有一个文件
    assetsInlineLimit: 100 * 1024 * 1024,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
