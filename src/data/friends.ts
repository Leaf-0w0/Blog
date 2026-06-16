// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "GoForceX's Blog",
		imgurl: "https://goforcex.top/upload/67143590.jpeg",
		desc: "摆烂的小站",
		siteurl: "https://goforcex.top/",
		tags: ["Blog", "Friends"],
	},
	{
		id: 2,
		title: "PuddingKC's Blog",
		imgurl: "https://img.fastmirror.net/s/2024/11/13/6734c3d353861.png",
		desc: "愿你所热爱的依旧不减当年。",
		siteurl: "https://www.puddingkc.com/",
		tags: ["Blog", "Friends"],
	},
	{
		id: 3,
		title: "晨叶梦春的小屋",
		imgurl: "https://www.yumeharu.top/images/icon_compressed.png",
		desc: "Not for the best, just for the better.",
		siteurl: "https://www.yumeharu.top/",
		tags: ["Blog", "Friends"],
	},
	{
		id: 4,
		title: "水水的小屋~",
		imgurl: "https://www.happycola.top/img/avatar.png",
		desc: "写点有趣的东东 awa",
		siteurl: "https://www.happycola.top/",
		tags: ["Blog", "Friends"],
	},
	{
		id: 5,
		title: "芹香のblog",
		imgurl: "https://imgs.977958.xyz/uploads//684dac2732bba_.jpg",
		desc: "芹香のblog，一个游戏站点兼信息技术交流小站，欢迎来玩♡",
		siteurl: "https://blog.serikawa.top/",
		tags: ["Blog"],
	},
	{
		id: 6,
		title: "Fishの秘密基地",
		imgurl: "https://avatars.githubusercontent.com/u/153370854",
		desc: "在代码与文字交织的世界里，记录科技浪潮中的个人思考与生活感悟。",
		siteurl: "https://www.cantonesefish.com/",
		tags: ["Blog"],
	},
	{
		id: 7,
		title: "栖童の小站",
		imgurl: "https://blog.linux-qitong.top/img/avatar.webp",
		desc: "越努力,越幸运",
		siteurl: "https://blog.linux-qitong.top",
		tags: ["Blog"],
	},
	{
		id: 8,
		title: "松坂日记",
		imgurl: "https://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
		desc: "世界は大きい、君は行かなければならない",
		siteurl: "https://blog.mysqil.com/",
		tags: ["Blog", "Friends"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
