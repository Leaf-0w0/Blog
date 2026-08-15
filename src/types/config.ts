import type {
	DARK_MODE,
	LIGHT_MODE,
} from "../constants/constants";

export interface SiteConfig {
	title: string;
	subtitle: string;
	siteURL: string; // 站点URL，以斜杠结尾，例如：https://mizuki.mysqil.com/
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">
	siteStartDate?: string; // 站点开始日期，格式：YYYY-MM-DD，用于计算运行天数

	lang: "en" | "zh_CN" | "zh_TW" | "ja";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// 特色页面开关配置
	featurePages: {
		anime: boolean; // 番剧页面开关
		diary: boolean; // 日记页面开关
		friends: boolean; // 友链页面开关
		projects: boolean; // 项目页面开关
		skills: boolean; // 技能页面开关
		timeline: boolean; // 时间线页面开关
		albums: boolean; // 相册页面开关
		devices: boolean; // 设备页面开关
	};

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		allowSwitch: boolean; // 是否允许用户切换布局
		categoryBar?: {
			enable: boolean; // 是否在文章列表页显示分类导航条
		};
	};

	// 顶栏标题配置
	navbarTitle: {
		logo: string; // 网站 Logo 图片路径
	};

	// 页面自动缩放配置
	pageScaling?: {
		enable: boolean; // 是否开启自动缩放
		targetWidth?: number; // 目标宽度，低于此宽度时开始缩放
	};

	// 添加字体配置
	font: {
		asciiFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
		cjkFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
	};

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
		fetchOnDev?: boolean;
	};

	// 添加番剧页面配置
	anime?: {
		mode?: "bangumi" | "local"; // 番剧页面模式
	};

	// 日记页面 Memos API 地址，客户端 fetch 获取动态数据
	diaryApiUrl?: string;

	// 标签样式配置
	tagStyle?: {
		useNewStyle?: boolean; // 是否使用新样式（悬停高亮样式）还是旧样式（外框常亮样式）
	};

	toc: {
		enable: boolean; // 总开关，false 时所有 TOC 都不显示
		mobileTop: boolean; // 手机端顶部 TOC 按钮
		desktopSidebar: boolean; // 电脑端右侧边栏 TOC
		floating: boolean; // 悬浮 TOC 按钮
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // 使用日语假名标记（あいうえお...）代替数字
	};
	showCoverInContent: boolean; // 控制文章封面在文章内容页显示的开关
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // 控制"上次编辑"卡片显示的开关
	pageProgressBar?: PageProgressBarConfig; // 页面顶部进度条配置
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // 第三方统计配置
}

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Anime = 4,
	Diary = 5,
	Albums = 6,
	Projects = 7,
	Skills = 8,
	Timeline = 9,
}

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
}

export interface ProfileConfig {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	typewriter?: {
		enable: boolean; // 是否启用打字机效果
		speed?: number; // 打字速度（毫秒）
	};
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink 配置
export interface PermalinkConfig {
	enable: boolean; // 是否启用全局 permalink 功能
	/**
	 * permalink 格式模板
	 * 支持的占位符：
	 * - %year% : 4位年份 (2024)
	 * - %monthnum% : 2位月份 (01-12)
	 * - %day% : 2位日期 (01-31)
	 * - %hour% : 2位小时 (00-23)
	 * - %minute% : 2位分钟 (00-59)
	 * - %second% : 2位秒数 (00-59)
	 * - %post_id% : 文章序号（按发布时间升序排列）
	 * - %postname% : 文章文件名（slug）
	 * - %category% : 分类名（无分类时为 "uncategorized"）
	 *
	 * 示例：
	 * - "%year%-%monthnum%-%postname%" => "2024-12-my-post"
	 * - "%post_id%-%postname%" => "42-my-post"
	 * - "%category%-%postname%" => "tech-my-post"
	 *
	 * 注意：不支持斜杠 "/"，所有生成的链接都在根目录下
	 */
	format: string;
}

// 评论配置

export interface CommentConfig {
	enable: boolean; // 是否启用评论功能
	giscus?: GiscusConfig;
}

export interface GiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export interface BlogPostData {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export interface ExpressiveCodeConfig {
	theme: string;
	hideDuringThemeTransition?: boolean; // 是否在主题切换时隐藏代码块
}

export interface AnnouncementConfig {
	// enable属性已移除，现在通过sidebarLayoutConfig统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容
	icon?: string; // 公告栏图标
	type?: "info" | "warning" | "success" | "error"; // 公告类型
	closable?: boolean; // 是否可关闭
	link?: {
		enable: boolean; // 是否启用链接
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
}

export interface FooterConfig {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
}

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // 卡片式目录组件
	| "site-stats" // 站点统计组件
	| "calendar" // 日历组件
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // 组件类型
	position: "top" | "sticky"; // 组件位置：顶部固定区域或粘性区域
	class?: string; // 自定义CSS类名
	style?: string; // 自定义内联样式
	animationDelay?: number; // 动画延迟时间（毫秒）
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, any>; // 自定义属性，用于扩展组件功能
}

export interface SidebarLayoutConfig {
	properties: WidgetComponentConfig[]; // 组件配置列表
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 每个组件递增的延迟时间（毫秒）
	};
	responsive: {
		breakpoints: {
			mobile: number; // 移动端断点（px）
			tablet: number; // 平板端断点（px）
			desktop: number; // 桌面端断点（px）
		};
	};
}

/**
 * 分享组件配置
 */
export interface ShareConfig {
	enable: boolean; // 是否启用分享功能
}

/**
 * 相关文章组件配置
 */
export interface RelatedPostsConfig {
	enable: boolean; // 是否启用相关文章功能
	maxCount: number; // 相关文章数量
}

/**
 * 随机文章组件配置
 */
export interface RandomPostsConfig {
	enable: boolean; // 是否启用随机文章功能
	maxCount: number; // 随机文章数量
}

/**
 * 页面顶部进度条配置
 */
export interface PageProgressBarConfig {
	enable: boolean; // 是否启用页面顶部进度条
	height?: number; // 进度条高度，默认 3px
	duration?: number; // 动画时长，默认 8000ms
}

/**
 * 第三方统计配置（可能影响 Lighthouse 评分）
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // 是否启用第三方统计（Microsoft Clarity），默认关闭
	clarityId?: string; // Clarity 项目 ID
}
