export interface Message {
    id: string;
    user_name: string;
    content: string;
    timestamp: number;
}

// 此处全部为 ai 生成
export function formatTimestamp(timestamp: number): string {
    const messageDate = new Date(timestamp);
    const now = new Date();

    // 清除时分秒，只比较日期
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. 获取时间部分 (例如: "上午 10:33" 或 "下午 2:05")
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    const timeString = messageDate.toLocaleTimeString("zh-CN", timeOptions);

    // 2. 根据时间跨度进行条件判断
    if (messageDate >= today) {
        // 今天
        return timeString;
    } else if (messageDate >= yesterday) {
        // 昨天
        return `昨天 ${timeString}`;
    } else if (messageDate >= oneWeekAgo) {
        // 一周内 (上周)
        return `上周 ${timeString}`;
    } else if (messageDate.getFullYear() === now.getFullYear()) {
        // 今年内 (例如: "5月26日")
        return messageDate.toLocaleDateString("zh-CN", {
            month: "numeric",
            day: "numeric",
        });
    } else {
        // 跨年 (例如: "2025年1月1日")
        return messageDate.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
    }
}
