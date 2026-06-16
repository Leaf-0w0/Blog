/**
 * Swup 管理器主入口
 * 协调所有子模块，提供统一的页面过渡管理
 */

import { initLinkPreloading } from "../utils/navigation-utils";
import { SwupHooksManager } from "./core/swup-hooks";
import {
	destroyTransitionEffect,
	getTransitionEffect,
} from "./effects/transition-effect";
import type { BackToTopHandler } from "./handlers/back-to-top-handler";
import {
	getBackToTopHandler,
	initBackToTopHandler,
} from "./handlers/back-to-top-handler";
import type { FancyboxHandler } from "./handlers/fancybox-handler";
import {
	cleanupFancybox,
	getFancyboxHandler,
	initFancybox,
} from "./handlers/fancybox-handler";
import type { PanelHandler } from "./handlers/panel-handler";
import { getPanelHandler, initPanelHandler } from "./handlers/panel-handler";
import { checkKatex, initCustomScrollbar } from "./handlers/scroll-handler";

/**
 * Swup 管理器类
 * 统一管理页面过渡相关的所有功能
 */
export class SwupManager {
	private hooksManager: SwupHooksManager | null = null;
	private fancyboxHandler: FancyboxHandler;
	private backToTopHandler: BackToTopHandler;
	private panelHandler: PanelHandler;

	private initialized = false;

	constructor() {
		// 初始化各个处理器
		this.fancyboxHandler = getFancyboxHandler();
		this.backToTopHandler = getBackToTopHandler();
		this.panelHandler = getPanelHandler();
	}

	/**
	 * 初始化 Swup 管理器
	 */
	async init(): Promise<void> {
		if (this.initialized) {
			return;
		}

		const transitionEffect = getTransitionEffect();
		transitionEffect.applyConfig();

		await this.initPanelHandler();

		// 初始化 Swup 钩子
		this.initSwupHooks();

		// 初始化返回顶部处理器
		initBackToTopHandler();

		// 初始化链接预加载
		this.initPreloading();

		this.initialized = true;
		console.log("SwupManager: 初始化完成");
	}

	/**
	 * 初始化面板处理器
	 */
	private async initPanelHandler(): Promise<void> {
		try {
			await initPanelHandler();
		} catch (error) {
			console.error("SwupManager: 面板处理器初始化失败", error);
		}
	}

	/**
	 * 初始化 Swup 钩子
	 */
	private initSwupHooks(): void {
		// 创建钩子管理器
		this.hooksManager = new SwupHooksManager({
			initFancybox: async () => {
				await initFancybox();
			},
			cleanupFancybox: () => {
				cleanupFancybox();
			},
			initCustomScrollbar: () => {
				initCustomScrollbar();
			},
			checkKatex: () => {
				checkKatex();
			},
		});

		// 如果 Swup 已经就绪，直接设置钩子
		if (window?.swup?.hooks) {
			initFancybox();
			checkKatex();
			this.hooksManager.registerHooks();
		} else {
			// 监听 Swup 就绪事件
			document.addEventListener("swup:enable", () => {
				if (this.hooksManager) {
					this.hooksManager.registerHooks();
				}
			});

			// 监听 DOM 加载（确保首屏也能加载优化组件）
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", async () => {
					await initFancybox();
					checkKatex();
				});
			} else {
				initFancybox();
				checkKatex();
			}
		}
	}

	/**
	 * 初始化链接预加载
	 */
	private initPreloading(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				initLinkPreloading();
			});
		} else {
			initLinkPreloading();
		}
	}

	/**
	 * 销毁管理器
	 */
	destroy(): void {
		this.hooksManager = null;
		this.fancyboxHandler.destroy();
		this.backToTopHandler.destroy();
		this.panelHandler.destroy();
		destroyTransitionEffect();
		this.initialized = false;
	}
}

// 创建全局实例
let globalSwupManager: SwupManager | null = null;

/**
 * 获取全局 Swup 管理器实例
 */
export function getSwupManager(): SwupManager {
	if (!globalSwupManager) {
		globalSwupManager = new SwupManager();
	}
	return globalSwupManager;
}

/**
 * 初始化 Swup 管理器（便捷函数）
 */
export async function initSwupManager(): Promise<void> {
	const manager = getSwupManager();
	await manager.init();
}
