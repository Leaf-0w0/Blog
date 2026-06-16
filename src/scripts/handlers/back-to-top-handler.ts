/**
 * 返回顶部处理器
 * 管理返回顶部按钮和滚动监听
 */

import { SCROLL_CONFIG, SWUP_SELECTORS } from "../core/swup-config";
import { ScrollHandler } from "./scroll-handler";

/**
 * 返回顶部处理器类
 * 负责返回顶部按钮的显示/隐藏和滚动位置监听
 */
export class BackToTopHandler {
	private backToTopBtn: HTMLElement | null = null;
	private scrollHandler: () => void;

	constructor() {
		this.scrollHandler = ScrollHandler.throttle(
			this.handleScroll.bind(this),
			SCROLL_CONFIG.throttleInterval,
		);
	}

	/**
	 * 初始化返回顶部处理器
	 */
	init(): void {
		this.cacheElements();
		this.bindEvents();
	}

	/**
	 * 缓存 DOM 元素
	 */
	private cacheElements(): void {
		this.backToTopBtn = document.getElementById(
			SWUP_SELECTORS.backToTopBtn.slice(1),
		);
	}

	/**
	 * 绑定事件监听
	 */
	private bindEvents(): void {
		// 使用 passive 事件监听器提升滚动性能
		window.addEventListener("scroll", this.scrollHandler, {
			passive: true,
		});
	}

	/**
	 * 处理滚动事件
	 */
	private handleScroll(): void {
		const scrollTop = document.documentElement.scrollTop;

		// 计算返回顶部按钮显示阈值
		const showBackToTopThreshold = this.calculateShowThreshold(scrollTop);

		// 批量处理 DOM 操作
		requestAnimationFrame(() => {
			this.updateBackToTopButton(scrollTop, showBackToTopThreshold);
		});
	}

	/**
	 * 计算返回顶部按钮显示阈值
	 */
	private calculateShowThreshold(scrollTop: number): number {
		const contentWrapper = document.getElementById(
			SWUP_SELECTORS.contentWrapper.slice(1),
		);
		let threshold = window.innerHeight / 2 + SCROLL_CONFIG.backToTopOffset;

		if (contentWrapper) {
			const rect = contentWrapper.getBoundingClientRect();
			const absoluteTop = rect.top + scrollTop;
			threshold = absoluteTop + window.innerHeight / 4;
		}

		return threshold;
	}

	/**
	 * 更新返回顶部按钮可见性
	 */
	private updateBackToTopButton(scrollTop: number, threshold: number): void {
		if (!this.backToTopBtn) {
			return;
		}

		if (scrollTop > threshold) {
			this.backToTopBtn.classList.remove("hide");
		} else {
			this.backToTopBtn.classList.add("hide");
		}
	}

	/**
	 * 销毁处理器
	 */
	destroy(): void {
		window.removeEventListener("scroll", this.scrollHandler);
		this.backToTopBtn = null;
	}
}

// 创建全局实例
let globalBackToTopHandler: BackToTopHandler | null = null;

/**
 * 获取全局返回顶部处理器实例
 */
export function getBackToTopHandler(): BackToTopHandler {
	if (!globalBackToTopHandler) {
		globalBackToTopHandler = new BackToTopHandler();
	}
	return globalBackToTopHandler;
}

/**
 * 初始化返回顶部处理器（便捷函数）
 */
export function initBackToTopHandler(): void {
	const handler = getBackToTopHandler();
	handler.init();
}
