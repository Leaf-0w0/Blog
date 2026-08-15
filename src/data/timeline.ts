import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "current-study",
		title: "福建林职院 · 大数据技术",
		description: "目前正在大学专科学习大数据技术，包括Hadoop、Spark等。",
		type: "education",
		startDate: "2024-09-01",
		location: "Fujian",
		organization: "福建林业职业技术学院",
		skills: ["Hadoop", "Spark", "Python", "JavaScript", "HTML/CSS", "MySQL"],
		icon: "material-symbols:school",
		color: "#059669",
		featured: true,
	},
	{
		id: "maintain-the-mizuki-project",
		title: "维护 Mizuki 项目",
		description: "参与 Mizuki 项目的维护和更新，修复bug并添加新功能。",
		type: "project",
		startDate: "2025-12-24",
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Svelte", "Swup", "Git"],
		links: [
			{
				name: "代码仓库",
				url: "https://github.com/LyraVoid/Mizuki",
				type: "project",
			},
			{
				name: "在线演示",
				url: "https://mizuki.mysqil.com/",
				type: "website",
			},
		],
		icon: "material-symbols:code",
		color: "#EC4899",
		featured: true,
	},
	{
		id: "maintain-the-aruma-project",
		title: "维护 Aruma 项目",
		description: "参与 Aruma 项目的维护和更新，修复bug并添加新功能。",
		type: "project",
		startDate: "2026-03-08",
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Svelte", "MDUI", "Git"],
		links: [
			{
				name: "代码仓库",
				url: "https://github.com/LyraVoid/Aruma",
				type: "project",
			},
			{
				name: "在线演示",
				url: "https://aruma.mysqil.com/",
				type: "website",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
];
